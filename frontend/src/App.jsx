import { useEffect, useState } from 'react'
import NarasiLaporanView, { fetchJson, Icon, saringDatasetAsli } from './NarasiLaporan'

const SIMULASI_TOPIK_HERO = [
  {
    id: 'penduduk',
    label: 'Penduduk',
    judulDataset: 'Indikator Kependudukan Kabupaten/Kota Provinsi Aceh',
    periode: '2022 - 2024',
    grafikBatang: [
      { label: 'Banda Aceh 23', nilai: 62, angka: '261.120' },
      { label: 'Banda Aceh 24', nilai: 68, angka: '265.040' },
      { label: 'Aceh Besar 24', nilai: 96, angka: '429.510' },
    ],
    narasi:
      'Berdasarkan data resmi Satu Data Aceh pada periode tahun 2022 hingga 2024, jumlah penduduk di Kota Banda Aceh meningkat dari 261.120 jiwa pada tahun 2023 menjadi 265.040 jiwa pada tahun 2024. Sementara itu, Kabupaten Aceh Besar mencatat populasi sebesar 429.510 jiwa pada tahun 2024.',
  },
  {
    id: 'pendidikan',
    label: 'Pendidikan',
    judulDataset: 'Indikator Satuan Pendidikan & Murid Provinsi Aceh',
    periode: '2023 - 2024',
    grafikBatang: [
      { label: 'SD Banda Aceh', nilai: 48, angka: '136 unit' },
      { label: 'SD Aceh Besar', nilai: 92, angka: '301 unit' },
      { label: 'Murid Terdata', nilai: 80, angka: '73.785' },
    ],
    narasi:
      'Berdasarkan data resmi Satu Data Aceh untuk tahun 2024, ketersediaan satuan pendidikan Sekolah Dasar (SD) di Kota Banda Aceh tercatat sebanyak 136 sekolah dengan total 28.910 murid, sedangkan Kabupaten Aceh Besar memiliki 301 sekolah yang melayani 44.875 murid.',
  },
  {
    id: 'kemiskinan',
    label: 'Kemiskinan',
    judulDataset: 'Indikator Garis & Persentase Kemiskinan Kabupaten/Kota Aceh',
    periode: '2023 - 2024',
    grafikBatang: [
      { label: 'Banda Aceh (%)', nilai: 42, angka: '6,85%' },
      { label: 'Aceh Besar (%)', nilai: 78, angka: '12,96%' },
      { label: 'Aceh Jaya (%)', nilai: 74, angka: '12,25%' },
    ],
    narasi:
      'Berdasarkan data resmi Satu Data Aceh pada tahun 2024, persentase penduduk miskin di Kota Banda Aceh tercatat menurun menjadi 6,85% (18,92 ribu jiwa), sementara di Kabupaten Aceh Besar tercatat sebesar 12,96% (54,80 ribu jiwa) sesuai indikator sumber tanpa pembulatan.',
  },
]

const FITUR_MELAYANG_BERANDA = [
  {
    nomor: '01',
    icon: 'database',
    judul: 'Katalog Terintegrasi',
    deskripsi: 'Seluruh dataset resmi Satu Data Aceh siap pakai dan tersinkronisasi otomatis.',
  },
  {
    nomor: '02',
    icon: 'filter',
    judul: 'Filter 24 Dimensi',
    deskripsi: 'Pemisahan otomatis atribut wilayah BPS dan periode dari indikator numerik.',
  },
  {
    nomor: '03',
    icon: 'layers',
    judul: 'Sintesis Multi-Dataset',
    deskripsi: 'Penggabungan beberapa dataset lintas sektor dalam satu narasi laporan utuh.',
  },
  {
    nomor: '04',
    icon: 'shield',
    judul: 'Validasi Presisi Data',
    deskripsi: 'Jaminan kesesuaian 100% terhadap data sumber JSON tanpa halusinasi angka.',
  },
]

