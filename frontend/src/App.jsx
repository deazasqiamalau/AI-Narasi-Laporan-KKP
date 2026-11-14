import { useEffect, useState } from 'react'
import NarasiLaporanView, { fetchJson, Icon } from './NarasiLaporan'

const ARSITEKTUR_TAHAPAN = [
  {
    nomor: '01',
    icon: 'database',
    judul: '01. Sinkronisasi Katalog Supabase',
    deskripsi:
      'Menarik seluruh halaman katalog dataset resmi dari API Satu Data Aceh dan menyimpannya ke tabel dataset_katalog di Supabase dengan kebijakan Row Level Security.',
  },
  {
    nomor: '02',
    icon: 'filter',
    judul: '02. Ekstraksi Metadata Dinamis',
    deskripsi:
      'Memisahkan secara otomatis 24 atribut administratif kode wilayah BPS/Kemendagri serta waktu sistem dari kolom indikator numerik inti.',
  },
  {
    nomor: '03',
    icon: 'cpu',
    judul: '03. Generasi NLG Gemini API',
    deskripsi:
      'Mengonversi kumpulan data JSON terstruktur dari satu atau beberapa dataset menjadi 2 - 4 paragraf draf narasi laporan formal Bahasa Indonesia.',
  },
  {
    nomor: '04',
    icon: 'shield',
    judul: '04. Verifikasi Presisi Numerik',
    deskripsi:
      'Menerapkan validasi Anti-Halusinasi ketat tanpa pembulatan angka dan menyediakan tabel data sumber untuk pembuktian akurasi secara langsung.',
  },
]

const BIODATA_KKP = [
  { label: 'Nama Mahasiswa', nilai: 'Dea Zasqia Pasaribu Malau' },
  { label: 'NPM', nilai: '2308107010004' },
  { label: 'Program Studi', nilai: 'S1 Informatika, Fakultas MIPA - Universitas Syiah Kuala (USK)' },
  {
    label: 'Instansi Lokasi KKP',
    nilai: 'UPTD Statistik, Dinas Komunikasi, Informatika dan Persandian (Diskominsa) Aceh',
  },
  { label: 'Pembimbing Lapangan', nilai: 'Zulham Efendi Irfan, S.H.I, S.H, M.Si' },
]

