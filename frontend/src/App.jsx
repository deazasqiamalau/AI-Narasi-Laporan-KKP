import { useEffect, useRef, useState } from 'react'
import NarasiLaporanView, { fetchJson, Icon, saringDatasetAsli } from './NarasiLaporan'

function useCountUp(target, duration = 1100, start = true) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) {
      setValue(0)
      return
    }

    const endValue = Number(target) || 0
    if (endValue <= 0) {
      setValue(0)
      return
    }

    let frameId = null
    let startTime = null

    const tick = (timestamp) => {
      if (startTime === null) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(endValue * eased))
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [target, duration, start])

  return value
}

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
    label: 'Data Pipeline & Metadata',
    judul: '01. Data Pipeline & Metadata',
    deskripsi:
      'Merancang arsitektur akuisisi katalog otomatis dari API Satu Data Aceh ke Supabase PostgreSQL dengan paginasi penuh serta pembersihan 24 atribut metadata administratif BPS/Kemendagri.',
    tags: ['Satu Data Aceh API', 'Supabase Pagination', 'Filter 24 Metadata'],
  },
  {
    nomor: '02',
    icon: 'sparkle',
    label: 'Prompt Grounding & NLG',
    judul: '02. Prompt Grounding & NLG',
    deskripsi:
      'Mengembangkan modul sintesis multi-dataset berbasis Google Gemini API yang merangkai fakta JSON menjadi 2 - 4 paragraf laporan formal pemerintah dengan jaminan 0% deviasi angka.',
    tags: ['Google Gemini LLM', 'Temperature 0.2', 'Guard Dataset Kosong'],
  },
  {
    nomor: '03',
    icon: 'table',
    label: 'Antarmuka & Audit Verifikasi',
    judul: '03. Antarmuka & Audit Verifikasi',
    deskripsi:
      'Membangun antarmuka pengguna satu kolom terpusat berbasis React dan Tailwind CSS yang dilengkapi pencarian katalog real-time, filter tahun per dataset, serta tabel audit verifikasi sumber.',
    tags: ['Split View Audit', 'Filter Tahun Dinamis', 'Ekspor TXT & DOC'],
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
    peran: 'Antarmuka web modern untuk pemilihan dataset, pratinjau sampel data, filter tahun, dan verifikasi tabel sumber.',
  },
  {
    nama: 'Tailwind CSS',
    kategori: 'Design System',
    icon: 'filter',
    peran: 'Sistem tata letak editorial bersih dengan identitas visual Bold Crimson khas UPTD Statistik Diskominsa Aceh.',
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
    judul: 'Pencarian Real-Time & Pratinjau Metadata Tahun',
    endpoint: 'GET /cari-dataset • GET /tahun-dataset',
    penjelasan:
      'Pengguna mencari topik sektoral dan memeriksa rincian jumlah baris, indikator numerik, sampel data, serta memilih tahun target sebelum menyusun narasi.',
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
      'Data JSON bersih dikirim ke LLM dengan instruksi tanpa pembulatan angka. Hasil narasi ditampilkan berdampingan (Split View) dengan tabel data mentah.',
  },
]

