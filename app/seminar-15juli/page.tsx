'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Lock, FileText, Download, Image as ImageIcon, Phone, Globe, ArrowRight, Loader2 } from 'lucide-react'
import Swal from 'sweetalert2'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SeminarPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [attendeeName, setAttendeeName] = useState('') // State baru untuk nama
  const [loading, setLoading] = useState(false)
  
  const [settings, setSettings] = useState<any>(null)
  const [materials, setMaterials] = useState<any[]>([])
  const [photos, setPhotos] = useState<any[]>([])
  const [article, setArticle] = useState<any>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from('seminar_attendees')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single()

    setLoading(false)

    if (data) {
      setIsAuthenticated(true)
      setAttendeeName(data.name) // Simpan nama peserta
      fetchSeminarData()
    } else {
      Swal.fire('Akses Ditolak', 'Nomor telepon tidak terdaftar sebagai peserta seminar.', 'error')
    }
  }

  const fetchSeminarData = async () => {
    const { data: setRes } = await supabase.from('seminar_settings').select('*').single()
    if (setRes) {
      setSettings(setRes)
      const { data: artRes } = await supabase.from('posts').select('*').eq('slug', setRes.article_slug).single()
      if (artRes) setArticle(artRes)
    }

    const { data: matRes } = await supabase.from('seminar_materials').select('*')
    if (matRes) {
      setMaterials(matRes.filter(m => m.file_type === 'document'))
      setPhotos(matRes.filter(m => m.file_type === 'photo'))
    }
  }

  // Fungsi untuk mengambil nama depan (contoh: "Rizhal Hamdani" -> "Rizhal")
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0].replace(/,/g, '') // Hapus koma jika ada
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        {/* ... (KODE FORM LOGIN SAMA SEPERTI SEBELUMNYA) ... */}
        <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-svMaroon-800 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-svBlue-900 mb-2">Akses Materi Seminar</h1>
          <p className="text-slate-500 mb-8 text-sm">Masukkan nomor WhatsApp yang terdaftar untuk mengakses materi.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-svBlue-900 focus:outline-none text-center text-lg tracking-wider"
              required
            />
            <button type="submit" disabled={loading} className="w-full py-3 bg-svBlue-900 text-white font-bold rounded-xl flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" /> : 'Buka Akses'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER SAPAAN & ARTIKEL */}
      <div className="bg-svBlue-900 text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* SAPAAN PERSONAL */}
          <div className="mb-6 flex items-center gap-3">
             <div className="w-10 h-10 bg-svMaroon-800 rounded-full flex items-center justify-center font-bold text-lg">
                {getFirstName(attendeeName).charAt(0)}
             </div>
             <p className="text-lg text-slate-200">Selamat datang kembali, <strong className="text-white text-xl">{getFirstName(attendeeName)}!</strong></p>
          </div>

          <span className="bg-svMaroon-800 px-3 py-1 text-xs font-bold rounded-full mb-4 inline-block">Liputan Acara</span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{article?.title || 'Memuat Artikel...'}</h1>
          <p className="text-slate-300 mb-6">{article?.excerpt || 'Ringkasan artikel seminar belum tersedia.'}</p>
          {article?.slug && (
            <a href={`/artikel/${article.slug}`} className="inline-flex items-center gap-2 text-white bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full font-medium transition">
              Baca Artikel Lengkap <ArrowRight size={16} />
            </a>
          )}
        </div>
      </div>

      {/* ... (KODE MATERI, FOTO, DAN KONTAK SAMA SEPERTI SEBELUMNYA) ... */}
      {/* PASTIKAN UNTUK MENG-COPY BAGIAN INI DARI JAWABAN SAYA SEBELUMNYA JIKA DIPERLUKAN */}
    </div>
  )
}