const TAUTAN_SOSIAL_PENGEMBANG = [
  {
    id: 'github-utama',
    label: 'GitHub (@deazasqiamalau)',
    labelSingkat: '@deazasqiamalau',
    icon: 'github',
    url: 'https://github.com/deazasqiamalau',
  },
  {
    id: 'github-kedua',
    label: 'GitHub (@deazasqiapasaribumalau)',
    labelSingkat: '@deazasqiapasaribumalau',
    icon: 'github',
    url: 'https://github.com/deazasqiapasaribumalau',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    labelSingkat: 'LinkedIn',
    icon: 'linkedin',
    url: 'https://www.linkedin.com/in/deazasqiamalau/',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    labelSingkat: 'YouTube',
    icon: 'youtube',
    url: 'https://www.youtube.com/@deazasqiamalau',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    labelSingkat: 'Instagram',
    icon: 'instagram',
    url: 'https://www.instagram.com/deazasqiamalau/',
  },
]

const KONTRIBUSI_SISTEM_KARTU = [
  {
    nomor: '01',
    icon: 'database',
    judul: '01. Data Pipeline & Metadata',
    deskripsi:
      'Merancang arsitektur akuisisi katalog otomatis dari API Satu Data Aceh ke Supabase PostgreSQL dengan paginasi penuh serta pembersihan 24 atribut metadata administratif BPS/Kemendagri.',
  },
  {
    nomor: '02',
    icon: 'sparkle',
    judul: '02. Prompt Grounding & NLG',
    deskripsi:
      'Mengembangkan modul sintesis multi-dataset berbasis Google Gemini API yang merangkai fakta JSON menjadi 2 - 4 paragraf laporan formal pemerintah dengan jaminan 0% deviasi angka.',
  },
  {
    nomor: '03',
    icon: 'table',
    judul: '03. Antarmuka & Audit Verifikasi',
    deskripsi:
      'Membangun antarmuka pengguna satu kolom terpusat berbasis React dan Tailwind CSS yang dilengkapi pencarian katalog real-time, ekspor dokumen, serta tabel audit verifikasi data sumber.',
  },
]

const TEKNOLOGI_TOOLS = [
  {
    nama: 'Python',
    kategori: 'Core Language',
    icon: 'code',
    peran: 'Pemrosesan struktur JSON, ekstraksi 24 atribut metadata wilayah/waktu, dan orkestrasi pipeline data statistik.',
  },
  {
    nama: 'FastAPI',
    kategori: 'REST API',
    icon: 'cpu',
    peran: 'Menjalankan 5 endpoint utama beserta mekanisme auto-sync katalog otomatis saat server dinyalakan.',
  },
  {
    nama: 'Google Gemini',
    kategori: 'LLM Engine',
    icon: 'sparkle',
    peran: 'Menyusun draf narasi laporan statistik formal Bahasa Indonesia berbasis fakta JSON dengan pencegahan halusinasi.',
  },
  {
    nama: 'Supabase',
    kategori: 'PostgreSQL',
    icon: 'database',
    peran: 'Penyimpanan katalog dataset Satu Data Aceh berkecepatan tinggi dengan perlindungan Row Level Security (RLS).',
  },
  {
    nama: 'React',
    kategori: 'UI Library',
    icon: 'layers',
    peran: 'Antarmuka web modern untuk pemilihan dataset, pratinjau metadata, dan verifikasi tabel sumber.',
  },
  {
    nama: 'Tailwind CSS',
    kategori: 'Design System',
    icon: 'filter',
    peran: 'Sistem tata letak editorial bersih dengan identitas visual Merah-Putih khas UPTD Statistik Diskominsa Aceh.',
  },
  {
    nama: 'GitHub',
    kategori: 'Repository',
    icon: 'github',
    peran: 'Manajemen kode sumber, kontrol versi, dan dokumentasi teknis proyek sistem NARA-AI.',
  },
]