export default function App() {
  const [halamanAktif, setHalamanAktif] = useState('beranda') // 'beranda' | 'generator' | 'profil'
  const [opsiDataset, setOpsiDataset] = useState([])
  const [memuatDataset, setMemuatDataset] = useState(true)
  const [sinkronisasi, setSinkronisasi] = useState(false)
  const [toastPesan, setToastPesan] = useState('')

  // State Simulasi Interaktif & Animasi di Hero Beranda
  const [idxSimulasi, setIdxSimulasi] = useState(0)
  const [topikDariBeranda, setTopikDariBeranda] = useState('')
  const [panjangKetikSimulasi, setPanjangKetikSimulasi] = useState(0)
  const [grafikSiap, setGrafikSiap] = useState(false)

  // State Count-up Metrik Strip
  const [metrikTerlihat, setMetrikTerlihat] = useState(false)
  const metrikRef = useRef(null)

  // State Pop-up Modal Arsitektur ("Tentang Sistem")
  const [modalArsitekturTerbuka, setModalArsitekturTerbuka] = useState(false)

  // State Interaktif Halaman Pengembang
  const [tabProfil, setTabProfil] = useState('kredensial') // 'kredensial' | 'rekayasa'
  const [idxKontribusi, setIdxKontribusi] = useState(0)
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

  // Animasi masuk grafik batang saat Beranda dibuka
  useEffect(() => {
    if (halamanAktif !== 'beranda') return
    setGrafikSiap(false)
    let r2 = null
    const r1 = window.requestAnimationFrame(() => {
      r2 = window.requestAnimationFrame(() => setGrafikSiap(true))
    })
    return () => {
      window.cancelAnimationFrame(r1)
      if (r2 !== null) window.cancelAnimationFrame(r2)
    }
  }, [halamanAktif])

  // Efek ketik halus (typewriter) pada paragraf pratinjau Hero
  useEffect(() => {
    if (halamanAktif !== 'beranda') return
    const teksTarget = (SIMULASI_TOPIK_HERO[idxSimulasi] || SIMULASI_TOPIK_HERO[0]).narasi
    setPanjangKetikSimulasi(0)

    const timer = window.setInterval(() => {
      setPanjangKetikSimulasi((prev) => {
        const next = prev + 2
        if (next >= teksTarget.length) {
          window.clearInterval(timer)
          return teksTarget.length
        }
        return next
      })
    }, 14)

    return () => window.clearInterval(timer)
  }, [idxSimulasi, halamanAktif])

  // Trigger count-up ketika Horizontal Metrics Strip masuk viewport
  useEffect(() => {
    if (halamanAktif !== 'beranda') {
      setMetrikTerlihat(false)
      return
    }
    const el = metrikRef.current
    if (!el || typeof window.IntersectionObserver === 'undefined') {
      setMetrikTerlihat(true)
      return
    }
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMetrikTerlihat(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
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

  const targetDatasetCount = opsiDataset.length > 0 ? opsiDataset.length : 4052
  const hitungDataset = useCountUp(targetDatasetCount, 1100, !memuatDataset && metrikTerlihat)
  const hitungMetadata = useCountUp(24, 900, metrikTerlihat)

  const simulasiAktif = SIMULASI_TOPIK_HERO[idxSimulasi] || SIMULASI_TOPIK_HERO[0]
  const teksSimulasiTampil = simulasiAktif.narasi.slice(0, panjangKetikSimulasi)
  const sedangKetikSimulasi = panjangKetikSimulasi < simulasiAktif.narasi.length
  const kontribusiAktif = KONTRIBUSI_SISTEM_KARTU[idxKontribusi] || KONTRIBUSI_SISTEM_KARTU[0]

  return (
    <div className="min-h-screen bg-nara-pattern font-ui text-[#0F172A] flex flex-col overflow-x-clip">
      {/* TOAST NOTIFICATION */}
      {toastPesan && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-[#FFFFFF] px-4 py-3 text-xs font-semibold text-[#0F172A] card-crimson-shadow animate-modal">
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

      {/* 1. TOP NAVBAR FLOATING FROSTED-CRIMSON DENGAN WORDMARK EDITORIAL */}
      <header className="sticky top-3 z-40 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-white/15 bg-gradient-to-r from-[#7F1D1D]/95 via-[#991B1B]/95 to-[#B91C1C]/95 text-white shadow-[0_14px_34px_-12px_rgba(127,29,29,0.55)] ring-1 ring-inset ring-white/10 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            {/* Kiri: Pure Stylized Typographic Wordmark (Tanpa Logo Kotak) */}
            <button
              type="button"
              onClick={() => pindahHalaman('beranda')}
              className="flex items-center gap-3.5 text-left group"
            >
              <span className="inline-flex items-baseline leading-none">
                <span className="font-editorial text-xl sm:text-[22px] font-bold tracking-tight text-white transition group-hover:text-red-50">
                  NARA
                </span>
                <span className="font-editorial italic font-semibold text-xl sm:text-[22px] text-red-200 ml-1">
                  AI
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-red-300 ml-1 mb-0.5 shadow-[0_0_8px_rgba(252,165,165,0.9)]"
                />
              </span>
              <span aria-hidden="true" className="hidden sm:block h-5 w-px bg-white/20" />
              <span className="hidden sm:block text-[10px] font-medium uppercase tracking-[0.14em] text-red-100/85">
                UPTD Statistik Aceh
              </span>
            </button>

            {/* Tengah: Fluid Frosted Pill Track (Desktop) */}
            <nav
              aria-label="Navigasi Utama"
              className="hidden md:flex items-center gap-1 rounded-full bg-black/15 p-1 ring-1 ring-white/10"
            >
              <button
                type="button"
                onClick={() => pindahHalaman('beranda')}
                className={
                  halamanAktif === 'beranda'
                    ? 'rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/25 shadow-sm transition-all duration-200'
                    : 'rounded-full px-4 py-1.5 text-[13px] font-medium text-red-100/85 transition-all duration-200 hover:bg-white/10 hover:text-white'
                }
              >
                Beranda
              </button>

              <button
                type="button"
                onClick={() => pindahHalaman('generator')}
                className={
                  halamanAktif === 'generator'
                    ? 'rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/25 shadow-sm transition-all duration-200'
                    : 'rounded-full px-4 py-1.5 text-[13px] font-medium text-red-100/85 transition-all duration-200 hover:bg-white/10 hover:text-white'
                }
              >
                Generator Narasi
              </button>

              <button
                type="button"
                onClick={() => setModalArsitekturTerbuka(true)}
                className={
                  modalArsitekturTerbuka
                    ? 'rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/25 shadow-sm transition-all duration-200'
                    : 'rounded-full px-4 py-1.5 text-[13px] font-medium text-red-100/85 transition-all duration-200 hover:bg-white/10 hover:text-white'
                }
              >
                Tentang Sistem
              </button>

              <button
                type="button"
                onClick={() => pindahHalaman('profil')}
                className={
                  halamanAktif === 'profil'
                    ? 'rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/25 shadow-sm transition-all duration-200'
                    : 'rounded-full px-4 py-1.5 text-[13px] font-medium text-red-100/85 transition-all duration-200 hover:bg-white/10 hover:text-white'
                }
              >
                Pengembang
              </button>
            </nav>

            {/* Kanan: Soft Elevated White Pill CTA */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => pindahHalaman('generator')}
                className="rounded-full bg-white px-5 py-2 text-xs sm:text-[13px] font-semibold text-[#8E1118] shadow-md shadow-red-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-lg"
              >
                Buat Laporan
              </button>
            </div>
          </div>

          {/* Sub-navigasi Mobile */}
          <div className="flex md:hidden items-center justify-around gap-1 border-t border-white/10 px-2.5 py-2 text-xs">
            <button
              type="button"
              onClick={() => pindahHalaman('beranda')}
              className={
                halamanAktif === 'beranda'
                  ? 'rounded-full bg-white/20 px-3 py-1 font-semibold text-white'
                  : 'px-2.5 py-1 font-medium text-red-100/80 hover:text-white'
              }
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => pindahHalaman('generator')}
              className={
                halamanAktif === 'generator'
                  ? 'rounded-full bg-white/20 px-3 py-1 font-semibold text-white'
                  : 'px-2.5 py-1 font-medium text-red-100/80 hover:text-white'
              }
            >
              Generator Narasi
            </button>
            <button
              type="button"
              onClick={() => setModalArsitekturTerbuka(true)}
              className={
                modalArsitekturTerbuka
                  ? 'rounded-full bg-white/20 px-3 py-1 font-semibold text-white'
                  : 'px-2.5 py-1 font-medium text-red-100/80 hover:text-white'
              }
            >
              Tentang Sistem
            </button>
            <button
              type="button"
              onClick={() => pindahHalaman('profil')}
              className={
                halamanAktif === 'profil'
                  ? 'rounded-full bg-white/20 px-3 py-1 font-semibold text-white'
                  : 'px-2.5 py-1 font-medium text-red-100/80 hover:text-white'
              }
            >
              Pengembang
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto w-full max-w-6xl flex-grow px-4 py-8 sm:px-6 md:py-10">
        {/* ===================================================================
            2. HALAMAN BERANDA (EDITORIAL SERIF + AMBIENT RED LIGHT ORBS)
           =================================================================== */}
        {halamanAktif === 'beranda' && (
          <div className="space-y-12 animate-page">
            <div className="relative">
              {/* 3 Lapisan Ambient Red Light Orbs di Belakang Area Hero Beranda */}
              <div
                aria-hidden="true"
                className="red-light-glow absolute -top-20 -right-16 z-0 h-96 w-96 rounded-full"
              />
              <div
                aria-hidden="true"
                className="red-light-glow-alt absolute -bottom-12 -left-20 z-0 h-80 w-80 rounded-full"
              />
              <div
                aria-hidden="true"
                className="red-light-glow absolute top-1/3 left-1/3 z-0 h-64 w-64 rounded-full"
              />

              {/* Hero Section dengan Latar Belakang Artistik */}
              <section className="relative z-10 overflow-hidden rounded-3xl border border-red-100/80 bg-gradient-to-br from-red-50/85 via-white/95 to-rose-50/60 px-6 pt-10 pb-16 card-crimson-shadow sm:px-10 sm:pt-14 sm:pb-20 lg:px-12">
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
                      AI NATURAL LANGUAGE GENERATION • SATU DATA ACEH
                    </p>

                    <h1 className="font-editorial text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                      AI Narasi Laporan Statistik Resmi Satu Data Aceh.
                    </h1>

                    <p className="text-base leading-relaxed text-slate-600 max-w-xl">
                      Sistem Natural Language Generation berbasis Large Language Model (Google Gemini) untuk mengubah
                      dataset resmi Portal Satu Data Aceh menjadi draf narasi laporan statistik formal secara
                      otomatis. Dilengkapi pembersihan 24 atribut metadata wilayah dan validasi pencegahan halusinasi
                      angka yang terverifikasi langsung terhadap tabel data sumber JSON.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <button
                        type="button"
                        onClick={() => pindahHalaman('generator')}
                        className="btn-shimmer rounded-xl bg-gradient-to-r from-[#8E1118] via-[#DC2626] to-[#991B1B] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:from-[#7F1D1D] hover:to-[#991B1B]"
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

                  {/* Kolom Kanan: Visual Showcase Modern (Layered UI Showcase + Floating Animation) */}
                  <div className="lg:col-span-6">
                    <div className="relative mx-auto max-w-lg animate-float hover:[animation-play-state:paused]">
                      {/* Kartu Latar Layer Efek Kedalaman */}
                      <div
                        aria-hidden="true"
                        className="absolute -inset-2 translate-x-2 translate-y-2 rounded-3xl border border-red-100/70 bg-white/60"
                      />

                      {/* Kartu Utama Pratinjau Dokumen Laporan Resmi Aceh */}
                      <div className="relative rounded-2xl border border-slate-200/90 bg-[#FFFFFF] p-6 card-crimson-shadow">
                        {/* Pojok Atas dengan Badge Contoh Simulasi */}
                        <div className="flex items-center justify-between gap-2 pb-2.5">
                          <p className="font-mono-num text-[10px] font-semibold uppercase tracking-widest text-[#DC2626]">
                            Pratinjau Dokumen NLG
                          </p>
                          <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 font-mono-num text-[10px] font-semibold text-[#991B1B]">
                            Contoh Simulasi
                          </span>
                        </div>

                        {/* Header Pratinjau + Tab Mini Interaktif */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                          <p className="text-xs font-bold text-[#0F172A]">
                            Laporan Statistik Provinsi Aceh (<span className="font-mono-num">{simulasiAktif.periode}</span>)
                          </p>

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

                        {/* Mini-Chart Statistik dengan Transisi Lebar Halus duration-700 */}
                        <div className="mt-4 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="font-semibold text-slate-700 truncate">{simulasiAktif.judulDataset}</span>
                            <span className="shrink-0 font-mono-num text-[10px] font-semibold text-[#991B1B]">
                              Grounded JSON
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            {simulasiAktif.grafikBatang.map((bar, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-600">{bar.label}</span>
                                  <span className="font-mono-num font-semibold text-[#0F172A]">
                                    {bar.angka}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#8E1118] to-[#DC2626] transition-all duration-700 ease-out"
                                    style={{ width: grafikSiap ? `${bar.nilai}%` : '0%' }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cuplikan Draf Narasi dengan Efek Ketik Halus (Typewriter) + Font Editorial Lora */}
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
                          <p className="min-h-[92px] rounded-xl border border-slate-100 bg-white p-3.5 font-editorial text-xs leading-relaxed text-slate-700 text-justify">
                            {teksSimulasiTampil}
                            {sedangKetikSimulasi && (
                              <span
                                aria-hidden="true"
                                className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 bg-[#DC2626] animate-caret"
                              />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4 Kartu Fitur Melayang (Floating Overlapping Cards) dengan Crimson-Tinted Shadows */}
              <section className="relative z-20 -mt-10 px-3 sm:px-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {FITUR_MELAYANG_BERANDA.map((fitur) => (
                    <div
                      key={fitur.nomor}
                      className="group relative rounded-2xl border border-slate-200/80 bg-[#FFFFFF] p-6 card-crimson-interactive hover:border-red-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50/60 text-[#DC2626] transition-colors duration-300 group-hover:border-[#DC2626] group-hover:bg-[#DC2626] group-hover:text-white">
                          <Icon name={fitur.icon} className="h-5 w-5" />
                        </span>
                        <span className="font-mono-num text-xs font-semibold text-slate-300 transition-colors group-hover:text-[#DC2626]">
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

            {/* Horizontal Metrics Strip dengan Animasi Count-Up & Font JetBrains Mono */}
            <section
              ref={metrikRef}
              className="rounded-2xl border border-slate-200/80 bg-[#FFFFFF] px-6 py-7 card-crimson-shadow sm:px-10"
            >
              <div className="grid grid-cols-2 gap-6 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
                <div className="pt-3 first:pt-0 sm:pt-0 sm:px-4 first:sm:pl-0">
                  <p className="font-mono-num text-2xl sm:text-3xl font-bold tracking-tight text-[#DC2626]">
                    {memuatDataset ? '...' : `${hitungDataset.toLocaleString('id-ID')}+`}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Dataset Aktif
                  </p>
                </div>

                <div className="pt-3 sm:pt-0 sm:px-6">
                  <p className="font-mono-num text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                    {hitungMetadata}
                  </p>
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
                  <p className="font-mono-num text-2xl sm:text-3xl font-bold tracking-tight text-emerald-700">
                    0%
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Deviasi Angka
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================================================================
            3. HALAMAN GENERATOR NARASI
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
            4. HALAMAN PENGEMBANG (EDITORIAL OPEN-CANVAS & INTERAKTIF)
           =================================================================== */}
        {halamanAktif === 'profil' && (
          <div className="space-y-14 pb-6 animate-page">
            {/* ACT 1: OPEN-CANVAS EDITORIAL HERO SPLIT */}
            <section className="relative pt-2 pb-4">
              <div
                aria-hidden="true"
                className="red-light-glow absolute -top-10 -left-12 z-0 h-80 w-80 rounded-full"
              />
              <div
                aria-hidden="true"
                className="red-light-glow-alt absolute bottom-0 left-1/4 z-0 h-64 w-64 rounded-full"
              />

              <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12">
                {/* Kiri: Komposisi Potret Editorial Dinamis */}
                <div className="lg:col-span-5">
                  <div className="group relative mx-auto w-full max-w-[320px]">
                    <div
                      aria-hidden="true"
                      className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-[#991B1B]/20 via-red-200/45 to-rose-100/20 -rotate-2 transition-transform duration-500 group-hover:rotate-0"
                    />
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-[#F8FAFC] shadow-[0_24px_50px_-16px_rgba(127,29,29,0.35)] ring-1 ring-black/5">
                      {!fotoGagalMuat ? (
                        <img
                          src="/foto-dea.jpeg"
                          alt="Dea Zasqia Pasaribu Malau"
                          onError={() => setFotoGagalMuat(true)}
                          className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-red-50 text-[#991B1B]">
                          <span className="font-editorial text-5xl font-bold tracking-wider">DZ</span>
                          <span className="mt-2 text-xs font-semibold">Dea Zasqia Pasaribu Malau</span>
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#450A0A]/90 via-[#450A0A]/45 to-transparent px-5 pb-4 pt-12 text-white">
                        <p className="text-[11px] font-medium text-red-100">
                          S1 Informatika • Universitas Syiah Kuala
                        </p>
                        <p className="mt-0.5 font-mono-num text-xs font-semibold tracking-wider text-white">
                          NPM 2308107010004
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kanan: Tipografi Tajam, Switcher Interaktif, & Hairline Spec Ledger */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2.5">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#DC2626]">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
                      <span>PENGEMBANG SISTEM • NARA AI</span>
                    </div>
                    <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-[#0F172A] leading-[1.1]">
                      Dea Zasqia{' '}
                      <span className="italic font-semibold text-[#991B1B]">Pasaribu Malau</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-600 sm:text-base">
                      AI & Full-Stack Developer • Natural Language Generation Satu Data Aceh
                    </p>
                  </div>

                  {/* Interactive 2-Tab Pill Switcher */}
                  <div className="inline-flex items-center gap-1 rounded-full border border-slate-200/90 bg-white/80 p-1 backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => setTabProfil('kredensial')}
                      className={
                        tabProfil === 'kredensial'
                          ? 'rounded-full bg-[#991B1B] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition'
                          : 'rounded-full px-4 py-1.5 text-xs font-medium text-slate-600 transition hover:text-[#991B1B]'
                      }
                    >
                      Ringkasan & Kredensial
                    </button>
                    <button
                      type="button"
                      onClick={() => setTabProfil('rekayasa')}
                      className={
                        tabProfil === 'rekayasa'
                          ? 'rounded-full bg-[#991B1B] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition'
                          : 'rounded-full px-4 py-1.5 text-xs font-medium text-slate-600 transition hover:text-[#991B1B]'
                      }
                    >
                      Fokus Rekayasa
                    </button>
                  </div>

                  {tabProfil === 'kredensial' ? (
                    <div key="tab-kredensial" className="space-y-5 animate-page">
                      <p className="text-sm leading-relaxed text-slate-600 text-justify">
                        Merancang arsitektur backend FastAPI, otomatisasi sinkronisasi katalog Supabase, serta
                        algoritma ekstraksi 24 atribut metadata statistik dari portal resmi Satu Data Aceh.
                        Mengimplementasikan mekanisme pencegahan halusinasi data berbasis Google Gemini API guna
                        menghasilkan draf narasi laporan statistik formal bagi UPTD Statistik Diskominsa Aceh.
                      </p>

                      {/* Hairline Editorial Spec Ledger */}
                      <dl className="divide-y divide-slate-200/80 border-y border-slate-200/80 text-sm">
                        <div className="flex flex-col gap-1 py-2.5 px-2 -mx-2 rounded-lg transition-colors hover:bg-red-50/40 sm:flex-row sm:items-center sm:justify-between">
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">NPM</dt>
                          <dd className="font-mono-num font-bold text-[#0F172A]">2308107010004</dd>
                        </div>
                        <div className="flex flex-col gap-1 py-2.5 px-2 -mx-2 rounded-lg transition-colors hover:bg-red-50/40 sm:flex-row sm:items-center sm:justify-between">
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Program Studi
                          </dt>
                          <dd className="font-semibold text-[#0F172A] sm:text-right">
                            S1 Informatika, FMIPA Universitas Syiah Kuala
                          </dd>
                        </div>
                        <div className="flex flex-col gap-1 py-2.5 px-2 -mx-2 rounded-lg transition-colors hover:bg-red-50/40 sm:flex-row sm:items-center sm:justify-between">
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Instansi Mitra
                          </dt>
                          <dd className="font-semibold text-[#0F172A] sm:text-right">
                            UPTD Statistik, Dinas Komunikasi, Informatika dan Persandian (Diskominsa) Aceh
                          </dd>
                        </div>
                        <div className="flex flex-col gap-1 py-2.5 px-2 -mx-2 rounded-lg transition-colors hover:bg-red-50/40 sm:flex-row sm:items-center sm:justify-between">
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Dosen Pembimbing
                          </dt>
                          <dd className="font-semibold text-[#0F172A] sm:text-right">
                            Kikye Martiwi Sukiakhy, S.T., M.Kom.
                          </dd>
                        </div>
                        <div className="flex flex-col gap-1 py-2.5 px-2 -mx-2 rounded-lg transition-colors hover:bg-red-50/40 sm:flex-row sm:items-center sm:justify-between">
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Pembimbing Lapangan
                          </dt>
                          <dd className="font-semibold text-[#0F172A] sm:text-right">
                            Zulham Efendi Irfan, S.H.I, S.H, M.Si
                          </dd>
                        </div>
                      </dl>
                    </div>
                  ) : (
                    <div key="tab-rekayasa" className="space-y-5 animate-page">
                      <div className="grid grid-cols-3 gap-5 border-y border-slate-200/80 py-5">
                        <div>
                          <p className="font-mono-num text-3xl font-bold text-[#991B1B]">24</p>
                          <p className="mt-1 text-xs font-medium text-slate-600">
                            Atribut Metadata Dibersihkan
                          </p>
                        </div>
                        <div>
                          <p className="font-mono-num text-3xl font-bold text-[#0F172A]">5</p>
                          <p className="mt-1 text-xs font-medium text-slate-600">Endpoint FastAPI Terintegrasi</p>
                        </div>
                        <div>
                          <p className="font-mono-num text-3xl font-bold text-emerald-700">0%</p>
                          <p className="mt-1 text-xs font-medium text-slate-600">Deviasi Angka JSON</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600 text-justify">
                        Fokus rekayasa sistem meliputi sinkronisasi otomatis ribuan katalog portal Satu Data Aceh ke
                        Supabase PostgreSQL, penyaringan data per tahun pada level endpoint, penerapan temperatur rendah
                        pada Gemini LLM untuk menjaga konsistensi numerik, serta antarmuka Split View agar tim
                        statistik dapat mengaudit langsung angka narasi terhadap baris JSON asli.
                      </p>
                    </div>
                  )}

                  {/* Action Pills + Minimalist Inline Social Links */}
                  <div className="space-y-4 pt-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href="https://github.com/deazasqiamalau/AI-Narasi-Laporan-KKP"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8E1118] via-[#B91C1C] to-[#DC2626] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-red-900/20 transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <Icon name="github" className="h-4 w-4" />
                        <span>Repository Proyek</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => pindahHalaman('generator')}
                        className="rounded-full border border-slate-300/80 bg-white/75 px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#0F172A] backdrop-blur-sm transition hover:border-[#DC2626] hover:text-[#991B1B]"
                      >
                        Buka Generator Narasi
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pt-1">
                      {TAUTAN_SOSIAL_PENGEMBANG.map((sosial) => (
                        <a
                          key={sosial.id}
                          href={sosial.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition hover:text-[#991B1B]"
                        >
                          <Icon
                            name={sosial.icon}
                            className="h-4 w-4 text-[#DC2626] transition-transform group-hover:scale-110"
                          />
                          <span>{sosial.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ACT 2: INTERACTIVE EDITORIAL CONTRIBUTION SPOTLIGHT */}
            <section className="border-t border-slate-200/80 pt-10">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
                    Peran & Rekayasa Sistem
                  </p>
                  <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-[#0F172A]">
                    Tiga Pilar Kontribusi Arsitektur
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Pilih atau arahkan kursor ke salah satu pilar untuk meninjau rincian
                </p>
              </div>

              <div className="mt-7 grid items-start gap-8 lg:grid-cols-12">
                {/* Kiri: 3 Interactive Index Rows */}
                <div className="lg:col-span-5 divide-y divide-slate-200/80 border-y border-slate-200/80">
                  {KONTRIBUSI_SISTEM_KARTU.map((item, idx) => {
                    const aktif = idxKontribusi === idx
                    return (
                      <button
                        key={item.nomor}
                        type="button"
                        onMouseEnter={() => setIdxKontribusi(idx)}
                        onClick={() => setIdxKontribusi(idx)}
                        className={`group flex w-full items-center justify-between gap-4 py-4 px-3 text-left transition-all border-l-2 ${
                          aktif
                            ? 'border-[#DC2626] bg-red-50/50 text-[#0F172A]'
                            : 'border-transparent text-slate-500 hover:border-red-200 hover:bg-white/60 hover:text-[#0F172A]'
                        }`}
                      >
                        <div className="flex items-baseline gap-4 min-w-0">
                          <span
                            className={`font-editorial italic text-2xl font-bold transition-colors ${
                              aktif ? 'text-[#DC2626]' : 'text-slate-300 group-hover:text-red-400'
                            }`}
                          >
                            {item.nomor}
                          </span>
                          <span className={`font-editorial text-base sm:text-lg ${aktif ? 'font-bold' : 'font-medium'}`}>
                            {item.label}
                          </span>
                        </div>
                        <Icon
                          name="arrowRight"
                          className={`h-4 w-4 shrink-0 transition-transform ${
                            aktif
                              ? 'text-[#DC2626] translate-x-0.5'
                              : 'text-slate-300 group-hover:text-[#DC2626]'
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>

                {/* Kanan: Dynamic Deep Crimson Editorial Spotlight Stage */}
                <div className="lg:col-span-7">
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7F1D1D] via-[#991B1B] to-[#450A0A] p-7 sm:p-9 text-white shadow-[0_22px_50px_-16px_rgba(127,29,29,0.5)]">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-4 -bottom-8 font-editorial italic text-[140px] font-bold leading-none text-white/10 select-none"
                    >
                      {kontribusiAktif.nomor}
                    </span>

                    <div key={kontribusiAktif.nomor} className="relative z-10 space-y-5 animate-fade-slide-up">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-red-100 backdrop-blur-sm">
                          <Icon name={kontribusiAktif.icon} className="h-5 w-5" />
                        </span>
                        <span className="font-mono-num text-xs font-semibold uppercase tracking-widest text-red-200">
                          Pilar Arsitektur {kontribusiAktif.nomor}
                        </span>
                      </div>

                      <h3 className="font-editorial text-2xl font-bold text-white leading-snug">
                        {kontribusiAktif.label}
                      </h3>

                      <p className="text-sm leading-relaxed text-red-50/90 max-w-xl">
                        {kontribusiAktif.deskripsi}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {kontribusiAktif.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1 font-mono-num text-[11px] font-medium text-red-50 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ACT 3: AIRY OPEN-CANVAS INTERACTIVE TECH RIBBON */}
            <section className="border-t border-slate-200/80 pt-10 space-y-5">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
                    Ekosistem Pengembangan
                  </p>
                  <h2 className="mt-0.5 font-editorial text-xl sm:text-2xl font-bold text-[#0F172A]">
                    Stack & Ekosistem Teknologi
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Klik atau arahkan kursor pada teknologi untuk melihat perannya
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {TEKNOLOGI_TOOLS.map((item) => {
                  const terpilih = techAktif?.nama === item.nama
                  return (
                    <button
                      key={item.nama}
                      type="button"
                      onMouseEnter={() => setTechAktif(item)}
                      onClick={() => setTechAktif(item)}
                      className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                        terpilih
                          ? 'bg-[#991B1B] text-white shadow-md shadow-red-900/25 -translate-y-0.5'
                          : 'border border-slate-200/90 bg-white/80 text-slate-700 backdrop-blur-sm hover:-translate-y-0.5 hover:border-red-300 hover:text-[#991B1B]'
                      }`}
                    >
                      <Icon
                        name={item.icon}
                        className={`h-4 w-4 ${terpilih ? 'text-red-200' : 'text-[#DC2626]'}`}
                      />
                      <span>{item.nama}</span>
                    </button>
                  )
                })}
              </div>

              {techAktif && (
                <div
                  key={techAktif.nama}
                  className="border-l-2 border-[#DC2626] pl-4 py-1 animate-page"
                >
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong className="font-editorial text-base font-bold text-[#0F172A]">
                      {techAktif.nama}
                    </strong>{' '}
                    <span className="font-mono-num text-xs font-semibold text-[#991B1B]">
                      ({techAktif.kategori})
                    </span>{' '}
                    : {techAktif.peran}
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* POP-UP MODAL: TENTANG SISTEM (ARSITEKTUR & CARA KERJA) */}
      {modalArsitekturTerbuka && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
          onClick={() => setModalArsitekturTerbuka(false)}
        >
          <div
            className="animate-fade-slide-up max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-[#FFFFFF] p-6 card-crimson-shadow sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
                  Tentang Sistem & Arsitektur
                </p>
                <h2 className="mt-1 font-editorial text-xl font-bold text-[#0F172A]">
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
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#DC2626] font-mono-num text-[11px] text-white">
                        0{idx + 1}
                      </span>
                      {item.judul}
                    </span>
                    <span className="rounded bg-red-50 px-2 py-0.5 font-mono-num text-[10px] font-semibold text-[#991B1B]">
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

      {/* FOOTER RATA PENUH BAWAH (GROUNDED CRIMSON EDITORIAL) */}
      <footer className="mt-12 w-full border-t border-red-300/25 bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#B91C1C] text-white">
        <div
          aria-hidden="true"
          className="h-0.5 w-full bg-gradient-to-r from-red-400/10 via-red-200/45 to-red-400/10"
        />

        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6">
          <div className="grid items-start gap-8 md:grid-cols-12">
            {/* Kiri: Wordmark & Identitas Instansi */}
            <div className="md:col-span-5 space-y-3">
              <div className="inline-flex items-baseline leading-none">
                <span className="font-editorial text-xl font-bold tracking-tight text-white">NARA</span>
                <span className="font-editorial italic font-semibold text-xl text-red-200 ml-1">AI</span>
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-red-300 ml-1 mb-0.5 shadow-[0_0_8px_rgba(252,165,165,0.9)]"
                />
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-red-100/90">
                Sistem Natural Language Generation berbasis LLM untuk Narasi Laporan Statistik Satu Data Aceh.
              </p>
              <p className="text-[11px] font-medium text-red-100/75">
                UPTD Statistik • Dinas Komunikasi, Informatika dan Persandian Aceh
              </p>
            </div>

            {/* Tengah: Navigasi Cepat & Portal Resmi */}
            <div className="md:col-span-3 space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-200">
                Navigasi & Sumber Data
              </p>
              <div className="flex flex-col items-start gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => pindahHalaman('beranda')}
                  className="font-medium text-red-100/85 transition hover:text-white"
                >
                  Beranda
                </button>
                <button
                  type="button"
                  onClick={() => pindahHalaman('generator')}
                  className="font-medium text-red-100/85 transition hover:text-white"
                >
                  Generator Narasi
                </button>
                <button
                  type="button"
                  onClick={() => setModalArsitekturTerbuka(true)}
                  className="font-medium text-red-100/85 transition hover:text-white"
                >
                  Tentang Sistem
                </button>
                <button
                  type="button"
                  onClick={() => pindahHalaman('profil')}
                  className="font-medium text-red-100/85 transition hover:text-white"
                >
                  Pengembang
                </button>
                <a
                  href="https://satudata.acehprov.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 pt-0.5 font-semibold text-white transition hover:text-red-200 hover:underline"
                >
                  <span>Portal Satu Data Aceh</span>
                  <Icon name="external" className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Kanan: Tautan Media Sosial & GitHub Pengembang */}
            <div className="md:col-span-4 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-200">
                Tautan Pengembang
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {TAUTAN_SOSIAL_PENGEMBANG.map((sosial) => (
                  <a
                    key={sosial.id}
                    href={sosial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={sosial.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-red-50 transition hover:bg-white hover:text-[#8E1118]"
                  >
                    <Icon name={sosial.icon} className="h-3.5 w-3.5" />
                    <span>{sosial.labelSingkat}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-bar Bawah Penuh */}
        <div className="border-t border-white/10 bg-[#450A0A]/40">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-[11px] text-red-100/80 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="font-medium">
              Kuliah Kerja Praktik • S1 Informatika FMIPA Universitas Syiah Kuala
            </p>
            <p className="font-medium text-red-100/90">
              Dikembangkan oleh Dea Zasqia Pasaribu Malau
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