export default function App() {
  const [halamanAktif, setHalamanAktif] = useState('beranda') // 'beranda' | 'generator'
  const [opsiDataset, setOpsiDataset] = useState([])
  const [memuatDataset, setMemuatDataset] = useState(true)
  const [sinkronisasi, setSinkronisasi] = useState(false)
  const [notifikasiSinkron, setNotifikasiSinkron] = useState('')
  const [fotoGagalMuat, setFotoGagalMuat] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const muatDatasetAwal = async () => {
      setMemuatDataset(true)
      try {
        const data = await fetchJson('/dataset', { signal: controller.signal })
        const daftarDataset = Array.isArray(data) ? data : []

        if (!controller.signal.aborted) {
          if (daftarDataset.length > 0) {
            setOpsiDataset(daftarDataset)
            return
          }

          setSinkronisasi(true)
          const hasilSinkron = await fetchJson('/dataset/sinkronkan', {
            method: 'POST',
            signal: controller.signal,
          })
          const datasetSinkron = Array.isArray(hasilSinkron.dataset) ? hasilSinkron.dataset : []
          setOpsiDataset(datasetSinkron)
        }
      } catch {
        // Tetap tampilkan antarmuka secara bersih apabila backend belum aktif
      } finally {
        if (!controller.signal.aborted) {
          setMemuatDataset(false)
          setSinkronisasi(false)
        }
      }
    }

    muatDatasetAwal()
    return () => controller.abort()
  }, [])

  const handleSinkronkanKatalog = async () => {
    if (sinkronisasi || memuatDataset) return
    setSinkronisasi(true)
    setMemuatDataset(true)
    setNotifikasiSinkron('')

    try {
      const hasilSinkron = await fetchJson('/dataset/sinkronkan', { method: 'POST' })
      const datasetSinkron = Array.isArray(hasilSinkron.dataset) ? hasilSinkron.dataset : []
      const total = hasilSinkron.jumlah ?? datasetSinkron.length
      setOpsiDataset(datasetSinkron)
      setNotifikasiSinkron(`Berhasil menyinkronkan ${total.toLocaleString('id-ID')} dataset dari Satu Data Aceh.`)
      setTimeout(() => setNotifikasiSinkron(''), 5000)
    } catch (err) {
      setNotifikasiSinkron(err.message || 'Gagal menyinkronkan katalog dataset.')
      setTimeout(() => setNotifikasiSinkron(''), 5000)
    } finally {
      setMemuatDataset(false)
      setSinkronisasi(false)
    }
  }

  const bukaGenerator = () => {
    setHalamanAktif('generator')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const bukaBeranda = () => {
    setHalamanAktif('beranda')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalDatasetLabel = memuatDataset
    ? 'Memuat...'
    : `${opsiDataset.length.toLocaleString('id-ID')}`

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* TOP NAVIGATION BAR (Sticky) */}
      <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-[#FFFFFF]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          {/* Kiri: Ikon + Nama Aplikasi NARA-AI */}
          <button
            type="button"
            onClick={bukaBeranda}
            className="flex items-center gap-3 text-left transition hover:opacity-90"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DC2626] text-xs font-extrabold tracking-wider text-white shadow-sm">
              NARA
            </span>
            <div>
              <p className="text-sm font-extrabold tracking-tight text-slate-900 leading-none">NARA-AI</p>
              <p className="mt-1 text-[11px] font-medium text-slate-500 leading-none">
                Sistem Narasi Statistik • UPTD Statistik Diskominsa Aceh
              </p>
            </div>
          </button>

          {/* Tengah: Navigasi Bersih (Beranda dan Generator Narasi) */}
          <nav
            aria-label="Navigasi Utama"
            className="flex items-center gap-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1"
          >
            <button
              type="button"
              onClick={bukaBeranda}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                halamanAktif === 'beranda'
                  ? 'bg-[#DC2626] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={bukaGenerator}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition ${
                halamanAktif === 'generator'
                  ? 'bg-[#DC2626] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon name="sparkle" className="h-3.5 w-3.5" />
              Generator Narasi
            </button>
          </nav>

          {/* Kanan: Tombol Aksi Utama Merah Solid & Tautan Portal Satu Data Aceh */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={bukaGenerator}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#DC2626] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
            >
              Mulai Buat Narasi →
            </button>
            <a
              href="https://satudata.acehprov.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-[#DC2626]"
            >
              Portal Satu Data Aceh ↗
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        {halamanAktif === 'beranda' ? (
          <div>
            {/* 1. HERO SECTION (Split 2 Kolom) & METRICS BAR HORIZONTAL */}
            <section className="border-b border-[#E2E8F0] bg-[#FFFFFF] pt-10 pb-12 md:pt-14 md:pb-16">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid items-center gap-10 lg:grid-cols-12">
                  {/* Kolom Kiri */}
                  <div className="lg:col-span-7 space-y-6">
                    <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
                      SEMINAR KULIAH KERJA PRAKTIK • S1 INFORMATIKA USK
                    </span>

                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl md:leading-[1.22]">
                      Sistem Natural Language Generation Berbasis LLM dengan Pencegahan Halusinasi Data untuk Narasi
                      Laporan Statistik Satu Data Aceh
                    </h1>

                    <p className="max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                      Platform otomatisasi penyusunan draf laporan statistik sektoral Pemerintah Aceh. Mengintegrasikan
                      API resmi Satu Data Aceh, penyimpanan katalog Supabase, dan model bahasa besar (LLM) untuk
                      menghasilkan narasi formal yang presisi dan bebas halusinasi angka.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={bukaGenerator}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
                      >
                        Mulai Buat Narasi Laporan →
                      </button>

                      <button
                        type="button"
                        onClick={handleSinkronkanKatalog}
                        disabled={sinkronisasi || memuatDataset}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-[#DC2626] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Icon
                          name="refresh"
                          className={`h-4 w-4 text-[#DC2626] ${sinkronisasi ? 'animate-spin' : ''}`}
                        />
                        <span>{sinkronisasi ? 'Menyinkronkan Data...' : 'Sinkronkan Data Katalog'}</span>
                      </button>
                    </div>

                    {notifikasiSinkron && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800">
                        <Icon name="check" className="h-4 w-4 text-emerald-600" />
                        <span>{notifikasiSinkron}</span>
                      </div>
                    )}
                  </div>

                  {/* Kolom Kanan: UI Mockup Card */}
                  <div className="lg:col-span-5">
                    <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-lg shadow-slate-200/60">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]" />
                          <span className="text-xs font-bold text-slate-800">Pratinjau Draf Narasi Statistik</span>
                        </div>
                        <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          ✓ 100% Grounded Data • Anti-Halusinasi
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
                          Contoh Cuplikan Hasil Sintesis Laporan
                        </p>
                        <h2 className="text-sm font-bold text-slate-900">
                          Analisis Indikator Sektoral Kabupaten/Kota di Provinsi Aceh
                        </h2>
                        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs leading-relaxed text-slate-700 text-justify space-y-2.5">
                          <p>
                            Berdasarkan data resmi Satu Data Aceh pada periode tahun <strong>2022 hingga 2024</strong>,
                            indikator kependudukan di <strong>Kota Banda Aceh</strong> tercatat sebesar{' '}
                            <span className="font-mono font-bold text-[#DC2626]">257.635</span> jiwa pada tahun 2022 dan
                            meningkat menjadi <span className="font-mono font-bold text-[#DC2626]">265.040</span> jiwa
                            pada tahun 2024.
                          </p>
                          <p>
                            Seluruh nilai numerik yang tersaji dalam laporan ini diekstraksi langsung dari payload JSON
                            resmi Satu Data Aceh tanpa pembulatan maupun perubahan nilai sumber.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-2 text-[11px] text-slate-500">
                        <span>Sumber: Portal Satu Data Aceh</span>
                        <span className="font-semibold text-slate-700">Terverifikasi Tabel Sumber</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. METRICS BAR HORIZONTAL */}
                <div className="mt-10 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
                  <div className="grid grid-cols-1 divide-y divide-[#E2E8F0] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
                    <div className="p-5 sm:p-6">
                      <p className="text-2xl font-extrabold text-[#DC2626]">{totalDatasetLabel} Dataset Tersedia</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Diambil secara dinamis dari katalog resmi <code className="font-semibold text-slate-700">GET /dataset</code>
                      </p>
                    </div>

                    <div className="p-5 sm:p-6">
                      <p className="text-2xl font-extrabold text-slate-900">24 Atribut Metadata</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Filter otomatis kode wilayah BPS/Kemendagri dan tahun
                      </p>
                    </div>

                    <div className="p-5 sm:p-6">
                      <p className="text-2xl font-extrabold text-slate-900">Multi-Dataset</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Sintesis gabungan 1 hingga beberapa dataset sekaligus
                      </p>
                    </div>

                    <div className="p-5 sm:p-6">
                      <p className="text-2xl font-extrabold text-emerald-700">0% Halusinasi</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Validasi presisi angka berbasis fakta JSON
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. SECTION "IDENTITAS PENELITI & PELAKSANAAN KKP" (Kartu Profil dengan Foto) */}
            <section className="py-12 md:py-16">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mb-7">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
                    Profil Akademik & Instansi
                  </span>
                  <h2 className="mt-1.5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    Identitas Peneliti & Pelaksanaan KKP
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-600">
                    Informasi mahasiswa pelaksana dan instansi lokasi Kuliah Kerja Praktik (KKP).
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-sm md:p-8">
                  <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                    {/* Bagian Kiri: Foto Profil Mahasiswa */}
                    <div className="shrink-0">
                      <div className="relative h-[200px] w-[160px] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] shadow-sm">
                        {!fotoGagalMuat ? (
                          <img
                            src="/foto-dea.jpeg"
                            alt="Dea Zasqia Pasaribu Malau"
                            onError={() => setFotoGagalMuat(true)}
                            className="h-full w-full object-cover object-top"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-red-50 text-[#DC2626]">
                            <span className="text-3xl font-extrabold tracking-wider">DZ</span>
                            <span className="mt-1 text-[11px] font-semibold text-slate-500">Mahasiswa KKP</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bagian Kanan: Biodata Lengkap KKP */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
                        <div>
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
                            Peserta Kuliah Kerja Praktik (KKP)
                          </span>
                          <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                            Dea Zasqia Pasaribu Malau
                          </h3>
                        </div>
                        <span className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 font-mono text-xs font-bold text-slate-700">
                          NPM: 2308107010004
                        </span>
                      </div>

                      <dl className="mt-4 grid gap-3.5 sm:grid-cols-2">
                        {BIODATA_KKP.map((item) => (
                          <div
                            key={item.label}
                            className={`rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 ${
                              item.label === 'Instansi Lokasi KKP' ? 'sm:col-span-2' : ''
                            }`}
                          >
                            <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              {item.label}
                            </dt>
                            <dd className="mt-1 text-sm font-bold text-slate-800">{item.nilai}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. SECTION "ARSITEKTUR & CARA KERJA SISTEM" (Grid 4 Kartu Minimalis) */}
            <section className="border-t border-[#E2E8F0] bg-[#FFFFFF] py-12 md:py-16">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div className="max-w-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
                      Metodologi & Pipeline Teknis
                    </span>
                    <h2 className="mt-1.5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                      Arsitektur & Cara Kerja Sistem
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-600">
                      Empat tahapan terintegrasi dari sinkronisasi katalog hingga verifikasi presisi numerik.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={bukaGenerator}
                    className="inline-flex items-center gap-2 self-start rounded-xl bg-[#DC2626] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 sm:self-auto"
                  >
                    Buka Ruang Kerja Generator →
                  </button>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {ARSITEKTUR_TAHAPAN.map((item) => (
                    <div
                      key={item.nomor}
                      className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 transition hover:border-red-200 hover:bg-[#FFFFFF]"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-[#DC2626]">
                            <Icon name={item.icon} className="h-5 w-5" />
                          </span>
                          <span className="rounded-md bg-red-50 px-2 py-0.5 font-mono text-xs font-bold text-[#DC2626]">
                            Tahap {item.nomor}
                          </span>
                        </div>
                        <h3 className="mt-4 text-base font-bold text-slate-900">{item.judul}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.deskripsi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* TAB GENERATOR NARASI */
          <section className="py-8 md:py-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <NarasiLaporanView
                opsiDataset={opsiDataset}
                setOpsiDataset={setOpsiDataset}
                memuatDataset={memuatDataset}
                sinkronisasi={sinkronisasi}
                notifikasiSinkron={notifikasiSinkron}
                onSinkronkan={handleSinkronkanKatalog}
                onBackToBeranda={bukaBeranda}
              />
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF] py-6 mt-auto">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs font-medium text-slate-600 sm:px-6">
          Sistem Natural Language Generation Laporan Statistik Satu Data Aceh • Dea Zasqia Pasaribu Malau
          (2308107010004) • S1 Informatika USK
        </div>
      </footer>
    </div>
  )
}