const TAHAP_ARSITEKTUR = [
  {
    tahap: 'Tahap 01',
    judul: 'Auto-Sync Katalog Satu Data Aceh ke Supabase',
    endpoint: 'Startup Lifespan • GET /dataset',
    penjelasan:
      'Saat server dijalankan, backend otomatis memeriksa kelengkapan tabel dataset_katalog di Supabase dan menarik seluruh halaman katalog dari API Satu Data Aceh.',
  },
  {
    tahap: 'Tahap 02',
    judul: 'Pencarian Real-Time & Validasi Rentang Tahun',
    endpoint: 'GET /cari-dataset • GET /tahun-dataset',
    penjelasan:
      'Pengguna mencari topik sektoral dan memilih satu atau beberapa dataset. Sistem memvalidasi tahun data yang tersedia secara aktual.',
  },
  {
    tahap: 'Tahap 03',
    judul: 'Pembersihan 24 Atribut Metadata Wilayah & Waktu',
    endpoint: 'ekstrak_nilai_indikator() • JSON Sanitizer',
    penjelasan:
      'Sistem memisahkan 24 kolom kode administratif BPS/Kemendagri serta timestamp database sehingga hanya menyisakan wilayah, tahun, dan indikator numerik.',
  },
  {
    tahap: 'Tahap 04',
    judul: 'Sintesis NLG Gemini API & Tabel Verifikasi Sumber',
    endpoint: 'GET /narasi • Anti-Hallucination Guard',
    penjelasan:
      'Data JSON bersih dikirim ke LLM dengan instruksi tanpa pembulatan angka. Hasil narasi ditampilkan berdampingan dengan tabel data mentah.',
  },
]

