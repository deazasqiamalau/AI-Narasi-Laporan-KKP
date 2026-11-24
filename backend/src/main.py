import json
import os
import sys
import threading
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Optional

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

try:
    from supabase import Client, create_client
except ImportError:
    Client = Any
    create_client = None

try:
    from google import genai
except ImportError:
    genai = None

try:
    import groq
except ImportError:
    groq = None

# Muat .env dari folder backend/ (atau root proyek sebagai fallback)
BACKEND_DIR = Path(__file__).resolve().parents[1]
BACKEND_ENV_PATH = BACKEND_DIR / ".env"
ROOT_ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
KATALOG_CACHE_FILE = BACKEND_DIR / "katalog_cache.json"

if BACKEND_ENV_PATH.exists():
    load_dotenv(BACKEND_ENV_PATH)
elif ROOT_ENV_PATH.exists():
    load_dotenv(ROOT_ENV_PATH)
else:
    load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
GROQ_KEYS_STR = os.getenv("GROQ_API_KEYS") or os.getenv("GROQ_API_KEY")
SATUDATA_KEY = os.getenv("SATUDATA_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not GEMINI_KEY and not GROQ_KEYS_STR:
    print("ERROR: GEMINI_API_KEY atau GROQ_API_KEYS tidak ditemukan di .env")
    sys.exit(1)
if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
    print("ERROR: SUPABASE_URL atau SUPABASE_SECRET_KEY tidak ditemukan di .env")
    sys.exit(1)


class _RestResponse:
    def __init__(self, data: list):
        self.data = data


class _RestTableQuery:
    """Klien PostgREST berbasis requests yang mendukung JWT maupun sb_secret_ key Supabase."""

    def __init__(self, base_url: str, secret_key: str, table_name: str):
        self.endpoint = f"{base_url.rstrip('/')}/rest/v1/{table_name}"
        self.secret_key = secret_key
        self.headers = {
            "apikey": secret_key,
            "Content-Type": "application/json",
        }
        if secret_key.startswith("eyJ"):
            self.headers["Authorization"] = f"Bearer {secret_key}"
        self.params: dict[str, Any] = {}
        self.range_header: Optional[str] = None
        self._upsert_payload: Optional[list] = None
        self._on_conflict: Optional[str] = None

    def select(self, columns: str = "*"):
        self.params["select"] = columns
        return self

    def order(self, column: str, desc: bool = False):
        direction = "desc" if desc else "asc"
        self.params["order"] = f"{column}.{direction}"
        return self

    def limit(self, count: int):
        self.params["limit"] = str(count)
        return self

    def range(self, start: int, end: int):
        self.range_header = f"{start}-{end}"
        return self

    def ilike(self, column: str, pattern: str):
        self.params[column] = f"ilike.{pattern}"
        return self

    def eq(self, column: str, value: Any):
        self.params[column] = f"eq.{value}"
        return self

    def upsert(self, payload: list, on_conflict: Optional[str] = None):
        self._upsert_payload = payload
        self._on_conflict = on_conflict
        return self

    def execute(self) -> _RestResponse:
        req_headers = dict(self.headers)
        if self.range_header:
            req_headers["Range-Unit"] = "items"
            req_headers["Range"] = self.range_header

        if self._upsert_payload is not None:
            req_headers["Prefer"] = "resolution=merge-duplicates,return=minimal"
            params = {}
            if self._on_conflict:
                params["on_conflict"] = self._on_conflict
            resp = requests.post(
                self.endpoint,
                headers=req_headers,
                params=params,
                json=self._upsert_payload,
                timeout=20,
            )
            if resp.status_code in (401, 403) and "Authorization" not in req_headers:
                req_headers["Authorization"] = f"Bearer {self.secret_key}"
                resp = requests.post(
                    self.endpoint,
                    headers=req_headers,
                    params=params,
                    json=self._upsert_payload,
                    timeout=20,
                )
            resp.raise_for_status()
            return _RestResponse([])

        resp = requests.get(
            self.endpoint,
            headers=req_headers,
            params=self.params,
            timeout=20,
        )
        if resp.status_code in (401, 403) and "Authorization" not in req_headers:
            req_headers["Authorization"] = f"Bearer {self.secret_key}"
            resp = requests.get(
                self.endpoint,
                headers=req_headers,
                params=self.params,
                timeout=20,
            )
        resp.raise_for_status()
        return _RestResponse(resp.json() if resp.text else [])


class _SupabaseRestFallback:
    def __init__(self, url: str, key: str):
        self.url = url
        self.key = key

    def table(self, name: str) -> _RestTableQuery:
        return _RestTableQuery(self.url, self.key, name)


gemini_client = None
groq_client = None

if GROQ_KEYS_STR and groq is not None:
    groq_key = GROQ_KEYS_STR.split(",")[0].strip()
    groq_client = groq.Groq(api_key=groq_key)

if GEMINI_KEY and genai is not None:
    gemini_client = genai.Client(api_key=GEMINI_KEY)

rest_supabase = _SupabaseRestFallback(SUPABASE_URL, SUPABASE_SECRET_KEY)
if create_client is not None and SUPABASE_SECRET_KEY.startswith("eyJ"):
    supabase: Any = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
else:
    supabase = rest_supabase

GEMINI_MODELS = [
    os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
    "gemini-2.0-flash",
    "gemini-3.5-flash",
]
GROQ_MODEL_NAME = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

BASE_URL = "https://satudata.acehprov.go.id/api/v1.1"
headers = {"APIKEY": SATUDATA_KEY} if SATUDATA_KEY else {}

FIELD_METADATA = {
    "bps_kode_provinsi", "bps_nama_provinsi", "kemendagri_kode_provinsi", "kemendagri_nama_provinsi",
    "bps_kode_kabupaten_kota", "bps_nama_kabupaten_kota", "kemendagri_kode_kabupaten_kota", "kemendagri_nama_kabupaten_kota",
    "bps_kode_kecamatan", "bps_nama_kecamatan", "kemendagri_kode_kecamatan", "kemendagri_nama_kecamatan",
    "bps_kode_desa", "bps_nama_desa", "kemendagri_kode_desa", "kemendagri_nama_desa",
    "tahun", "tingkat_penyajian", "created_at", "updated_at", "deleted_at", "id", "uuid", "satuan"
}

_KATALOG_MEMORI: list[dict[str, str]] = []
_DUMMY_UUIDS = {
    "aceh-penduduk-2022-2024",
    "aceh-pendidikan-sekolah-dasar",
    "aceh-kesehatan-sarana",
    "aceh-kemiskinan-kabkota",
    "aceh-ekonomi-pad",
}


def _muat_cache_file() -> list[dict[str, str]]:
    if KATALOG_CACHE_FILE.exists():
        try:
            data = json.loads(KATALOG_CACHE_FILE.read_text(encoding="utf-8"))
            if isinstance(data, list) and len(data) > 0:
                bersih = [d for d in data if d.get("uuid") not in _DUMMY_UUIDS]
                if len(bersih) >= 50:
                    return bersih
        except Exception:
            pass
    return []


def _simpan_cache_file(katalog: list[dict[str, str]]) -> None:
    global _KATALOG_MEMORI
    if not katalog:
        return
    _KATALOG_MEMORI = katalog
    try:
        KATALOG_CACHE_FILE.write_text(
            json.dumps(katalog, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
    except Exception:
        pass


def simpan_katalog(dataset_list: list) -> int:
    payload = [
        {"uuid": str(dataset.get("uuid")).strip(), "judul": str(dataset.get("judul")).strip()}
        for dataset in dataset_list
        if dataset.get("uuid") and dataset.get("judul")
    ]
    if not payload:
        return 0

    for client in (supabase, rest_supabase):
        try:
            client.table("dataset_katalog").upsert(payload, on_conflict="uuid").execute()
            break
        except Exception:
            continue
    return len(payload)


def baca_katalog() -> list:
    """Membaca seluruh katalog dari tabel dataset_katalog di Supabase dengan pagination per 1000 baris."""
    hasil = []
    seen = set()
    limit = 1000

    # 1. Baca dari tabel dataset_katalog di Supabase (dengan pagination .range per 1000 baris)
    for client in (supabase, rest_supabase):
        try:
            offset = 0
            while True:
                response = (
                    client.table("dataset_katalog")
                    .select("uuid,judul")
                    .order("judul")
                    .range(offset, offset + limit - 1)
                    .execute()
                )
                rows = response.data or []
                if not rows:
                    break
                for row in rows:
                    uuid_val = str(row.get("uuid") or "").strip()
                    judul_val = str(row.get("judul") or "").strip()
                    if uuid_val and judul_val and uuid_val not in seen and uuid_val not in _DUMMY_UUIDS:
                        seen.add(uuid_val)
                        hasil.append({"uuid": uuid_val, "judul": judul_val})
                if len(rows) < limit:
                    break
                offset += limit
            if len(hasil) >= 50:
                break
        except Exception:
            continue

    if len(hasil) >= 50:
        _simpan_cache_file(hasil)
        return hasil

    # 2. Baca juga dari tabel unique_datasets di Supabase bila tersedia
    for client in (supabase, rest_supabase):
        try:
            offset = 0
            while True:
                response = (
                    client.table("unique_datasets")
                    .select("dataset_name")
                    .range(offset, offset + limit - 1)
                    .execute()
                )
                rows = response.data or []
                if not rows:
                    break
                for row in rows:
                    nama = str(row.get("dataset_name") or "").strip()
                    if nama and nama not in seen and nama not in _DUMMY_UUIDS:
                        seen.add(nama)
                        hasil.append({"uuid": nama, "judul": nama})
                if len(rows) < limit:
                    break
                offset += limit
            if len(hasil) >= 50:
                break
        except Exception:
            continue

    if len(hasil) >= 50:
        hasil_urut = sorted(hasil, key=lambda x: x["judul"])
        _simpan_cache_file(hasil_urut)
        return hasil_urut

    # 3. Gunakan cache memori / file hasil sinkronisasi Satu Data Aceh bila ada
    if _KATALOG_MEMORI and len(_KATALOG_MEMORI) > len(hasil):
        return _KATALOG_MEMORI

    cache_lokal = _muat_cache_file()
    if len(cache_lokal) > len(hasil):
        return cache_lokal

    return sorted(hasil, key=lambda x: x["judul"])


def sinkronkan_katalog(limit: int = 500) -> list:
    """Mengambil seluruh halaman katalog dari API Satu Data Aceh dan menyimpannya ke Supabase."""
    dikumpulkan = []
    seen_uuids = set()

    page = 0
    while True:
        try:
            resp = requests.get(
                f"{BASE_URL}/datasets/list/",
                params={"limit": limit, "page": page, "search": ""},
                headers=headers,
                timeout=20,
            )
            resp.raise_for_status()
            body = resp.json()
            dataset_list = body.get("data", {}).get("rows", [])
            if not dataset_list and isinstance(body.get("data"), list):
                dataset_list = body.get("data", [])

            if not dataset_list:
                if page == 0:
                    page = 1
                    continue
                break

            baru_di_halaman_ini = 0
            batch_valid = []
            for item in dataset_list:
                u = str(item.get("uuid") or item.get("id") or "").strip()
                j = str(item.get("judul") or item.get("title") or item.get("nama") or "").strip()
                if u and j:
                    batch_valid.append({"uuid": u, "judul": j})
                    if u not in seen_uuids:
                        seen_uuids.add(u)
                        dikumpulkan.append({"uuid": u, "judul": j})
                        baru_di_halaman_ini += 1

            if batch_valid:
                simpan_katalog(batch_valid)

            if len(dataset_list) < limit or (page >= 1 and baru_di_halaman_ini == 0):
                break
            page += 1
        except Exception:
            break

    if dikumpulkan:
        terurut = sorted(dikumpulkan, key=lambda x: x["judul"])
        _simpan_cache_file(terurut)

    katalog_db = baca_katalog()
    if len(dikumpulkan) > len(katalog_db):
        return sorted(dikumpulkan, key=lambda x: x["judul"])
    return katalog_db


def cari_dataset(kata_kunci: str, limit: int = 100, page: int = 0) -> list:
    """Mencari dataset dari Satu Data Aceh API atau katalog penuh Supabase."""
    kata_bersih = (kata_kunci or "").strip()

    # 1. Coba cari melalui katalog lengkap yang sudah tersinkronisasi terlebih dahulu agar instan dan lengkap
    katalog_penuh = baca_katalog()
    if len(katalog_penuh) < 50:
        katalog_penuh = sinkronkan_katalog()

    if katalog_penuh:
        if not kata_bersih:
            start = page * limit
            return katalog_penuh[start : start + limit]
        kata_lower = kata_bersih.lower()
        cocok = [d for d in katalog_penuh if kata_lower in d.get("judul", "").lower()]
        if cocok:
            start = page * limit
            return cocok[start : start + limit]

    # 2. Cari langsung ke API Satu Data Aceh
    try:
        resp = requests.get(
            f"{BASE_URL}/datasets/list/",
            params={"limit": limit, "page": page, "search": kata_bersih},
            headers=headers,
            timeout=15,
        )
        resp.raise_for_status()
        rows = resp.json().get("data", {}).get("rows", [])
        if rows:
            return [
                {"uuid": str(r.get("uuid")).strip(), "judul": str(r.get("judul")).strip()}
                for r in rows
                if r.get("uuid") and r.get("judul")
            ]
    except Exception:
        pass

    # 3. Fallback query ilike ke Supabase
    for client in (supabase, rest_supabase):
        try:
            query = client.table("dataset_katalog").select("uuid,judul").order("judul")
            if kata_bersih:
                query = query.ilike("judul", f"%{kata_bersih}%")
            query = query.range(page * limit, (page + 1) * limit - 1)
            resp = query.execute()
            if resp.data:
                return resp.data
        except Exception:
            continue

    return []


def ambil_data_source(uuid: str, tahun: Optional[int] = None) -> list:
    """Mengambil baris data dari Satu Data Aceh API atau tabel master_data di Supabase."""
    try:
        params = {"tahun": tahun} if tahun is not None else {}
        resp = requests.get(
            f"{BASE_URL}/datasets/datasource/{uuid}/",
            params=params,
            headers=headers,
            timeout=15,
        )
        resp.raise_for_status()
        rows = resp.json().get("data", {}).get("rows", [])
        if rows:
            return rows
    except Exception:
        pass

    for client in (supabase, rest_supabase):
        try:
            query = (
                client.table("master_data")
                .select(
                    "tahun, payload, bps_nama_desa, kemendagri_nama_desa, "
                    "bps_nama_kecamatan, kemendagri_nama_kecamatan, "
                    "bps_nama_kabupaten_kota, kemendagri_nama_kabupaten_kota, "
                    "bps_nama_provinsi, kemendagri_nama_provinsi"
                )
                .eq("record_type", "raw_data")
                .eq("dataset_name", uuid)
            )
            if tahun is not None:
                query = query.eq("tahun", str(tahun))

            resp = query.execute()
            hasil = []
            for row in resp.data or []:
                flat = (row.get("payload") or {}).copy()
                flat["tahun"] = row.get("tahun")
                w = (
                    row.get("bps_nama_desa") or row.get("kemendagri_nama_desa")
                    or row.get("bps_nama_kecamatan") or row.get("kemendagri_nama_kecamatan")
                    or row.get("bps_nama_kabupaten_kota") or row.get("kemendagri_nama_kabupaten_kota")
                    or row.get("bps_nama_provinsi") or row.get("kemendagri_nama_provinsi")
                )
                flat["wilayah_spesifik"] = w
                hasil.append(flat)
            if hasil:
                return hasil
        except Exception:
            continue

    return []


def ekstrak_nilai_indikator(baris: dict) -> dict:
    hasil = {
        k: v
        for k, v in baris.items()
        if k not in FIELD_METADATA and v is not None and k != "wilayah_spesifik"
    }
    hasil["wilayah"] = (
        baris.get("wilayah_spesifik")
        or baris.get("bps_nama_kabupaten_kota")
        or baris.get("tingkat_penyajian")
        or baris.get("bps_nama_provinsi")
        or "Aceh"
    )
    hasil["tahun"] = baris.get("tahun")
    return hasil


def _susun_narasi_lokal(dataset_data: list[dict]) -> str:
    """Fallback penyusun narasi formal berbasis aturan apabila layanan LLM eksternal sedang sibuk."""
    paragraf = []
    for ds in dataset_data:
        judul = ds["judul"]
        rows = ds.get("data", [])
        tahun_set = sorted({str(r.get("tahun")) for r in rows if r.get("tahun") is not None})
        wilayah_set = sorted({str(r.get("wilayah")) for r in rows if r.get("wilayah")})
        rentang_tahun = (
            f"periode tahun {tahun_set[0]} hingga {tahun_set[-1]}"
            if len(tahun_set) > 1
            else (f"tahun {tahun_set[0]}" if tahun_set else "periode terkait")
        )
        cakupan_wilayah = ", ".join(wilayah_set[:5])
        if len(wilayah_set) > 5:
            cakupan_wilayah += f", serta {len(wilayah_set) - 5} wilayah lainnya"

        rincian_kalimat = []
        for baris in rows[:6]:
            wilayah = baris.get("wilayah", "Aceh")
            tahun = baris.get("tahun", "-")
            indikator_pairs = [
                f"{k.replace('_', ' ')} tercatat sebesar {v}"
                for k, v in baris.items()
                if k not in ("wilayah", "tahun")
            ]
            if indikator_pairs:
                rincian_kalimat.append(f"pada wilayah {wilayah} ({tahun}), " + " dan ".join(indikator_pairs))

        detail_str = "; ".join(rincian_kalimat)
        paragraf.append(
            f"Berdasarkan data resmi Satu Data Aceh pada dataset \"{judul}\" untuk {rentang_tahun} "
            f"yang mencakup wilayah {cakupan_wilayah}, tercatat perkembangan indikator statistik sebagai berikut: "
            f"{detail_str}. Data ini mencerminkan kondisi faktual capaian indikator di tingkat daerah yang menjadi "
            f"acuan dalam evaluasi serta perumusan kebijakan pembangunan Pemerintah Aceh."
        )

    paragraf.append(
        "Secara keseluruhan, rangkaian data statistik tersebut menunjukkan pentingnya pemantauan berkala "
        "terhadap indikator sektoral di setiap kabupaten/kota di Provinsi Aceh guna memastikan ketepatan sasaran "
        "program pembangunan daerah berbasis data terpadu."
    )
    return "\n\n".join(paragraf)


def susun_narasi(dataset_data: list[dict]) -> str:
    judul_dataset = ", ".join(dataset["judul"] for dataset in dataset_data)
    prompt = f"""Kamu adalah penulis laporan statistik resmi untuk UPTD Statistik Pemerintah Aceh.

Susun satu narasi laporan terpadu (2-4 paragraf) dari dataset berikut: "{judul_dataset}". WAJIB:
- Semua angka harus PERSIS sesuai data, jangan dibulatkan/diubah/ditebak.
- Sebutkan wilayah dan tahun datanya.
- Jika ada beberapa dataset, jelaskan masing-masing dataset secara runtut dan hanya buat perbandingan bila indikatornya memang sebanding.
- Gaya bahasa formal, seperti laporan resmi pemerintah.

DATA:
{json.dumps(dataset_data, ensure_ascii=False, indent=2)}
"""
    # 1. Penyedia utama: Google Gemini (mencoba beberapa model secara berurutan)
    if gemini_client is not None:
        for model_name in dict.fromkeys(GEMINI_MODELS):
            try:
                respon = gemini_client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config={"temperature": 0.2},
                )
                if respon and respon.text:
                    return respon.text.strip()
            except Exception:
                continue

    # 2. Cadangan kedua: Groq (opsional, aktif bila GROQ_API_KEYS diisi)
    if groq_client is not None:
        try:
            respon = groq_client.chat.completions.create(
                model=GROQ_MODEL_NAME,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
            )
            konten = respon.choices[0].message.content
            if konten:
                return konten.strip()
        except Exception:
            pass

    # 3. Fallback terakhir: penyusun narasi lokal berbasis aturan (tanpa model generatif)
    return _susun_narasi_lokal(dataset_data)


# ============ FASTAPI ============
def _auto_sync_katalog_latar_belakang() -> None:
    try:
        katalog_awal = baca_katalog()
        if len(katalog_awal) < 50:
            sinkronkan_katalog()
    except Exception:
        pass


@asynccontextmanager
async def lifespan(_app: FastAPI):
    threading.Thread(target=_auto_sync_katalog_latar_belakang, daemon=True).start()
    yield


app = FastAPI(title="API Narasi Laporan Statistik Aceh", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/narasi")
def get_narasi(
    uuid: list[str] = Query(..., min_length=1),
    judul: list[str] = Query(default=[]),
):
    """Menyusun narasi dari satu atau beberapa UUID dataset tanpa membatasi tahun."""
    dataset_data = []
    dataset_tidak_ada = []

    judul_per_uuid = dict(zip(uuid, judul))
    for dataset_uuid in dict.fromkeys(uuid):
        baris_data = ambil_data_source(dataset_uuid)
        data_bersih = [ekstrak_nilai_indikator(baris) for baris in baris_data]

        if not data_bersih:
            dataset_tidak_ada.append(dataset_uuid)
            continue

        dataset_data.append({
            "uuid": dataset_uuid,
            "judul": judul_per_uuid.get(dataset_uuid) or f"Dataset {dataset_uuid}",
            "data": data_bersih[:40],
        })

    if not dataset_data:
        return {
            "judul": "Narasi laporan",
            "dataset": [],
            "narasi": None,
            "pesan": "Data tidak tersedia untuk dataset yang dipilih.",
        }

    narasi = susun_narasi(dataset_data)
    judul_gabungan = "Narasi gabungan: " + ", ".join(dataset["judul"] for dataset in dataset_data)
    pesan = None
    if dataset_tidak_ada:
        pesan = f"Data tidak tersedia untuk {len(dataset_tidak_ada)} dataset; narasi dibuat dari dataset yang memiliki data."

    return {
        "judul": judul_gabungan,
        "dataset": [{"uuid": dataset["uuid"], "judul": dataset["judul"]} for dataset in dataset_data],
        "data": dataset_data,
        "narasi": narasi,
        "pesan": pesan,
    }


@app.get("/dataset")
def get_dataset():
    try:
        katalog = baca_katalog()
        if len(katalog) < 50:
            katalog = sinkronkan_katalog()
        return katalog
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Katalog dataset Supabase belum tersedia. Pastikan tabel sudah dibuat dan portal Satu Data Aceh dapat diakses.",
        ) from exc


@app.post("/dataset/sinkronkan")
def post_sinkronkan_dataset():
    """Memperbarui katalog dropdown dari Satu Data Aceh."""
    try:
        katalog = sinkronkan_katalog()
        return {"jumlah": len(katalog), "dataset": katalog}
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Gagal menyinkronkan katalog ke Supabase.") from exc


@app.get("/cari-dataset")
def get_cari_dataset(kata_kunci: str = "", limit: int = 100):
    """Mencari nama dataset berdasarkan kata kunci sebelum memanggil /narasi."""
    return cari_dataset(kata_kunci, limit)


@app.get("/tahun-dataset")
def get_tahun_dataset(uuid: str):
    """Mengembalikan hanya tahun yang benar-benar tersedia pada suatu dataset."""
    baris_data = ambil_data_source(uuid)
    tahun_tersedia = sorted(
        {int(baris["tahun"]) for baris in baris_data if baris.get("tahun") is not None and str(baris["tahun"]).isdigit()},
        reverse=True,
    )
    if not tahun_tersedia:
        raise HTTPException(status_code=404, detail="Tahun data tidak ditemukan untuk dataset ini")
    return {"uuid": uuid, "tahun": tahun_tersedia}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8010)
