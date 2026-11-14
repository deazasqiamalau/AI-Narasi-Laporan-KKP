import { useEffect, useState } from 'react'

const NARASI_API_BASE = import.meta.env.VITE_NARASI_API_BASE || ''

const buildApiUrl = (path) => `${NARASI_API_BASE}${path}`

export async function fetchJson(path, options = {}) {
  const response = await fetch(buildApiUrl(path), options)
  let payload = {}

  try {
    payload = await response.json()
  } catch {
    payload = {}
  }

  if (!response.ok) {
    throw new Error(payload.detail || payload.message || 'Permintaan gagal')
  }

  return payload
}

export function Icon({ name, className = 'h-5 w-5' }) {
  const icons = {
    arrowLeft: <path d="M19 12H5m6 6-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />,
    arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />,
    document: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6M8 13h8M8 17h5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />,
    sparkle: <path d="m12 3-1.6 5.4L5 10l5.4 1.6L12 17l1.6-5.4L19 10l-5.4-1.6zM19 16l-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />,
    info: <><circle cx="12" cy="12" r="9" strokeWidth="1.75" /><path d="M12 11v5m0-8h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />,
    layers: <><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" /><path d="m4 12.5 8 4.5 8-4.5M4 17l8 4.5 8-4.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" /></>,
    check: <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" strokeWidth="1.75" /><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" strokeWidth="1.75" /><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" strokeWidth="1.75" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />,
    cpu: <><rect x="6" y="6" width="12" height="12" rx="2" strokeWidth="1.75" /><path d="M9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 6h3M1 9h3m-3 6h3" strokeLinecap="round" strokeWidth="1.75" /></>,
    filter: <path d="M4 4h16l-6.5 7.5v5.5l-3 2v-7.5L4 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2" strokeWidth="1.75" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeWidth="1.75" /></>,
    download: <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />,
    table: <><rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.75" /><path d="M3 10h18M9 10v10" strokeWidth="1.75" /></>,
    refresh: <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8m0 0V3m0 5h5m-5 4a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16m0 0v5m0-5h-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />,
    search: <><circle cx="11" cy="11" r="7" strokeWidth="1.75" /><path d="m20 20-3.5-3.5" strokeLinecap="round" strokeWidth="1.75" /></>,
    trash: <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" /><circle cx="12" cy="7" r="4" strokeWidth="1.75" /></>,
  }

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name] || icons.document}
    </svg>
  )
}

const TOPIK_CEPAT = ['Penduduk', 'Pendidikan', 'Kesehatan', 'Ekonomi', 'Kemiskinan']