export default function App() {
  const [halamanAktif, setHalamanAktif] = useState('beranda') // 'beranda' | 'generator' | 'profil'
  const [opsiDataset, setOpsiDataset] = useState([])
  const [memuatDataset, setMemuatDataset] = useState(true)
  const [sinkronisasi, setSinkronisasi] = useState(false)
  const [toastPesan, setToastPesan] = useState('')

  // State Simulasi Interaktif di Hero Beranda
  const [idxSimulasi, setIdxSimulasi] = useState(0)
  const [topikDariBeranda, setTopikDariBeranda] = useState('')

  // State Pop-up Modal Arsitektur ("Tentang Sistem")
  const [modalArsitekturTerbuka, setModalArsitekturTerbuka] = useState(false)

  // State Tech Stack Interaktif di Halaman Pengembang
  const [techAktif, setTechAktif] = useState(TEKNOLOGI_TOOLS[0])
  const [fotoGagalMuat, setFotoGagalMuat] = useState(false)

  const tampilkanToast = (pesan) => {
    setToastPesan(pesan)
  }

  useEffect(() => {
    if (!toastPesan) return
    const timer = setTimeout(() => setToastPesan(''), 4000)
    return () => clearTimeout(timer)
  }, [toastPesan])

  // Tutup modal dengan tombol Esc
  useEffect(() => {
    if (!modalArsitekturTerbuka) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalArsitekturTerbuka(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalArsitekturTerbuka])

  // Pastikan scroll selalu kembali ke paling atas setiap kali tab halaman berubah
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [halamanAktif])

  // Muat seluruh katalog dataset asli dari backend saat aplikasi dibuka
  useEffect(() => {
    const controller = new AbortController()
    const muatDatasetAwal = async () => {
      setMemuatDataset(true)
      try {
        const data = await fetchJson('/dataset', { signal: controller.signal })
        const daftarDataset = saringDatasetAsli(data)

        if (!controller.signal.aborted) {
          if (daftarDataset.length >= 50) {
            setOpsiDataset(daftarDataset)
            return
          }

          setSinkronisasi(true)
          const hasilSinkron = await fetchJson('/dataset/sinkronkan', {
            method: 'POST',
            signal: controller.signal,
          })
          const datasetSinkron = saringDatasetAsli(hasilSinkron.dataset)
          setOpsiDataset(datasetSinkron.length ? datasetSinkron : daftarDataset)
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

    try {
      const hasilSinkron = await fetchJson('/dataset/sinkronkan', { method: 'POST' })
      const datasetSinkron = saringDatasetAsli(hasilSinkron.dataset)
      setOpsiDataset(datasetSinkron)
      tampilkanToast(`Katalog diperbarui: ${datasetSinkron.length.toLocaleString('id-ID')} dataset resmi tersedia.`)
    } catch (err) {
      tampilkanToast(err.message || 'Gagal memperbarui katalog dari server.')
    } finally {
      setMemuatDataset(false)
      setSinkronisasi(false)
    }
  }

  const pindahHalaman = (namaHalaman) => {
    setHalamanAktif(namaHalaman)
    window.scrollTo(0, 0)
  }

  const totalDatasetLabel = memuatDataset
    ? '...'
    : opsiDataset.length > 0
    ? opsiDataset.length.toLocaleString('id-ID')
    : '1.000'

  const simulasiAktif = SIMULASI_TOPIK_HERO[idxSimulasi] || SIMULASI_TOPIK_HERO[0]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* TOAST NOTIFICATION */}
      {toastPesan && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-[#FFFFFF] px-4 py-3 text-xs font-semibold text-[#0F172A] shadow-xl animate-modal">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <span>{toastPesan}</span>
          <button
            type="button"
            onClick={() => setToastPesan('')}
            className="ml-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup notifikasi"
          >
            <Icon name="close" className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 1. TOP NAVBAR YANG NATURAL, MINIMALIS, & EDITORIAL MODERN */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Kiri: Logo Geometris Merah Sederhana + Teks NARA-AI */}
          <button
            type="button"
            onClick={() => pindahHalaman('beranda')}
            className="flex items-center gap-3 text-left group"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DC2626] text-white shadow-sm shadow-red-600/20">
              <span className="h-3.5 w-3.5 rotate-45 rounded-[2px] border-2 border-white" />
            </span>
            <div>
              <p className="text-base font-bold tracking-tight text-[#0F172A] leading-none">
                NARA<span className="text-[#DC2626]">-AI</span>
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-500 leading-none">
                UPTD Statistik Aceh
              </p>
            </div>
          </button>

          {/* Tengah: Link Teks Polos yang Bersih & Natural (Tanpa Ikon di Samping Teks) */}
          <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-8 h-full">
            <button
              type="button"
              onClick={() => pindahHalaman('beranda')}
              className={`relative flex h-full items-center text-sm transition ${
                halamanAktif === 'beranda'
                  ? 'font-bold text-[#DC2626] border-b-2 border-[#DC2626]'
                  : 'font-medium text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Beranda
            </button>

            <button
              type="button"
              onClick={() => pindahHalaman('generator')}
              className={`relative flex h-full items-center text-sm transition ${
                halamanAktif === 'generator'
                  ? 'font-bold text-[#DC2626] border-b-2 border-[#DC2626]'
                  : 'font-medium text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Generator Narasi
            </button>

            <button
              type="button"
              onClick={() => setModalArsitekturTerbuka(true)}
              className={`relative flex h-full items-center text-sm transition ${
                modalArsitekturTerbuka
                  ? 'font-bold text-[#DC2626] border-b-2 border-[#DC2626]'
                  : 'font-medium text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Tentang Sistem
            </button>

            <button
              type="button"
              onClick={() => pindahHalaman('profil')}
              className={`relative flex h-full items-center text-sm transition ${
                halamanAktif === 'profil'
                  ? 'font-bold text-[#DC2626] border-b-2 border-[#DC2626]'
                  : 'font-medium text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Pengembang
            </button>
          </nav>

          {/* Kanan: Hanya 1 Tombol CTA Merah Elegan */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => pindahHalaman('generator')}
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-red-600/15 transition hover:bg-[#991B1B]"
            >
              Buat Laporan
            </button>
          </div>
        </div>

        {/* Sub-navigasi Mobile (Hanya tampil di layar kecil) */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-100 bg-white/95 px-2 py-2 text-xs">
          <button
            type="button"
            onClick={() => pindahHalaman('beranda')}
            className={
              halamanAktif === 'beranda'
                ? 'font-bold text-[#DC2626] border-b-2 border-[#DC2626] pb-0.5'
                : 'font-medium text-slate-600'
            }
          >
            Beranda
          </button>
          <button
            type="button"
            onClick={() => pindahHalaman('generator')}
            className={
              halamanAktif === 'generator'
                ? 'font-bold text-[#DC2626] border-b-2 border-[#DC2626] pb-0.5'
                : 'font-medium text-slate-600'
            }
          >
            Generator Narasi
          </button>
          <button
            type="button"
            onClick={() => setModalArsitekturTerbuka(true)}
            className="font-medium text-slate-600"
          >
            Tentang Sistem
          </button>
          <button
            type="button"
            onClick={() => pindahHalaman('profil')}
            className={
              halamanAktif === 'profil'
                ? 'font-bold text-[#DC2626] border-b-2 border-[#DC2626] pb-0.5'
                : 'font-medium text-slate-600'
            }
          >
            Pengembang
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto w-full max-w-6xl flex-grow px-4 py-8 sm:px-6 md:py-10">
        {/* ===================================================================
            2. HALAMAN BERANDA YANG AESTHETIC & HIDUP (GAYA REDFLOW + EDUKA)
           =================================================================== */}
        {halamanAktif === 'beranda' && (
          <div className="space-y-12 animate-page">
            <div>
              {/* Hero Section dengan Latar Belakang Artistik */}
              <section className="relative overflow-hidden rounded-3xl border border-red-100/80 bg-gradient-to-br from-red-50/80 via-white to-rose-50/50 px-6 pt-10 pb-16 shadow-sm sm:px-10 sm:pt-14 sm:pb-20 lg:px-12">
                {/* SVG Gelombang Abstrak Halus di Sudut Kanan */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 600 600"
                  fill="none"
                  className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] opacity-60"
                >
                  <circle cx="320" cy="280" r="240" stroke="#FECACA" strokeWidth="1.5" />
                  <circle cx="320" cy="280" r="185" stroke="#FCA5A5" strokeWidth="1" strokeDasharray="6 6" />
                  <path
                    d="M120 420 C 220 300, 380 480, 520 260"
                    stroke="#FCA5A5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M160 470 C 260 350, 410 510, 550 310"
                    stroke="#FEE2E2"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12">
                  {/* Kolom Kiri */}
                  <div className="lg:col-span-6 space-y-6">
                    <p className="tracking-widest text-xs font-semibold text-red-600 uppercase">
                      SISTEM ANALITIK SATU DATA ACEH
                    </p>

                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                      Narasi Laporan Statistik Formal dalam Hitungan Detik.
                    </h1>

                    <p className="text-base leading-relaxed text-slate-600 max-w-xl">
                      Otomatisasi penyusunan draf laporan resmi pemerintah berbasis dataset Satu Data Aceh. Setiap
                      indikator diekstrak secara dinamis dan diverifikasi langsung terhadap tabel sumber JSON untuk
                      menjamin presisi angka.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <button
                        type="button"
                        onClick={() => pindahHalaman('generator')}
                        className="rounded-xl bg-[#DC2626] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-red-600/15 transition hover:bg-[#991B1B]"
                      >
                        Mulai Susun Narasi
                      </button>

                      <button
                        type="button"
                        onClick={() => setModalArsitekturTerbuka(true)}
                        className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:text-[#DC2626]"
                      >
                        Pelajari Arsitektur Sistem
                      </button>
                    </div>
                  </div>

                  {/* Kolom Kanan: Visual Showcase Modern (Layered UI Showcase) */}
                  <div className="lg:col-span-6">
                    <div className="relative mx-auto max-w-lg">
                      {/* Kartu Latar Layer Efek Kedalaman */}
                      <div
                        aria-hidden="true"
                        className="absolute -inset-2 translate-x-2 translate-y-2 rounded-3xl border border-red-100/70 bg-white/60"
                      />

                      {/* Kartu Utama Pratinjau Dokumen Laporan Resmi Aceh */}
                      <div className="relative rounded-2xl border border-slate-200/90 bg-[#FFFFFF] p-6 shadow-2xl shadow-red-900/5">
                        {/* Header Pratinjau + Tab Mini Interaktif */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#DC2626]">
                              Pratinjau Dokumen NLG
                            </p>
                            <p className="mt-0.5 text-xs font-bold text-[#0F172A]">
                              Laporan Statistik Provinsi Aceh ({simulasiAktif.periode})
                            </p>
                          </div>

                          <div className="inline-flex rounded-lg border border-slate-200 bg-[#F8FAFC] p-0.5">
                            {SIMULASI_TOPIK_HERO.map((item, idx) => {
                              const aktif = idxSimulasi === idx
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => setIdxSimulasi(idx)}
                                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                                    aktif
                                      ? 'bg-[#DC2626] text-white shadow-sm'
                                      : 'text-slate-600 hover:text-[#0F172A]'
                                  }`}
                                >
                                  {item.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Mini-Chart Statistik SVG yang Bersih */}
                        <div className="mt-4 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-700 truncate">{simulasiAktif.judulDataset}</span>
                            <span className="font-mono text-[10px] font-semibold text-[#991B1B]">
                              Grounded JSON
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            {simulasiAktif.grafikBatang.map((bar) => (
                              <div key={bar.label} className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-600">{bar.label}</span>
                                  <span className="font-mono font-semibold text-[#0F172A]">{bar.angka}</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#991B1B] to-[#DC2626] transition-all duration-300"
                                    style={{ width: `${bar.nilai}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cuplikan Draf Narasi */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                              Hasil Sintesis Paragraf Formal
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setTopikDariBeranda(simulasiAktif.label)
                                pindahHalaman('generator')
                              }}
                              className="text-[11px] font-semibold text-[#DC2626] hover:underline"
                            >
                              Gunakan Topik {simulasiAktif.label}
                            </button>
                          </div>
                          <p className="rounded-xl border border-slate-100 bg-white p-3.5 font-serif text-xs leading-relaxed text-slate-700 text-justify">
                            {simulasiAktif.narasi}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4 Kartu Fitur Melayang (Floating Overlapping Cards ala Eduka) */}
              <section className="relative z-20 -mt-10 px-3 sm:px-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {FITUR_MELAYANG_BERANDA.map((fitur) => (
                    <div
                      key={fitur.nomor}
                      className="group relative rounded-2xl border border-slate-200/80 bg-[#FFFFFF] p-6 shadow-lg shadow-slate-900/5 transition duration-200 hover:-translate-y-1 hover:border-red-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50/60 text-[#DC2626]">
                          <Icon name={fitur.icon} className="h-5 w-5" />
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-300 group-hover:text-[#DC2626]">
                          {fitur.nomor}
                        </span>
                      </div>
                      <h2 className="mt-4 text-base font-bold text-[#0F172A]">{fitur.judul}</h2>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{fitur.deskripsi}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Horizontal Metrics Strip (Gaya Redflow) */}
            <section className="rounded-2xl border border-slate-200/80 bg-[#FFFFFF] px-6 py-7 shadow-sm sm:px-10">
              <div className="grid grid-cols-2 gap-6 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
                <div className="pt-3 first:pt-0 sm:pt-0 sm:px-4 first:sm:pl-0">
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#DC2626]">
                    {totalDatasetLabel}+
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Dataset Aktif
                  </p>
                </div>

                <div className="pt-3 sm:pt-0 sm:px-6">
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">24</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Atribut Metadata
                  </p>
                </div>

                <div className="pt-3 sm:pt-0 sm:px-6">
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">Multi-Dataset</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Synthesis Engine
                  </p>
                </div>

                <div className="pt-3 sm:pt-0 sm:px-6">
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-700">0%</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Deviasi Angka
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================================================================
            3. HALAMAN GENERATOR NARASI (SINGLE-COLUMN WORKFLOW TERPUSAT)
           =================================================================== */}
        {halamanAktif === 'generator' && (
          <NarasiLaporanView
            opsiDataset={opsiDataset}
            setOpsiDataset={setOpsiDataset}
            memuatDataset={memuatDataset}
            sinkronisasi={sinkronisasi}
            onSinkronkan={handleSinkronkanKatalog}
            onShowToast={tampilkanToast}
            initialTopicFilter={topikDariBeranda}
            onClearInitialTopic={() => setTopikDariBeranda('')}
          />
        )}

        {/* ===================================================================
            4. HALAMAN PENGEMBANG (BERSIH, EDITORIAL, & LENGKAP MEDIA SOSIAL)
           =================================================================== */}
        {halamanAktif === 'profil' && (
          <div className="space-y-8 animate-page">
            {/* Kartu Profil Utama (Split 2 Kolom Proporsional) */}
            <section className="rounded-3xl border border-slate-200/80 bg-[#FFFFFF] p-6 shadow-sm sm:p-8 md:p-10">
              <div className="grid items-start gap-8 lg:grid-cols-12">
                {/* Kiri: Foto /foto-dea.jpeg dalam Bingkai Potret Modern */}
                <div className="lg:col-span-4 flex flex-col items-center">
                  <div className="w-full max-w-[280px]">
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] shadow-md">
                      {!fotoGagalMuat ? (
                        <img
                          src="/foto-dea.jpeg"
                          alt="Dea Zasqia Pasaribu Malau"
                          onError={() => setFotoGagalMuat(true)}
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-red-50 text-[#991B1B]">
                          <span className="text-4xl font-bold tracking-wider">DZ</span>
                          <span className="mt-1 text-xs font-semibold">Dea Zasqia Pasaribu Malau</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2 text-center text-xs font-semibold text-slate-700">
                      S1 Informatika • Universitas Syiah Kuala
                    </div>
                  </div>
                </div>

                {/* Kanan: Nama, Peran, Grid Kredensial, Tombol Utama, & Tautan Sosial */}
                <div className="lg:col-span-8 space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
                      Pengembang Sistem NARA-AI
                    </p>
                    <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl md:text-4xl">
                      Dea Zasqia Pasaribu Malau
                    </h1>
                    <p className="mt-1 text-sm font-semibold text-slate-600 sm:text-base">
                      AI & Full-Stack Developer • Sistem Natural Language Generation Satu Data Aceh
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-600 text-justify">
                    Merancang arsitektur backend FastAPI, otomatisasi sinkronisasi katalog Supabase, serta algoritma
                    ekstraksi 24 atribut metadata statistik dari portal resmi Satu Data Aceh. Mengimplementasikan
                    mekanisme pencegahan halusinasi data berbasis Google Gemini API guna menghasilkan draf narasi
                    laporan statistik formal yang terverifikasi secara numerik bagi UPTD Statistik Diskominsa Aceh.
                  </p>

                  {/* Grid Kredensial Rapi (2x2) */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">NPM</p>
                      <p className="mt-1 font-mono text-sm font-bold text-[#0F172A]">2308107010004</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Program Studi
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#0F172A]">
                        S1 Informatika, FMIPA Universitas Syiah Kuala
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Instansi Mitra
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#0F172A]">
                        UPTD Statistik, Diskominsa Aceh
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Pembimbing Lapangan
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#0F172A]">
                        Zulham Efendi Irfan, S.H.I, S.H, M.Si
                      </p>
                    </div>
                  </div>

                  {/* Tombol Aksi Utama */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href="https://github.com/deazasqiamalau/AI-Narasi-Laporan-KKP"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#991B1B]"
                    >
                      <Icon name="github" className="h-4 w-4" />
                      <span>Repository Proyek</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => pindahHalaman('generator')}
                      className="rounded-xl border border-slate-200 bg-[#FFFFFF] px-5 py-3 text-xs sm:text-sm font-semibold text-[#0F172A] shadow-sm transition hover:border-red-200 hover:text-[#DC2626]"
                    >
                      Buka Generator Narasi
                    </button>
                  </div>

                  {/* Deretan Tautan Media Sosial & Dual Akun GitHub */}
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Tautan Media Sosial & Dual Akun GitHub
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      {TAUTAN_SOSIAL_PENGEMBANG.map((sosial) => (
                        <a
                          key={sosial.id}
                          href={sosial.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#DC2626] hover:bg-red-50/60 hover:text-[#DC2626]"
                        >
                          <Icon name={sosial.icon} className="h-4 w-4 text-[#DC2626]" />
                          <span>{sosial.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bagian Bawah: 3 Kartu Kontribusi Teknis & 1 Baris Horizontal Teknologi */}
            <section className="space-y-6">
              <div className="grid gap-5 md:grid-cols-3">
                {KONTRIBUSI_SISTEM_KARTU.map((item) => (
                  <div
                    key={item.nomor}
                    className="group rounded-2xl border border-slate-200/80 bg-[#FFFFFF] p-6 shadow-sm transition hover:border-red-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50/60 text-[#DC2626]">
                        <Icon name={item.icon} className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-300 group-hover:text-[#DC2626]">
                        {item.nomor}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-[#0F172A]">{item.judul}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.deskripsi}</p>
                  </div>
                ))}
              </div>

              {/* 1 Baris Horizontal Teknologi yang Digunakan */}
              <div className="rounded-2xl border border-slate-200/80 bg-[#FFFFFF] p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
                      Stack Teknologi Utama
                    </p>
                    <h3 className="mt-0.5 text-lg font-bold text-[#0F172A]">
                      Teknologi & Infrastruktur Sistem
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Pilih teknologi untuk melihat perannya pada arsitektur
                  </p>
                </div>

                <div className="mt-4 overflow-x-auto custom-scrollbar pb-1">
                  <div className="grid min-w-[680px] grid-cols-7 gap-2.5">
                    {TEKNOLOGI_TOOLS.map((item) => {
                      const terpilih = techAktif?.nama === item.nama
                      return (
                        <button
                          key={item.nama}
                          type="button"
                          onMouseEnter={() => setTechAktif(item)}
                          onClick={() => setTechAktif(item)}
                          className={`flex flex-col items-center justify-center rounded-xl border px-2.5 py-3.5 text-center transition ${
                            terpilih
                              ? 'border-[#DC2626] bg-red-50/50 shadow-sm'
                              : 'border-slate-200 bg-[#F8FAFC] hover:border-red-200 hover:bg-[#FFFFFF]'
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                              terpilih
                                ? 'bg-[#DC2626] text-white'
                                : 'border border-slate-200 bg-[#FFFFFF] text-[#DC2626]'
                            }`}
                          >
                            <Icon name={item.icon} className="h-4 w-4" />
                          </span>
                          <span className="mt-2 text-xs font-bold text-[#0F172A] whitespace-nowrap">
                            {item.nama}
                          </span>
                          <span className="mt-0.5 text-[10px] font-medium text-slate-400 whitespace-nowrap">
                            {item.kategori}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {techAktif && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/40 px-4 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DC2626] text-white">
                      <Icon name={techAktif.icon} className="h-4 w-4" />
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong className="font-bold text-[#0F172A]">{techAktif.nama}</strong>{' '}
                      <span className="font-semibold text-[#991B1B]">({techAktif.kategori})</span>: {techAktif.peran}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* POP-UP MODAL: TENTANG SISTEM (ARSITEKTUR & CARA KERJA) */}
      {modalArsitekturTerbuka && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setModalArsitekturTerbuka(false)}
        >
          <div
            className="animate-modal max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-[#FFFFFF] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
                  Tentang Sistem & Arsitektur
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#0F172A]">
                  Alur Kerja Sistem NARA-AI
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalArsitekturTerbuka(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Tutup modal"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {TAHAP_ARSITEKTUR.map((item, idx) => (
                <div
                  key={item.tahap}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 transition hover:border-red-200 hover:bg-[#FFFFFF]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2.5 text-xs font-bold text-[#0F172A]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#DC2626] font-mono text-[11px] text-white">
                        0{idx + 1}
                      </span>
                      {item.judul}
                    </span>
                    <span className="rounded bg-red-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#991B1B]">
                      {item.endpoint}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.penjelasan}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setModalArsitekturTerbuka(false)}
                className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalArsitekturTerbuka(false)
                  pindahHalaman('generator')
                }}
                className="rounded-xl bg-[#DC2626] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#991B1B]"
              >
                Mulai Susun Narasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER MINIMALIS & NATURAL */}
      <footer className="border-t border-slate-200/80 bg-[#FFFFFF] py-6 mt-auto">
        <div className="mx-auto max-w-6xl px-4 flex flex-col gap-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold text-[#0F172A]">
              NARA<span className="text-[#DC2626]">-AI</span> • Sistem Analitik & Narasi Statistik Satu Data Aceh
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              UPTD Statistik • Dinas Komunikasi, Informatika dan Persandian Aceh
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TAUTAN_SOSIAL_PENGEMBANG.map((sosial) => (
              <a
                key={sosial.id}
                href={sosial.url}
                target="_blank"
                rel="noopener noreferrer"
                title={sosial.label}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-[#DC2626] hover:bg-red-50/60 hover:text-[#DC2626]"
              >
                <Icon name={sosial.icon} className="h-3.5 w-3.5 text-[#DC2626]" />
                <span>{sosial.labelSingkat}</span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
