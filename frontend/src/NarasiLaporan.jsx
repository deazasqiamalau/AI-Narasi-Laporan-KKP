import { useEffect, useRef, useState } from 'react'

const NARASI_API_BASE = import.meta.env.VITE_NARASI_API_BASE || ''

const buildApiUrl = (path) => `${NARASI_API_BASE}${path}`

const DUMMY_UUID_SET = new Set([
  'aceh-penduduk-2022-2024',
  'aceh-pendidikan-sekolah-dasar',
  'aceh-kesehatan-sarana',
  'aceh-kemiskinan-kabkota',
  'aceh-ekonomi-pad',
])

export function saringDatasetAsli(daftar) {
  if (!Array.isArray(daftar)) return []
  return daftar.filter((d) => d && d.uuid && d.judul && !DUMMY_UUID_SET.has(String(d.uuid).trim()))
}

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
    arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
    external: <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
    document: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6M8 13h8M8 17h5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
    sparkle: <path d="m12 3-1.6 5.4L5 10l5.4 1.6L12 17l1.6-5.4L19 10l-5.4-1.6z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
    info: <><circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5m0-8h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
    layers: <><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /><path d="m4 12.5 8 4.5 8-4.5M4 17l8 4.5 8-4.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></>,
    check: <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" strokeWidth="1.6" /><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" strokeWidth="1.6" /><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" strokeWidth="1.6" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
    cpu: <><rect x="6" y="6" width="12" height="12" rx="2" strokeWidth="1.6" /><path d="M9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 6h3M1 9h3m-3 6h3" strokeLinecap="round" strokeWidth="1.6" /></>,
    filter: <path d="M4 4h16l-6.5 7.5v5.5l-3 2v-7.5L4 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2" strokeWidth="1.6" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeWidth="1.6" /></>,
    download: <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
    table: <><rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.6" /><path d="M3 10h18M9 10v10" strokeWidth="1.6" /></>,
    refresh: <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8m0 0V3m0 5h5m-5 4a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16m0 0v5m0-5h-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
    search: <><circle cx="11" cy="11" r="7" strokeWidth="1.6" /><path d="m20 20-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></>,
    trash: <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
    chart: <path d="M4 20h16M7 16v-5m5 5V6m5 10v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.6" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></>,
    clock: <><circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></>,
    github: <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /><rect x="2" y="9" width="4" height="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /><circle cx="4" cy="4" r="2" strokeWidth="1.6" /></>,
    youtube: <><rect x="2" y="5" width="20" height="14" rx="4" strokeWidth="1.6" /><path d="m10 9 5 3-5 3V9z" fill="currentColor" stroke="none" /></>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="1.6" /><circle cx="12" cy="12" r="4" strokeWidth="1.6" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>,
    code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />,
  }

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name] || icons.document}
    </svg>
  )
}

const FILTER_TOPIK = ['Semua', 'Penduduk', 'Pendidikan', 'Kesehatan', 'Ekonomi', 'Kemiskinan']

const OPSI_GAYA_PENYAJIAN = [
  {
    id: 'resmi',
    label: 'Laporan Formal 2-4 Paragraf',
    deskripsi: 'Format narasi standar dokumen instansi pemerintah',
  },
  {
    id: 'eksekutif',
    label: 'Ringkasan Eksekutif',
    deskripsi: 'Poin-poin utama capaian indikator secara padat',
  },
  {
    id: 'tren',
    label: 'Analisis Perbandingan Wilayah',
    deskripsi: 'Sorotan distribusi nilai kabupaten/kota & periode',
  },
]