export default function NarasiLaporanView({
  opsiDataset: propOpsiDataset,
  setOpsiDataset: propSetOpsiDataset,
  memuatDataset: propMemuatDataset,
  sinkronisasi: propSinkronisasi,
  notifikasiSinkron,
  onSinkronkan,
  onBackToBeranda,
}) {
  const [lokalOpsiDataset, setLokalOpsiDataset] = useState([])
  const [lokalMemuatDataset, setLokalMemuatDataset] = useState(propOpsiDataset === undefined)
  const [lokalSinkronisasi, setLokalSinkronisasi] = useState(false)
  const [lokalNotifikasi, setLokalNotifikasi] = useState('')

  const opsiDataset = propOpsiDataset !== undefined ? propOpsiDataset : lokalOpsiDataset
  const setOpsiDataset = propSetOpsiDataset || setLokalOpsiDataset
  const memuatDataset = propMemuatDataset !== undefined ? propMemuatDataset : lokalMemuatDataset
  const sinkronisasi = propSinkronisasi !== undefined ? propSinkronisasi : lokalSinkronisasi
  const pesanSinkron = notifikasiSinkron !== undefined ? notifikasiSinkron : lokalNotifikasi

  const [filterDataset, setFilterDataset] = useState('')
  const [hasilCariServer, setHasilCariServer] = useState(null)
  const [sedangCariServer, setSedangCariServer] = useState(false)
  const [datasetTerpilih, setDatasetTerpilih] = useState([])
  const [tahunPerDataset, setTahunPerDataset] = useState({})
  const [loading, setLoading] = useState(false)
  const [tahapLoading, setTahapLoading] = useState(0)
  const [hasil, setHasil] = useState(null)
  const [error, setError] = useState('')
  const [tabHasil, setTabHasil] = useState('narasi') // 'narasi' | 'tabel'
  const [tabDatasetMentah, setTabDatasetMentah] = useState(0)
  const [statusSalin, setStatusSalin] = useState(false)

  // Jika komponen dijalankan mandiri tanpa props dari App
  useEffect(() => {
    if (propOpsiDataset !== undefined) return
    const controller = new AbortController()
    const muatDataset = async () => {
      try {
        const data = await fetchJson('/dataset', { signal: controller.signal })
        const daftarDataset = Array.isArray(data) ? data : []

        if (!controller.signal.aborted) {
          if (daftarDataset.length) {
            setLokalOpsiDataset(daftarDataset)
            return
          }

          setLokalSinkronisasi(true)
          const hasilSinkron = await fetchJson('/dataset/sinkronkan', {
            method: 'POST',
            signal: controller.signal,
          })
          const datasetSinkron = Array.isArray(hasilSinkron.dataset) ? hasilSinkron.dataset : []
          setLokalOpsiDataset(datasetSinkron)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || 'Tidak dapat memuat daftar dataset.')
          setLokalOpsiDataset([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLokalMemuatDataset(false)
          setLokalSinkronisasi(false)
        }
      }
    }

    muatDataset()
    return () => controller.abort()
  }, [propOpsiDataset])

  // Panggil GET /cari-dataset?kata_kunci=...&limit=100 saat pengguna mencari topik
  useEffect(() => {
    const kata = filterDataset.trim()
    if (!kata) {
      setHasilCariServer(null)
      setSedangCariServer(false)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setSedangCariServer(true)
      try {
        const res = await fetchJson(
          `/cari-dataset?kata_kunci=${encodeURIComponent(kata)}&limit=100`,
          { signal: controller.signal }
        )
        if (!controller.signal.aborted && Array.isArray(res)) {
          setHasilCariServer(res)
        }
      } catch {
        if (!controller.signal.aborted) {
          setHasilCariServer(null)
        }
      } finally {
        if (!controller.signal.aborted) {
          setSedangCariServer(false)
        }
      }
    }, 220)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [filterDataset])

  // Animasi tahapan loading saat menyusun narasi
  useEffect(() => {
    if (!loading) {
      setTahapLoading(0)
      return
    }
    const t1 = setTimeout(() => setTahapLoading(1), 850)
    const t2 = setTimeout(() => setTahapLoading(2), 1850)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [loading])

  const jalankanSinkronisasi = async () => {
    if (onSinkronkan) {
      await onSinkronkan()
      return
    }
    if (sinkronisasi || memuatDataset) return
    setLokalSinkronisasi(true)
    setLokalMemuatDataset(true)
    setLokalNotifikasi('')
    try {
      const hasilSinkron = await fetchJson('/dataset/sinkronkan', { method: 'POST' })
      const datasetSinkron = Array.isArray(hasilSinkron.dataset) ? hasilSinkron.dataset : []
      const total = hasilSinkron.jumlah ?? datasetSinkron.length
      setOpsiDataset(datasetSinkron)
      setLokalNotifikasi(`Berhasil memperbarui ${total.toLocaleString('id-ID')} dataset katalog.`)
      setTimeout(() => setLokalNotifikasi(''), 5000)
    } catch (err) {
      setError(err.message || 'Gagal menyinkronkan katalog.')
    } finally {
      setLokalMemuatDataset(false)
      setLokalSinkronisasi(false)
    }
  }

  const muatTahunDataset = async (uuid) => {
    if (!uuid || tahunPerDataset[uuid]) return
    try {
      const res = await fetchJson(`/tahun-dataset?uuid=${encodeURIComponent(uuid)}`)
      if (Array.isArray(res.tahun) && res.tahun.length) {
        const sorted = [...res.tahun].sort((a, b) => a - b)
        const label = sorted.length > 1 ? `${sorted[0]} - ${sorted[sorted.length - 1]}` : `${sorted[0]}`
        setTahunPerDataset((prev) => ({ ...prev, [uuid]: label }))
      }
    } catch {
      // Abaikan jika tahun belum tersedia untuk dataset tertentu
    }
  }

  const tambahDataset = (dataset) => {
    if (!datasetTerpilih.some((item) => item.uuid === dataset.uuid)) {
      setDatasetTerpilih((previous) => [...previous, dataset])
      muatTahunDataset(dataset.uuid)
    }
    setError('')
  }

  const hapusDataset = (uuid) =>
    setDatasetTerpilih((previous) => previous.filter((dataset) => dataset.uuid !== uuid))

  const hapusSemuaDataset = () => setDatasetTerpilih([])

  // Filter real-time seluruh judul katalog dari GET /dataset digabung dengan GET /cari-dataset?limit=100
  // Tanpa pemotongan .slice(0, 5) sehingga seluruh dataset asli muncul
  const opsiTersaring = (() => {
    const kata = filterDataset.trim().toLocaleLowerCase('id-ID')
    const lokalCocok = opsiDataset.filter((dataset) =>
      (dataset.judul || '').toLocaleLowerCase('id-ID').includes(kata)
    )

    if (!kata || !Array.isArray(hasilCariServer) || !hasilCariServer.length) {
      return lokalCocok
    }

    const gabungan = [...lokalCocok]
    const seen = new Set(gabungan.map((d) => d.uuid))
    hasilCariServer.forEach((d) => {
      if (d?.uuid && d?.judul && !seen.has(d.uuid)) {
        seen.add(d.uuid)
        gabungan.push({ uuid: d.uuid, judul: d.judul })
      }
    })
    return gabungan
  })()

  const buatLaporan = async () => {
    if (!datasetTerpilih.length || loading) return

    setLoading(true)
    setError('')
    setHasil(null)
    setTabHasil('narasi')
    setTabDatasetMentah(0)

    try {
      const params = new URLSearchParams()
      datasetTerpilih.forEach((dataset) => {
        params.append('uuid', dataset.uuid)
        params.append('judul', dataset.judul)
      })
      const data = await fetchJson(`/narasi?${params.toString()}`)

      if (data.pesan) setError(data.pesan)
      if (data.narasi) setHasil(data)
    } catch (err) {
      const message = err.message || 'Tidak dapat terhubung ke server narasi.'
      setError(
        message.includes('fetch')
          ? 'Tidak dapat terhubung ke server narasi. Pastikan backend berjalan di port 8010.'
          : message
      )
    } finally {
      setLoading(false)
    }
  }

  const salinNarasi = async () => {
    if (!hasil?.narasi) return
    const teksLengkap = `${hasil.judul}\n\n${hasil.narasi}`
    try {
      await navigator.clipboard.writeText(teksLengkap)
      setStatusSalin(true)
      setTimeout(() => setStatusSalin(false), 2200)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = teksLengkap
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setStatusSalin(true)
      setTimeout(() => setStatusSalin(false), 2200)
    }
  }

  const unduhTxt = () => {
    if (!hasil?.narasi) return
    const tanggal = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    const daftarJudul = (hasil.dataset || datasetTerpilih)
      .map((d, i) => `${i + 1}. ${d.judul} (UUID: ${d.uuid})`)
      .join('\n')

    const isiTxt = [
      'NARA-AI : SISTEM NARASI LAPORAN STATISTIK SATU DATA ACEH',
      'UPTD Statistik • Dinas Komunikasi, Informatika dan Persandian Aceh',
      '====================================================================',
      '',
      hasil.judul.toUpperCase(),
      `Tanggal Cetak : ${tanggal}`,
      `Validasi Data : 100% Grounded Data (Anti-Halusinasi)`,
      '',
      '--------------------------------------------------------------------',
      '',
      hasil.narasi,
      '',
      '--------------------------------------------------------------------',
      'Dataset Sumber Resmi (Satu Data Aceh):',
      daftarJudul,
    ].join('\n')

    const blob = new Blob([isiTxt], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Narasi-Laporan-Statistik-Aceh-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Persiapan tabel verifikasi data sumber
  const daftarDataMentah = Array.isArray(hasil?.data) ? hasil.data : []
  const datasetMentahAktif = daftarDataMentah[tabDatasetMentah] || daftarDataMentah[0] || null
  const barisMentahAktif = Array.isArray(datasetMentahAktif?.data) ? datasetMentahAktif.data : []

  const kolomTabelMentah = (() => {
    if (!barisMentahAktif.length) return []
    const semuaKunci = []
    barisMentahAktif.forEach((row) => {
      Object.keys(row || {}).forEach((key) => {
        if (!semuaKunci.includes(key)) semuaKunci.push(key)
      })
    })
    const prioritas = ['wilayah', 'tahun']
    return [
      ...prioritas.filter((k) => semuaKunci.includes(k)),
      ...semuaKunci.filter((k) => !prioritas.includes(k)),
    ]
  })()

  const tahapanLoadingText = [
    'Mengekstrak data sumber dan memfilter 24 atribut metadata administratif...',
    'Memvalidasi kepatuhan fakta JSON dan presisi angka (Anti-Halusinasi)...',
    'Menyusun paragraf laporan statistik formal berbasis Large Language Model...',
  ]

  const labelJumlahKatalog = memuatDataset
    ? 'Memuat katalog...'
    : filterDataset.trim()
    ? `${opsiTersaring.length.toLocaleString('id-ID')} dari ${opsiDataset.length.toLocaleString('id-ID')} dataset tersedia`
    : `${opsiDataset.length.toLocaleString('id-ID')} dataset tersedia`

  return (
    <div className="space-y-6">
      {/* Header Ruang Kerja Generator Narasi */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
              <Icon name="sparkle" className="h-3.5 w-3.5" /> Ruang Kerja Generator Narasi
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
              ✓ 100% Grounded Data • Anti-Halusinasi
            </span>
          </div>
          <h1 className="mt-2.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
            Penyusunan Draf Narasi Laporan Statistik Satu Data Aceh
          </h1>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Pilih satu atau beberapa dataset pada katalog di panel kiri untuk disintesis menjadi laporan formal di panel
            kanan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onBackToBeranda && (
            <button
              type="button"
              onClick={onBackToBeranda}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-[#DC2626]"
            >
              <Icon name="arrowLeft" className="h-4 w-4" /> Kembali ke Beranda
            </button>
          )}
          <button
            type="button"
            onClick={jalankanSinkronisasi}
            disabled={sinkronisasi || memuatDataset}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-[#DC2626] transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="refresh" className={`h-4 w-4 ${sinkronisasi ? 'animate-spin' : ''}`} />
            {sinkronisasi ? 'Menyinkronkan...' : 'Sinkronkan Katalog'}
          </button>
        </div>
      </div>

      {pesanSinkron && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <Icon name="check" className="h-4 w-4 text-emerald-600" />
          <span>{pesanSinkron}</span>
        </div>
      )}

      {/* Split 2 Kolom Proporsional (40% Kiri / 60% Kanan) */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* PANEL KIRI (40% Lebar / 5 Kolom): Kontrol & Pemilihan Dataset */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
                  Panel Katalog Satu Data Aceh
                </span>
                <h2 className="mt-0.5 text-lg font-bold text-slate-900">Pilih & Cari Dataset</h2>
              </div>
              <span className="rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-bold text-[#DC2626]">
                {labelJumlahKatalog}
              </span>
            </div>

            {/* Input Pencarian Real-Time */}
            <div className="mt-4">
              <label className="block">
                <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Pencarian Real-Time Judul Dataset</span>
                  {sedangCariServer && (
                    <span className="text-[11px] font-medium text-[#DC2626]">Mencari di server...</span>
                  )}
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="search" className="h-4 w-4" />
                  </span>
                  <input
                    type="search"
                    value={filterDataset}
                    onChange={(e) => setFilterDataset(e.target.value)}
                    placeholder="Ketik topik atau judul dataset (misal: penduduk, pendidikan)..."
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-10 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#DC2626] focus:bg-[#FFFFFF]"
                  />
                  {filterDataset && (
                    <button
                      type="button"
                      onClick={() => setFilterDataset('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg bg-slate-200/80 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-300"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </label>

              {/* Quick-Filter Pills */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {TOPIK_CEPAT.map((topik) => {
                  const aktif = filterDataset.trim().toLowerCase() === topik.toLowerCase()
                  return (
                    <button
                      key={topik}
                      type="button"
                      onClick={() => setFilterDataset(aktif ? '' : topik)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                        aktif
                          ? 'border-[#DC2626] bg-[#DC2626] text-white'
                          : 'border-[#E2E8F0] bg-[#FFFFFF] text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-[#DC2626]'
                      }`}
                    >
                      {topik}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Daftar Katalog Scrollable (Menampilkan Seluruh Dataset Asli Tanpa Pemotongan) */}
            <div className="mt-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#FFFFFF]">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5">
                <span className="text-xs font-bold text-slate-700">Daftar Katalog Dataset</span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {memuatDataset
                    ? 'Memuat data...'
                    : `Menampilkan ${opsiTersaring.length.toLocaleString('id-ID')} dataset`}
                </span>
              </div>

              {memuatDataset ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Sedang memuat seluruh katalog dataset dari Satu Data Aceh & Supabase...
                </div>
              ) : opsiTersaring.length > 0 ? (
                <div className="custom-scrollbar max-h-96 divide-y divide-[#E2E8F0] overflow-y-auto">
                  {opsiTersaring.map((dataset, idx) => {
                    const sudahDipilih = datasetTerpilih.some((item) => item.uuid === dataset.uuid)
                    return (
                      <div
                        key={dataset.uuid}
                        className={`flex items-center justify-between gap-3 px-3.5 py-3 transition ${
                          sudahDipilih ? 'bg-red-50/40' : 'hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold leading-relaxed text-slate-800">
                            <span className="mr-1.5 font-mono text-[11px] text-slate-400">{idx + 1}.</span>
                            {dataset.judul}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => tambahDataset(dataset)}
                          disabled={sudahDipilih}
                          className={`inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
                            sudahDipilih
                              ? 'cursor-default border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#DC2626] hover:border-[#DC2626] hover:bg-[#DC2626] hover:text-white'
                          }`}
                        >
                          {sudahDipilih ? (
                            <>
                              <Icon name="check" className="h-3.5 w-3.5" /> Terpilih
                            </>
                          ) : (
                            <>+ Tambah</>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  Tidak ditemukan dataset untuk kata kunci <strong>&ldquo;{filterDataset}&rdquo;</strong>.
                </div>
              )}
            </div>

            {/* Kotak Dataset Terpilih */}
            <div className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#DC2626] text-xs font-bold text-white">
                    {datasetTerpilih.length}
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Dataset Terpilih</h3>
                </div>
                {datasetTerpilih.length > 0 && (
                  <button
                    type="button"
                    onClick={hapusSemuaDataset}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-[#DC2626]"
                  >
                    <Icon name="trash" className="h-3.5 w-3.5" /> Hapus Semua
                  </button>
                )}
              </div>

              {datasetTerpilih.length > 0 ? (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {datasetTerpilih.map((dataset) => (
                    <div
                      key={dataset.uuid}
                      className="flex items-start justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-2.5 shadow-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 leading-snug">{dataset.judul}</p>
                        {tahunPerDataset[dataset.uuid] && (
                          <span className="mt-1 inline-block rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-[#DC2626]">
                            Periode: {tahunPerDataset[dataset.uuid]}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => hapusDataset(dataset.uuid)}
                        aria-label={`Hapus ${dataset.judul}`}
                        className="rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-[#DC2626]"
                      >
                        <Icon name="close" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">
                  Belum ada dataset yang dipilih. Klik tombol <strong>+ Tambah</strong> pada daftar katalog di atas
                  (mendukung penggabungan 1 atau beberapa dataset sekaligus).
                </p>
              )}
            </div>

            {/* Tombol Generate Narasi Laporan */}
            <button
              type="button"
              onClick={buatLaporan}
              disabled={!datasetTerpilih.length || loading}
              className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#DC2626] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Icon name="sparkle" className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>
                {loading
                  ? 'Sedang Menyusun Narasi Laporan...'
                  : datasetTerpilih.length > 0
                  ? `Generate Narasi Laporan (${datasetTerpilih.length} Dataset)`
                  : 'Generate Narasi Laporan'}
              </span>
            </button>

            {error && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs leading-relaxed text-red-800">
                <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-[#DC2626]" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* PANEL KANAN (60% Lebar / 7 Kolom): Hasil Narasi & Bukti Anti-Halusinasi */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm overflow-hidden">
            {/* Header Kartu dengan 2 Tab Bersih */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
              <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-1">
                <button
                  type="button"
                  onClick={() => setTabHasil('narasi')}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                    tabHasil === 'narasi'
                      ? 'bg-[#DC2626] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon name="document" className="h-3.5 w-3.5" />
                  Draf Narasi Laporan
                </button>
                <button
                  type="button"
                  onClick={() => setTabHasil('tabel')}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                    tabHasil === 'tabel'
                      ? 'bg-[#DC2626] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon name="table" className="h-3.5 w-3.5" />
                  Verifikasi Data Sumber (Tabel)
                  {daftarDataMentah.length > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        tabHasil === 'tabel' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      Grounded
                    </span>
                  )}
                </button>
              </div>

              {hasil && !loading && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={salinNarasi}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition ${
                      statusSalin
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-[#E2E8F0] bg-[#FFFFFF] text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-[#DC2626]'
                    }`}
                  >
                    <Icon name={statusSalin ? 'check' : 'copy'} className="h-3.5 w-3.5" />
                    {statusSalin ? 'Tersalin!' : 'Salin Teks'}
                  </button>
                  <button
                    type="button"
                    onClick={unduhTxt}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                  >
                    <Icon name="download" className="h-3.5 w-3.5" />
                    Unduh (.txt)
                  </button>
                </div>
              )}
            </div>

            {/* Body Panel Kanan */}
            <div className="p-6 md:p-8">
              {loading ? (
                <div className="py-10">
                  <div className="mx-auto max-w-md text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#DC2626]">
                      <Icon name="sparkle" className="h-6 w-6 animate-spin" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-slate-900">
                      Menyusun Narasi Laporan Statistik...
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Memproses {datasetTerpilih.length} dataset resmi Satu Data Aceh
                    </p>
                  </div>

                  <div className="mt-8 space-y-3 max-w-lg mx-auto">
                    {tahapanLoadingText.map((teks, idx) => {
                      const selesai = tahapLoading > idx
                      const aktif = tahapLoading === idx
                      return (
                        <div
                          key={teks}
                          className={`flex items-center gap-3 rounded-xl border p-3.5 text-xs transition ${
                            aktif
                              ? 'border-red-200 bg-red-50/60 font-semibold text-slate-900'
                              : selesai
                              ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                              : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-400'
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                              selesai ? 'bg-emerald-600' : aktif ? 'bg-[#DC2626] animate-pulse' : 'bg-slate-300'
                            }`}
                          >
                            {selesai ? '✓' : idx + 1}
                          </span>
                          <span>{teks}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : !hasil ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC]/60 px-6 py-16 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] text-slate-400 shadow-sm">
                    <Icon name="document" className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-800">
                    Belum Ada Draf Narasi yang Dihasilkan
                  </h3>
                  <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-500">
                    Pilih satu atau beberapa dataset pada panel kiri, lalu klik tombol{' '}
                    <strong className="text-slate-700">Generate Narasi Laporan</strong>. Hasil narasi formal beserta
                    tabel verifikasi data mentah akan ditampilkan di sini.
                  </p>
                </div>
              ) : tabHasil === 'narasi' ? (
                /* TAB 1: DRAF NARASI LAPORAN */
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        ✓ 100% Grounded Data • Anti-Halusinasi
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-slate-900 leading-snug">{hasil.judul}</h3>
                    </div>
                  </div>

                  <article className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/50 p-6 whitespace-pre-line text-[15px] leading-8 text-slate-800 text-justify">
                    {hasil.narasi}
                  </article>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4 text-xs text-slate-500">
                    <span>Sumber Data: Portal Satu Data Aceh • UPTD Statistik Diskominsa Aceh</span>
                    <button
                      type="button"
                      onClick={() => setTabHasil('tabel')}
                      className="font-bold text-[#DC2626] hover:underline"
                    >
                      Lihat Bukti Data Mentah (Tabel) →
                    </button>
                  </div>
                </div>
              ) : (
                /* TAB 2: VERIFIKASI DATA SUMBER (TABEL) */
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        ✓ Bukti Validasi Anti-Halusinasi
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-slate-900">
                        Tabel Indikator Sumber (Respons JSON <code className="text-[#DC2626]">/narasi</code>)
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Seluruh angka pada draf narasi bersumber langsung dari nilai indikator pada tabel di bawah ini
                        tanpa pembulatan.
                      </p>
                    </div>
                  </div>

                  {daftarDataMentah.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {daftarDataMentah.map((ds, idx) => (
                        <button
                          key={ds.uuid}
                          type="button"
                          onClick={() => setTabDatasetMentah(idx)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                            tabDatasetMentah === idx
                              ? 'border-[#DC2626] bg-[#DC2626] text-white'
                              : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-600 hover:border-red-200 hover:text-[#DC2626]'
                          }`}
                        >
                          Dataset #{idx + 1}: {ds.judul.length > 42 ? `${ds.judul.slice(0, 42)}...` : ds.judul}
                        </button>
                      ))}
                    </div>
                  )}

                  {datasetMentahAktif && (
                    <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800 truncate pr-3">{datasetMentahAktif.judul}</span>
                      <span className="shrink-0 font-bold text-[#DC2626]">{barisMentahAktif.length} baris</span>
                    </div>
                  )}

                  <div className="custom-scrollbar max-h-96 overflow-auto rounded-xl border border-[#E2E8F0]">
                    <table className="min-w-full divide-y divide-[#E2E8F0] text-left text-xs">
                      <thead className="bg-[#F8FAFC] sticky top-0">
                        <tr>
                          <th className="px-3.5 py-3 font-bold uppercase tracking-wider text-slate-500">No</th>
                          {kolomTabelMentah.map((kolom) => (
                            <th
                              key={kolom}
                              className="px-3.5 py-3 font-bold uppercase tracking-wider text-slate-700"
                            >
                              {kolom.replace(/_/g, ' ')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] bg-[#FFFFFF]">
                        {barisMentahAktif.map((baris, idx) => (
                          <tr key={idx} className="hover:bg-[#F8FAFC]">
                            <td className="px-3.5 py-2.5 font-mono text-slate-400">{idx + 1}</td>
                            {kolomTabelMentah.map((kolom) => {
                              const nilai = baris[kolom]
                              const isNumeric = typeof nilai === 'number'
                              return (
                                <td
                                  key={kolom}
                                  className={`px-3.5 py-2.5 ${
                                    isNumeric
                                      ? 'font-mono font-bold text-[#DC2626]'
                                      : kolom === 'wilayah'
                                      ? 'font-semibold text-slate-800'
                                      : 'text-slate-600'
                                  }`}
                                >
                                  {nilai !== undefined && nilai !== null ? String(nilai) : '-'}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
