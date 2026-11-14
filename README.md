# SADA-AI — AI Narasi Laporan Statistik Aceh

Aplikasi web berbasis kecerdasan buatan (**Generative AI**) untuk menyusun draf narasi laporan statistik resmi secara otomatis dari katalog dataset **Portal Satu Data Aceh** (`https://satudata.acehprov.go.id`). Proyek ini dikembangkan secara mandiri untuk kebutuhan **Kuliah Kerja Praktik (KKP)** pada **UPTD Statistik — Dinas Komunikasi, Informatika dan Persandian (Diskominsa) Provinsi Aceh**.

---

## 1. Gambaran Sistem

Penyusunan laporan statistik daerah membutuhkan ketelitian tinggi dalam merangkum berbagai tabel indikator lintas kabupaten/kota dan lintas tahun menjadi narasi eksekutif yang formal. **AI Narasi Laporan Statistik Aceh** mengotomatiskan proses tersebut melalui tiga tahapan utama:

1. **Sinkronisasi & Pencarian Katalog Dataset**: Mengambil daftar dataset dari API Satu Data Aceh dan menyimpannya ke dalam tabel katalog di **Supabase (`dataset_katalog`)** agar pencarian topik berlangsung cepat.
2. **Ekstraksi Indikator & Tahun Data**: Mengambil baris data mentah dari setiap UUID dataset terpilih, memisahkan atribut metadata kode wilayah, dan mengekstrak nilai indikator beserta cakupan wilayah (Kabupaten/Kota/Provinsi) serta tahun ketersediaan datanya.
3. **Penyusunan Narasi Laporan Terpadu (LLM)**: Mengirimkan struktur data bersih ke model bahasa besar (**Google Gemini AI**) dengan instruksi ketat (*strict zero-hallucination prompt*) untuk menghasilkan narasi laporan formal (2–4 paragraf) tanpa mengubah atau membulatkan angka sumber.

---

## 2. Arsitektur & Struktur Proyek

Sistem menggunakan arsitektur **Client–Server** yang terpisah secara bersih antara antarmuka pengguna (**React + Vite + Tailwind CSS**) dan layanan REST API (**FastAPI + Python**):

```text
C:\AI-Narasi-Laporan-KKP\
├── backend/
│   ├── src/
│   │   └── main.py            # Server FastAPI (port 8010), integrasi Satu Data Aceh, Supabase & Gemini AI
│   ├── supabase/
│   │   └── schema.sql         # Skema tabel PostgreSQL/Supabase (dataset_katalog)
│   ├── .env.example           # Template konfigurasi environment variable
│   └── requirements.txt       # Daftar pustaka Python backend
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Shell aplikasi mandiri AI Narasi Laporan
│   │   ├── NarasiLaporan.jsx  # Komponen utama pemilih dataset, sinkronisasi & generator narasi
│   │   ├── index.css          # Styling Tailwind CSS & animasi antarmuka
│   │   └── main.jsx           # Entry point React
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js         # Proxy endpoint API (/dataset, /narasi, /cari-dataset, /tahun-dataset -> :8010)
├── .gitignore                 # Memblokir .env, node_modules/, __pycache__/, venv/, dist/
└── README.md                  # Dokumentasi proyek
```

---

## 3. Skema SQL Supabase (`dataset_katalog`)

Jalankan skrip SQL berikut pada **SQL Editor** di dashboard Supabase Anda (tersedia juga di file `backend/supabase/schema.sql`):

```sql
create table if not exists public.dataset_katalog (
  uuid text primary key,
  judul text not null,
  diperbarui_pada timestamptz not null default now()
);

alter table public.dataset_katalog enable row level security;

-- Backend memakai SUPABASE_SECRET_KEY dan dapat melewati RLS.
-- Tidak ada kebijakan anon karena browser selalu mengakses backend, bukan tabel Supabase secara langsung.
```

---

## 4. Cara Setup `.env`

1. Masuk ke direktori `backend/` dan salin template `.env.example` menjadi `.env`:
   ```powershell
   cd C:\AI-Narasi-Laporan-KKP\backend
   Copy-Item .env.example .env
   ```
2. Isi variabel berikut di dalam `backend/.env`:
   ```env
   SATUDATA_API_KEY=isi_dengan_api_key_satu_data_aceh
   GEMINI_API_KEY=isi_dengan_api_key_gemini
   SUPABASE_URL=https://project-ref.supabase.co
   SUPABASE_SECRET_KEY=isi_dengan_secret_key_supabase
   ```

> **Keamanan Kredensial:** File `.env` sudah masuk ke dalam daftar `.gitignore` sehingga kunci rahasia API tidak akan pernah ter-commit ke repository Git.

---

## 5. Cara Menjalankan Server

### A. Menjalankan Backend FastAPI (Port `8010`)

```powershell
cd C:\AI-Narasi-Laporan-KKP\backend
pip install -r requirements.txt
python src/main.py
```

Server backend akan aktif di `http://localhost:8010` (dokumentasi interaktif Swagger UI tersedia di `http://localhost:8010/docs`).

### B. Menjalankan Frontend React + Vite (Port `5173`)

Buka terminal baru, lalu jalankan:

```powershell
cd C:\AI-Narasi-Laporan-KKP\frontend
npm install
npm run dev
```

Buka browser dan akses `http://localhost:5173`. Seluruh panggilan ke `/dataset`, `/dataset/sinkronkan`, `/cari-dataset`, `/tahun-dataset`, dan `/narasi` akan diteruskan secara otomatis oleh Vite Proxy ke `http://localhost:8010`.

---

## 6. Daftar Endpoint API

| Method | Endpoint | Parameter Query | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/dataset` | — | Mengambil daftar seluruh katalog dataset (`uuid` & `judul`) dari Supabase. Jika kosong, otomatis menyinkronkan dari Satu Data Aceh. |
| `POST` | `/dataset/sinkronkan` | — | Memperbarui katalog dataset di tabel `dataset_katalog` Supabase dari API Satu Data Aceh dan mengembalikan jumlah serta daftar dataset. |
| `GET` | `/cari-dataset` | `kata_kunci` (str), `limit` (int, default `5`) | Mencari dataset berdasarkan kata kunci judul sebelum memilih dataset untuk dinarasikan. |
| `GET` | `/tahun-dataset` | `uuid` (str, wajib) | Mengembalikan daftar tahun yang tersedia secara faktual di dalam suatu dataset (`{"uuid": "...", "tahun": [2024, 2023, ...]}`). |
| `GET` | `/narasi` | `uuid` (list\[str\], wajib), `judul` (list\[str\], opsional) | Mengambil baris data dari satu atau beberapa dataset terpilih, mengekstrak indikator & wilayah, lalu menyusun narasi laporan formal menggunakan AI. |

---

**Pengembang:** Dea Zasqia Pasaribu Malau  
**Instansi KKP:** Dinas Komunikasi, Informatika dan Persandian (Diskominsa) Provinsi Aceh