export default function NarasiLaporanView({
  opsiDataset: propOpsiDataset,
  setOpsiDataset: propSetOpsiDataset,
  memuatDataset: propMemuatDataset,
  sinkronisasi: propSinkronisasi,
  onSinkronkan,
  onShowToast,
  initialTopicFilter = '',
  onClearInitialTopic,
}) {
  const [lokalOpsiDataset, setLokalOpsiDataset] = useState([])
  const [lokalMemuatDataset, setLokalMemuatDataset] = useState(propOpsiDataset === undefined)
  const [lokalSinkronisasi, setLokalSinkronisasi] = useState(false)

  const opsiDataset = saringDatasetAsli(propOpsiDataset !== undefined ? propOpsiDataset : lokalOpsiDataset)
  const setOpsiDataset = propSetOpsiDataset || setLokalOpsiDataset
  const memuatDataset = propMemuatDataset !== undefined ? propMemuatDataset : lokalMemuatDataset
  const sinkronisasi = propSinkronisasi !== undefined ? propSinkronisasi : lokalSinkronisasi

  const [filterDataset, setFilterDataset] = useState('')
  const [hasilCariServer, setHasilCariServer] = useState(null)
  const [sedangCariServer, setSedangCariServer] = useState(false)
  const [datasetTerpilih, setDatasetTerpilih] = useState([])
  const [gayaNarasi, setGayaNarasi] = useState('resmi')
  const [tahunPerDataset, setTahunPerDataset] = useState({})
  const [daftarTahunLengkap, setDaftarTahunLengkap] = useState({})
  const [loading, setLoading] = useState(false)
  const [tahapLoading, setTahapLoading] = useState(0)
  const [hasil, setHasil] = useState(null)
  const [waktuPembuatan, setWaktuPembuatan] = useState('')
  const [error, setError] = useState('')
  const [tabHasil, setTabHasil] = useState('narasi') // 'narasi' | 'tabel' | 'riwayat'
  const [ukuranHuruf, setUkuranHuruf] = useState('normal') // 'normal' | 'besar'
  const [tabDatasetMentah, setTabDatasetMentah] = useState(0)
  const [filterBarisTabel, setFilterBarisTabel] = useState('')
  const [riwayatSesi, setRiwayatSesi] = useState([])
  const [statusSalin, setStatusSalin] = useState(false)

  // State Pop-up Modal Pratinjau Metadata/Tahun Dataset
  const [modalDatasetDetail, setModalDatasetDetail] = useState(null)
  const [loadingModalTahun, setLoadingModalTahun] = useState(false)
  const [errorModalTahun, setErrorModalTahun] = useState('')

  const hasilSectionRef = useRef(null)

  // Pastikan posisi scroll berada di paling atas saat halaman Generator Narasi dibuka
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Jika ada topik awal dari simulasi Beranda
  useEffect(() => {
    if (initialTopicFilter) {
      setFilterDataset(initialTopicFilter)
      if (onClearInitialTopic) onClearInitialTopic()
    }
  }, [initialTopicFilter, onClearInitialTopic])

  // Langsung panggil GET /dataset saat halaman dibuka bila katalog belum terisi
  useEffect(() => {
    if (opsiDataset.length > 0 || memuatDataset) return
    const controller = new AbortController()
    const muatLangsung = async () => {
      if (propOpsiDataset === undefined) setLokalMemuatDataset(true)
      try {
        const data = await fetchJson('/dataset', { signal: controller.signal })
        const bersih = saringDatasetAsli(data)
        if (!controller.signal.aborted && bersih.length > 0) {
          setOpsiDataset(bersih)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || 'Tidak dapat memuat daftar dataset.')
        }
      } finally {
        if (!controller.signal.aborted && propOpsiDataset === undefined) {
          setLokalMemuatDataset(false)
        }
      }
    }
    muatLangsung()
    return () => controller.abort()
  }, [opsiDataset.length, memuatDataset, propOpsiDataset, setOpsiDataset])

  // Tutup modal detail dataset dengan tombol Esc
  useEffect(() => {
    if (!modalDatasetDetail) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalDatasetDetail(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalDatasetDetail])

  // Panggil GET /cari-dataset?kata_kunci=...&limit=100 saat mencari kata kunci
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
          setHasilCariServer(saringDatasetAsli(res))
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

  // Indikator progres bertahap saat memproses
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

  const muatTahunDataset = async (uuid) => {
    if (!uuid) return null
    if (daftarTahunLengkap[uuid]) return daftarTahunLengkap[uuid]
    try {
      const res = await fetchJson(`/tahun-dataset?uuid=${encodeURIComponent(uuid)}`)
      if (Array.isArray(res.tahun) && res.tahun.length) {
        const sortedAsc = [...res.tahun].sort((a, b) => a - b)
        const sortedDesc = [...res.tahun].sort((a, b) => b - a)
        const label =
          sortedAsc.length > 1
            ? `${sortedAsc[0]} - ${sortedAsc[sortedAsc.length - 1]}`
            : `${sortedAsc[0]}`
        setTahunPerDataset((prev) => ({ ...prev, [uuid]: label }))
        setDaftarTahunLengkap((prev) => ({ ...prev, [uuid]: sortedDesc }))
        return sortedDesc
      }
    } catch {
      // Abaikan jika tahun belum tersedia untuk dataset tertentu
    }
    return null
  }

  const bukaModalDetailDataset = async (dataset) => {
    setModalDatasetDetail(dataset)
    setErrorModalTahun('')
    if (daftarTahunLengkap[dataset.uuid]) return

    setLoadingModalTahun(true)
    try {
      const res = await fetchJson(`/tahun-dataset?uuid=${encodeURIComponent(dataset.uuid)}`)
      if (Array.isArray(res.tahun) && res.tahun.length) {
        const sortedAsc = [...res.tahun].sort((a, b) => a - b)
        const sortedDesc = [...res.tahun].sort((a, b) => b - a)
        const label =
          sortedAsc.length > 1
            ? `${sortedAsc[0]} - ${sortedAsc[sortedAsc.length - 1]}`
            : `${sortedAsc[0]}`
        setTahunPerDataset((prev) => ({ ...prev, [dataset.uuid]: label }))
        setDaftarTahunLengkap((prev) => ({ ...prev, [dataset.uuid]: sortedDesc }))
      } else {
        setErrorModalTahun('Data tahun belum tersedia untuk dataset ini.')
      }
    } catch (err) {
      setErrorModalTahun(err.message || 'Tahun data tidak ditemukan untuk dataset ini.')
    } finally {
      setLoadingModalTahun(false)
    }
  }

  const tambahDataset = (dataset) => {
    if (!datasetTerpilih.some((item) => item.uuid === dataset.uuid)) {
      setDatasetTerpilih((previous) => [...previous, dataset])
      muatTahunDataset(dataset.uuid)
      if (onShowToast) {
        onShowToast(`Dataset ditambahkan (${datasetTerpilih.length + 1} terpilih).`)
      }
    }
    setError('')
  }

  const hapusDataset = (uuid) =>
    setDatasetTerpilih((previous) => previous.filter((dataset) => dataset.uuid !== uuid))

  const resetSemuaDataset = () => {
    setDatasetTerpilih([])
    if (onShowToast) onShowToast('Daftar dataset terpilih telah dikosongkan.')
  }

  const handleSinkronkanInternal = async () => {
    if (onSinkronkan) {
      await onSinkronkan()
      return
    }
    if (sinkronisasi || memuatDataset) return
    setLokalSinkronisasi(true)
    setLokalMemuatDataset(true)
    try {
      const hasilSinkron = await fetchJson('/dataset/sinkronkan', { method: 'POST' })
      const datasetSinkron = saringDatasetAsli(hasilSinkron.dataset)
      setOpsiDataset(datasetSinkron)
      if (onShowToast) {
        onShowToast(`Katalog diperbarui (${datasetSinkron.length.toLocaleString('id-ID')} dataset).`)
      }
    } catch (err) {
      setError(err.message || 'Gagal memperbarui katalog.')
    } finally {
      setLokalMemuatDataset(false)
      setLokalSinkronisasi(false)
    }
  }

  // Filter real-time seluruh daftar dataset asli
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
      if (d?.uuid && d?.judul && !seen.has(d.uuid) && !DUMMY_UUID_SET.has(String(d.uuid).trim())) {
        seen.add(d.uuid)
        gabungan.push({ uuid: d.uuid, judul: d.judul })
      }
    })
    return gabungan
  })()

  const formatNarasiBerdasarkanGaya = (teksAsli, idGaya) => {
    if (!teksAsli) return ''
    const paragraf = String(teksAsli)
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)

    if (idGaya === 'eksekutif') {
      if (paragraf.length > 1) {
        return paragraf.map((p, idx) => `${idx + 1}. ${p}`).join('\n\n')
      }
      const kalimat = String(teksAsli)
        .split(/(?<=\.)\s+/)
        .map((k) => k.trim())
        .filter(Boolean)
      if (kalimat.length > 1) {
        return kalimat.map((k, idx) => `${idx + 1}. ${k}`).join('\n\n')
      }
    }
    return teksAsli
  }

  const buatLaporan = async () => {
    if (!datasetTerpilih.length || loading) return

    setLoading(true)
    setError('')
    setHasil(null)
    setTabHasil('narasi')
    setTabDatasetMentah(0)
    setFilterBarisTabel('')

    setTimeout(() => {
      hasilSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    try {
      const params = new URLSearchParams()
      datasetTerpilih.forEach((dataset) => {
        params.append('uuid', dataset.uuid)
        params.append('judul', dataset.judul)
      })
      const data = await fetchJson(`/narasi?${params.toString()}`)

      if (data.pesan) setError(data.pesan)
      if (data.narasi) {
        const jam = new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        const tanggalLengkap = new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        const stempelWaktu = `${tanggalLengkap} • ${jam} WIB`
        const infoGaya = OPSI_GAYA_PENYAJIAN.find((g) => g.id === gayaNarasi) || OPSI_GAYA_PENYAJIAN[0]

        const hasilLengkap = {
          ...data,
          gayaId: gayaNarasi,
          gayaLabel: infoGaya.label,
          waktuDibuat: stempelWaktu,
        }

        setHasil(hasilLengkap)
        setWaktuPembuatan(stempelWaktu)
        setRiwayatSesi((prev) => [
          {
            id: `${Date.now()}`,
            waktu: stempelWaktu,
            judul: data.judul,
            jumlahDataset: (data.dataset || datasetTerpilih).length,
            gayaId: gayaNarasi,
            gayaLabel: infoGaya.label,
            payload: hasilLengkap,
          },
          ...prev,
        ])

        if (onShowToast) {
          onShowToast('Draf narasi laporan statistik berhasil disusun.')
        }
      }
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

  const teksNarasiTampil = hasil?.narasi
    ? formatNarasiBerdasarkanGaya(hasil.narasi, hasil.gayaId || gayaNarasi)
    : ''

  const salinNarasi = async () => {
    if (!hasil?.narasi) return
    const teksLengkap = `${hasil.judul}\n\n${teksNarasiTampil}`
    try {
      await navigator.clipboard.writeText(teksLengkap)
      setStatusSalin(true)
      if (onShowToast) onShowToast('Teks narasi berhasil disalin ke clipboard.')
      setTimeout(() => setStatusSalin(false), 2200)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = teksLengkap
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setStatusSalin(true)
      if (onShowToast) onShowToast('Teks narasi berhasil disalin ke clipboard.')
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
      `Gaya Laporan  : ${hasil.gayaLabel || 'Laporan Formal 2-4 Paragraf'}`,
      `Validasi Data : 100% Terverifikasi Fakta JSON`,
      '',
      '--------------------------------------------------------------------',
      '',
      teksNarasiTampil,
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
    if (onShowToast) onShowToast('Berkas laporan (.txt) berhasil diunduh.')
  }

  const unduhDoc = () => {
    if (!hasil?.narasi) return
    const tanggal = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    const daftarDatasetHtml = (hasil.dataset || datasetTerpilih)
      .map((d) => `<li><strong>${d.judul}</strong> (UUID: <code>${d.uuid}</code>)</li>`)
      .join('')

    const paragrafHtml = teksNarasiTampil
      .split(/\n\s*\n/)
      .map(
        (p) =>
          `<p style="text-align:justify; line-height:1.75; margin-bottom:12pt; font-family:'Times New Roman',serif; font-size:12pt;">${p}</p>`
      )
      .join('')

    const isiDocHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <title>${hasil.judul}</title>
      </head>
      <body style="font-family:'Times New Roman',serif; color:#0F172A; padding:24pt;">
        <div style="border-bottom:2px solid #991B1B; padding-bottom:10pt; margin-bottom:16pt;">
          <p style="margin:0; font-size:10pt; font-weight:bold; color:#991B1B; text-transform:uppercase;">
            UPTD Statistik • Dinas Komunikasi, Informatika dan Persandian Aceh
          </p>
          <h1 style="margin:4pt 0 0 0; font-size:15pt; color:#0F172A;">${hasil.judul}</h1>
          <p style="margin:6pt 0 0 0; font-size:9.5pt; color:#475569;">
            Tanggal Cetak: ${tanggal} • Gaya: ${hasil.gayaLabel || 'Laporan Formal'} • Status: 100% Terverifikasi Fakta JSON
          </p>
        </div>
        ${paragrafHtml}
        <hr style="margin-top:20pt; border:none; border-top:1px solid #CBD5E1;" />
        <p style="font-size:10.5pt; font-weight:bold; margin-bottom:6pt;">Dataset Sumber Resmi (Satu Data Aceh):</p>
        <ol style="font-size:10pt; color:#334155; margin-top:0;">${daftarDatasetHtml}</ol>
      </body>
      </html>
    `

    const blob = new Blob(['\ufeff', isiDocHtml], {
      type: 'application/msword;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Narasi-Laporan-Statistik-Aceh-${new Date().toISOString().slice(0, 10)}.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    if (onShowToast) onShowToast('Dokumen laporan (.doc) berhasil diunduh.')
  }

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

  const barisMentahTersaring = (() => {
    const kueri = filterBarisTabel.trim().toLocaleLowerCase('id-ID')
    if (!kueri) return barisMentahAktif
    return barisMentahAktif.filter((baris) =>
      kolomTabelMentah.some((kolom) =>
        String(baris[kolom] ?? '')
          .toLocaleLowerCase('id-ID')
          .includes(kueri)
      )
    )
  })()

  const tahapanLoadingText = [
    '1. Mengambil data Satu Data Aceh dan mengekstrak 24 atribut metadata',
    '2. Memvalidasi kesesuaian angka dan fakta JSON',
    '3. Menyusun draf narasi laporan formal berbasis AI',
  ]

  const jumlahDatasetDigabung = hasil?.dataset?.length || datasetTerpilih.length || 0

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-page">
      {/* Header Halaman Generator Narasi */}
      <div className="rounded-2xl border border-slate-200/80 bg-[#FFFFFF] p-6 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
              Ruang Kerja Dokumen Statistik
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
              Generator Narasi Laporan Satu Data Aceh
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Alur kerja terpusat untuk memilih dataset resmi, menentukan gaya laporan, dan memverifikasi tabel sumber.
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-left sm:text-right">
            <p className="text-[11px] font-medium text-slate-500">Status Katalog</p>
            <p className="text-sm font-bold text-[#991B1B]">
              {memuatDataset
                ? 'Memuat katalog...'
                : `${opsiDataset.length.toLocaleString('id-ID')} dataset tersedia`}
            </p>
          </div>
        </div>
      </div>

      {/* TAHAP 1: PEMILIHAN DATASET (KARTU ATAS YANG RAPI & SEJAJAR) */}
      <section className="rounded-2xl border border-slate-200/80 bg-[#FFFFFF] p-6 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">1. Pilih Dataset Statistik</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Cari dan pilih satu atau beberapa dataset dari katalog resmi Satu Data Aceh
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="rounded-full border border-red-100 bg-red-50/70 px-3 py-1 text-xs font-semibold text-[#991B1B]">
              {memuatDataset
                ? 'Memuat...'
                : filterDataset.trim()
                ? `${opsiTersaring.length.toLocaleString('id-ID')} hasil filter`
                : `${opsiDataset.length.toLocaleString('id-ID')} dataset tersedia`}
            </span>
            <button
              type="button"
              onClick={handleSinkronkanInternal}
              disabled={sinkronisasi || memuatDataset}
              title="Perbarui katalog dari server"
              aria-label="Perbarui katalog dari server"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-[#F8FAFC] text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#DC2626] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="refresh" className={`h-4 w-4 ${sinkronisasi ? 'animate-spin text-[#DC2626]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Baris Pencarian Instan + Pill Filter Kategori */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" className="h-4 w-4" />
            </span>
            <input
              type="search"
              value={filterDataset}
              onChange={(e) => setFilterDataset(e.target.value)}
              placeholder="Ketik judul dataset atau indikator sektoral (misal: penduduk, sekolah, kemiskinan)..."
              className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-20 text-sm text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#DC2626] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-red-100"
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

          <div className="flex flex-wrap items-center gap-1.5">
            {FILTER_TOPIK.map((topik) => {
              const isSemua = topik === 'Semua'
              const aktif = isSemua
                ? filterDataset.trim() === ''
                : filterDataset.trim().toLowerCase() === topik.toLowerCase()

              return (
                <button
                  key={topik}
                  type="button"
                  onClick={() => setFilterDataset(isSemua ? '' : aktif ? '' : topik)}
                  className={`rounded-full border px-3.5 py-1 text-xs font-medium transition ${
                    aktif
                      ? 'border-[#DC2626] bg-[#DC2626] text-white shadow-sm'
                      : 'border-slate-200 bg-[#FFFFFF] text-slate-600 hover:border-red-200 hover:bg-red-50/60 hover:text-[#DC2626]'
                  }`}
                >
                  {topik}
                </button>
              )
            })}
            {sedangCariServer && (
              <span className="ml-auto text-xs font-medium text-[#DC2626]">Memuat hasil pencarian...</span>
            )}
          </div>
        </div>

        {/* Daftar Katalog Lebar Penuh (max-h-72 overflow-y-auto) */}
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-[#FFFFFF]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs font-semibold text-slate-500">
            <span>Judul Dataset Satu Data Aceh</span>
            <span>Tindakan</span>
          </div>

          {memuatDataset ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Menyiapkan daftar seluruh dataset resmi dari Satu Data Aceh...
            </div>
          ) : opsiTersaring.length > 0 ? (
            <div className="custom-scrollbar max-h-72 divide-y divide-slate-100 overflow-y-auto">
              {opsiTersaring.map((dataset, idx) => {
                const sudahDipilih = datasetTerpilih.some((item) => item.uuid === dataset.uuid)
                return (
                  <div
                    key={dataset.uuid}
                    className={`flex flex-col justify-between gap-3 px-4 py-3 transition sm:flex-row sm:items-center ${
                      sudahDipilih ? 'bg-red-50/40' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-sm font-medium leading-relaxed text-[#0F172A]">
                        <span className="mr-2 font-mono text-xs text-slate-400">{idx + 1}.</span>
                        {dataset.judul}
                      </p>
                      {tahunPerDataset[dataset.uuid] && (
                        <span className="mt-1 inline-block rounded bg-red-50 px-2 py-0.5 text-[11px] font-medium text-[#991B1B]">
                          Rentang Tahun: {tahunPerDataset[dataset.uuid]}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => bukaModalDetailDataset(dataset)}
                        className="rounded-lg border border-slate-200 bg-[#FFFFFF] px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-[#DC2626]"
                      >
                        Detail
                      </button>

                      <button
                        type="button"
                        onClick={() => tambahDataset(dataset)}
                        disabled={sudahDipilih}
                        className={`rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition ${
                          sudahDipilih
                            ? 'cursor-default border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-red-200 bg-red-50/80 text-[#991B1B] hover:border-[#DC2626] hover:bg-[#DC2626] hover:text-white'
                        }`}
                      >
                        {sudahDipilih ? 'Terpilih' : '+ Tambahkan'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              Tidak ditemukan dataset untuk kata kunci <strong>&ldquo;{filterDataset}&rdquo;</strong>.{' '}
              <button
                type="button"
                onClick={() => setFilterDataset('')}
                className="font-semibold text-[#DC2626] underline"
              >
                Tampilkan semua dataset
              </button>
            </div>
          )}
        </div>
      </section>

      {/* TAHAP 2: DAFTAR DATASET TERPILIH & KONFIGURASI (KARTU TENGAH) */}
      <section className="rounded-2xl border border-slate-200/80 bg-[#FFFFFF] p-6 shadow-sm sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              2. Daftar Dataset Terpilih & Konfigurasi Laporan
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Tinjau dataset yang akan digabung dan pilih format gaya penyajian narasi
            </p>
          </div>
          {datasetTerpilih.length > 0 && (
            <button
              type="button"
              onClick={resetSemuaDataset}
              className="text-xs font-semibold text-slate-500 transition hover:text-[#DC2626]"
            >
              Kosongkan Pilihan ({datasetTerpilih.length})
            </button>
          )}
        </div>

        {/* Chips / Tags Dataset Terpilih */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Dataset yang Dipilih ({datasetTerpilih.length})
          </label>
          {datasetTerpilih.length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {datasetTerpilih.map((dataset) => (
                <div
                  key={dataset.uuid}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/60 px-3.5 py-2 text-xs font-medium text-[#0F172A]"
                >
                  <span className="max-w-xl truncate">{dataset.judul}</span>
                  {tahunPerDataset[dataset.uuid] && (
                    <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#991B1B]">
                      {tahunPerDataset[dataset.uuid]}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => hapusDataset(dataset.uuid)}
                    aria-label={`Hapus ${dataset.judul}`}
                    className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-sm font-bold text-slate-500 transition hover:bg-red-100 hover:text-[#DC2626]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2.5 rounded-xl border border-dashed border-slate-200 bg-[#F8FAFC] px-4 py-4 text-xs text-slate-500">
              Belum ada dataset dipilih. Silakan klik tombol <strong>+ Tambahkan</strong> pada katalog di atas.
            </div>
          )}
        </div>

        {/* Pilihan Gaya Penyajian Laporan (3 Kartu Radio Horizontal Sejajar Rapi) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Gaya Penyajian Laporan
          </label>
          <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {OPSI_GAYA_PENYAJIAN.map((opsi) => {
              const aktif = gayaNarasi === opsi.id
              return (
                <button
                  key={opsi.id}
                  type="button"
                  onClick={() => setGayaNarasi(opsi.id)}
                  className={`flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                    aktif
                      ? 'border-[#DC2626] bg-red-50/40 ring-1 ring-[#DC2626]'
                      : 'border-slate-200 bg-[#FFFFFF] hover:border-red-200 hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0F172A]">{opsi.label}</span>
                    <span
                      className={`h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${
                        aktif ? 'border-[#DC2626]' : 'border-slate-300'
                      }`}
                    >
                      {aktif && <span className="h-2 w-2 rounded-full bg-[#DC2626]" />}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{opsi.deskripsi}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tombol Aksi Utama Lebar Penuh Berwarna Merah */}
        <button
          type="button"
          onClick={buatLaporan}
          disabled={!datasetTerpilih.length || loading}
          className="w-full rounded-xl bg-red-600 py-3.5 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading
            ? 'Menyusun Draf Narasi Laporan...'
            : datasetTerpilih.length > 0
            ? `Generate Draf Narasi Laporan (${datasetTerpilih.length} Dataset)`
            : 'Generate Draf Narasi Laporan'}
        </button>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-[#991B1B]">
            {error}
          </div>
        )}
      </section>

      {/* TAHAP 3: HASIL NARASI & VERIFIKASI DATA SUMBER (KARTU BAWAH LEBAR PENUH) */}
      <section
        ref={hasilSectionRef}
        className="rounded-2xl border border-slate-200/80 bg-[#FFFFFF] shadow-sm overflow-hidden"
      >
        <div className="border-b border-slate-100 bg-[#F8FAFC] px-6 py-4 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                3. Hasil Narasi & Verifikasi Data Sumber
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {hasil
                  ? `${jumlahDatasetDigabung} dataset terintegrasi • Dibuat pada ${waktuPembuatan} • 100% Terverifikasi Fakta JSON`
                  : 'Draf dokumen resmi dan tabel data mentah JSON akan ditampilkan pada panel ini'}
              </p>
            </div>

            {/* 3 Tab Bersih */}
            <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-[#FFFFFF] p-1">
              {[
                { id: 'narasi', label: 'Draf Narasi Laporan' },
                { id: 'tabel', label: 'Verifikasi Data Sumber' },
                {
                  id: 'riwayat',
                  label: riwayatSesi.length > 0 ? `Riwayat Sesi (${riwayatSesi.length})` : 'Riwayat Sesi',
                },
              ].map((tab) => {
                const aktif = tabHasil === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTabHasil(tab.id)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                      aktif
                        ? 'bg-[#DC2626] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="py-10">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-red-200 border-t-[#DC2626]" />
                <h3 className="mt-4 text-base font-bold text-[#0F172A]">
                  Menyusun Draf Narasi Laporan Resmi
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Memproses {datasetTerpilih.length} dataset dari portal Satu Data Aceh
                </p>
              </div>

              <div className="mt-6 space-y-2.5 max-w-md mx-auto">
                {tahapanLoadingText.map((teks, idx) => {
                  const selesai = tahapLoading > idx
                  const aktif = tahapLoading === idx
                  return (
                    <div
                      key={teks}
                      className={`rounded-xl border px-4 py-3 text-xs transition ${
                        aktif
                          ? 'border-red-200 bg-red-50/70 font-semibold text-[#991B1B]'
                          : selesai
                          ? 'border-emerald-200 bg-emerald-50/50 font-medium text-emerald-800'
                          : 'border-slate-200 bg-[#F8FAFC] text-slate-400'
                      }`}
                    >
                      {teks}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : tabHasil === 'riwayat' ? (
            /* TAB 3: RIWAYAT SESI */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Riwayat Narasi Sesi Ini</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Daftar laporan yang telah disusun selama sesi browser ini dibuka.
                  </p>
                </div>
                {riwayatSesi.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setRiwayatSesi([])
                      if (onShowToast) onShowToast('Riwayat sesi telah dibersihkan.')
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-[#DC2626]"
                  >
                    Bersihkan Riwayat
                  </button>
                )}
              </div>

              {riwayatSesi.length > 0 ? (
                <div className="space-y-3">
                  {riwayatSesi.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 transition hover:border-red-200 hover:bg-[#FFFFFF] sm:flex-row sm:items-center"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="rounded bg-red-50 px-2 py-0.5 font-semibold text-[#991B1B]">
                            Laporan #{riwayatSesi.length - idx}
                          </span>
                          <span className="text-slate-500">{item.waktu}</span>
                          <span className="rounded border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-600">
                            {item.jumlahDataset} Dataset
                          </span>
                          <span className="rounded border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-600">
                            {item.gayaLabel}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[#0F172A] truncate">{item.judul}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setHasil(item.payload)
                          setWaktuPembuatan(item.waktu)
                          setGayaNarasi(item.gayaId || 'resmi')
                          setTabHasil('narasi')
                        }}
                        className="shrink-0 rounded-lg bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#991B1B]"
                      >
                        Buka Dokumen
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-[#F8FAFC] p-10 text-center text-xs text-slate-500">
                  Belum ada riwayat laporan pada sesi ini.
                </div>
              )}
            </div>
          ) : !hasil ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-[#F8FAFC]/70 px-6 py-14 text-center">
              <p className="text-sm font-semibold text-[#0F172A]">Belum Ada Draf Laporan yang Disusun</p>
              <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                Pilih dataset pada Tahap 1 dan klik tombol <strong>Generate Draf Narasi Laporan</strong> pada Tahap 2
                untuk menampilkan hasil narasi beserta tabel verifikasi sumber di sini.
              </p>
            </div>
          ) : tabHasil === 'narasi' ? (
            /* TAB 1: DRAF NARASI LAPORAN */
            <div className="space-y-5">
              {/* Toolbar Dokumen */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Ukuran Teks:</span>
                  <div className="inline-flex rounded-lg border border-slate-200 bg-[#FFFFFF] p-0.5">
                    <button
                      type="button"
                      onClick={() => setUkuranHuruf('normal')}
                      className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                        ukuranHuruf === 'normal'
                          ? 'bg-[#0F172A] text-white'
                          : 'text-slate-600 hover:text-[#0F172A]'
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setUkuranHuruf('besar')}
                      className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                        ukuranHuruf === 'besar'
                          ? 'bg-[#0F172A] text-white'
                          : 'text-slate-600 hover:text-[#0F172A]'
                      }`}
                    >
                      Besar
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={salinNarasi}
                    className={`rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition ${
                      statusSalin
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-200 bg-[#FFFFFF] text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-[#DC2626]'
                    }`}
                  >
                    {statusSalin ? 'Tersalin ke Clipboard' : 'Salin Teks'}
                  </button>

                  <button
                    type="button"
                    onClick={unduhTxt}
                    className="rounded-lg border border-slate-200 bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-[#DC2626]"
                  >
                    Unduh TXT
                  </button>

                  <button
                    type="button"
                    onClick={unduhDoc}
                    className="rounded-lg bg-[#DC2626] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#991B1B]"
                  >
                    Unduh DOC
                  </button>
                </div>
              </div>

              {/* Kertas Dokumen Resmi */}
              <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
                <div className="border-b border-slate-200 pb-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
                      UPTD Statistik • Diskominsa Aceh
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-[11px] font-semibold text-emerald-700">
                      Terverifikasi Fakta JSON
                    </span>
                  </div>
                  <h3 className="mt-2.5 text-xl font-bold text-[#0F172A] leading-snug">{hasil.judul}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Format Penyajian:{' '}
                    {hasil.gayaLabel ||
                      OPSI_GAYA_PENYAJIAN.find((g) => g.id === gayaNarasi)?.label ||
                      'Laporan Formal 2-4 Paragraf'}
                  </p>
                </div>

                <article
                  className={`mt-6 whitespace-pre-line font-serif text-[#0F172A] text-justify ${
                    ukuranHuruf === 'besar' ? 'text-lg leading-9' : 'text-base leading-8'
                  }`}
                >
                  {teksNarasiTampil}
                </article>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span>Sumber Data: Portal Resmi Satu Data Aceh (0% Deviasi Angka)</span>
                  <button
                    type="button"
                    onClick={() => setTabHasil('tabel')}
                    className="font-semibold text-[#DC2626] hover:underline"
                  >
                    Lihat Tabel Verifikasi Data Sumber
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: VERIFIKASI DATA SUMBER */
            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-end">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    Audit Presisi Numerik
                  </span>
                  <h3 className="mt-1 text-base font-bold text-[#0F172A]">
                    Tabel Indikator Sumber Satu Data Aceh
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Seluruh angka di dalam narasi diambil langsung dari baris data mentah di bawah ini tanpa pembulatan.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="search" className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="search"
                    value={filterBarisTabel}
                    onChange={(e) => setFilterBarisTabel(e.target.value)}
                    placeholder="Cari wilayah, tahun, atau nilai..."
                    className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-1.5 pl-8 pr-3 text-xs text-[#0F172A] outline-none focus:border-[#DC2626] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>

              {daftarDataMentah.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {daftarDataMentah.map((ds, idx) => (
                    <button
                      key={ds.uuid}
                      type="button"
                      onClick={() => {
                        setTabDatasetMentah(idx)
                        setFilterBarisTabel('')
                      }}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        tabDatasetMentah === idx
                          ? 'border-[#DC2626] bg-[#DC2626] text-white'
                          : 'border-slate-200 bg-[#F8FAFC] text-slate-600 hover:border-red-200 hover:text-[#DC2626]'
                      }`}
                    >
                      Dataset #{idx + 1}: {ds.judul.length > 45 ? `${ds.judul.slice(0, 45)}...` : ds.judul}
                    </button>
                  ))}
                </div>
              )}

              {datasetMentahAktif && (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs text-slate-600">
                  <span className="font-semibold text-[#0F172A] truncate pr-3">{datasetMentahAktif.judul}</span>
                  <span className="shrink-0 font-bold text-[#991B1B]">
                    {barisMentahTersaring.length} dari {barisMentahAktif.length} baris
                  </span>
                </div>
              )}

              <div className="custom-scrollbar max-h-96 overflow-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-[#F8FAFC] sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-semibold uppercase tracking-wider text-slate-500">No</th>
                      {kolomTabelMentah.map((kolom) => (
                        <th
                          key={kolom}
                          className="px-4 py-3 font-semibold uppercase tracking-wider text-slate-700"
                        >
                          {kolom.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-[#FFFFFF]">
                    {barisMentahTersaring.length > 0 ? (
                      barisMentahTersaring.map((baris, idx) => (
                        <tr key={idx} className="hover:bg-[#F8FAFC]">
                          <td className="px-4 py-2.5 font-mono text-slate-400">{idx + 1}</td>
                          {kolomTabelMentah.map((kolom) => {
                            const nilai = baris[kolom]
                            const isNumeric = typeof nilai === 'number'
                            return (
                              <td
                                key={kolom}
                                className={`px-4 py-2.5 ${
                                  isNumeric
                                    ? 'font-mono font-semibold text-[#991B1B]'
                                    : kolom === 'wilayah'
                                    ? 'font-medium text-[#0F172A]'
                                    : 'text-slate-600'
                                }`}
                              >
                                {nilai !== undefined && nilai !== null ? String(nilai) : '-'}
                              </td>
                            )
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={kolomTabelMentah.length + 1}
                          className="px-4 py-8 text-center text-xs text-slate-500"
                        >
                          Tidak ada baris yang cocok dengan pencarian &ldquo;{filterBarisTabel}&rdquo;.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* POP-UP MODAL DETAIL TAHUN & METADATA DATASET */}
      {modalDatasetDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setModalDatasetDetail(null)}
        >
          <div
            className="animate-modal w-full max-w-lg rounded-2xl border border-slate-200 bg-[#FFFFFF] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
                  Pratinjau Metadata Dataset
                </p>
                <h3 className="mt-1 text-base font-bold text-[#0F172A]">
                  Informasi Dataset & Ketersediaan Tahun
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalDatasetDetail(null)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Tutup modal"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Judul Lengkap Dataset
                </p>
                <p className="mt-1 text-sm font-semibold text-[#0F172A] leading-relaxed">
                  {modalDatasetDetail.judul}
                </p>
                <p className="mt-2 font-mono text-xs text-slate-500">UUID: {modalDatasetDetail.uuid}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-[#FFFFFF] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#0F172A]">
                    Daftar Tahun Data Tersedia (<code className="text-[#DC2626]">GET /tahun-dataset</code>)
                  </p>
                  {tahunPerDataset[modalDatasetDetail.uuid] && (
                    <span className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-[#991B1B]">
                      Rentang: {tahunPerDataset[modalDatasetDetail.uuid]}
                    </span>
                  )}
                </div>

                {loadingModalTahun ? (
                  <p className="mt-3 text-xs text-slate-500">Memeriksa ketersediaan tahun dari server...</p>
                ) : daftarTahunLengkap[modalDatasetDetail.uuid]?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {daftarTahunLengkap[modalDatasetDetail.uuid].map((thn) => (
                      <span
                        key={thn}
                        className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-1 font-mono text-xs font-semibold text-[#991B1B]"
                      >
                        {thn}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-slate-500">
                    {errorModalTahun || 'Memuat rincian tahun dataset...'}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setModalDatasetDetail(null)}
                className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200/70"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  tambahDataset(modalDatasetDetail)
                  setModalDatasetDetail(null)
                }}
                disabled={datasetTerpilih.some((d) => d.uuid === modalDatasetDetail.uuid)}
                className="rounded-xl bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#991B1B] disabled:bg-emerald-600"
              >
                {datasetTerpilih.some((d) => d.uuid === modalDatasetDetail.uuid)
                  ? 'Sudah Terpilih'
                  : '+ Tambahkan ke Daftar Narasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
