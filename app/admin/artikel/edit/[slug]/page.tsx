'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'
import Swal from 'sweetalert2' // Import SweetAlert2

export const runtime = 'edge';

export default function EditArtikel({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [currentImage, setCurrentImage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Ambil data artikel yang mau di-edit
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single()
      
      if (data) {
        setTitle(data.title)
        setExcerpt(data.excerpt || '')
        setContent(data.content)
        setCurrentImage(data.image_url || '')
      } else if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Tidak Ditemukan',
          text: 'Artikel yang Anda cari tidak ada di dalam database.',
          confirmButtonColor: '#0f172a',
          customClass: { popup: 'rounded-3xl' }
        })
        router.push('/admin/artikel')
      }
      setFetching(false)
    }
    fetchPost()
  }, [slug, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let image_url = currentImage; // Default pakai gambar lama

    // Jika upload gambar baru, timpa yang lama
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `update-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('articles').upload(fileName, imageFile)
      
      if (uploadError) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Upload',
          text: 'Gambar baru gagal diunggah: ' + uploadError.message,
          confirmButtonColor: '#0f172a',
          customClass: { popup: 'rounded-3xl' }
        })
        setLoading(false)
        return
      }
      
      const { data: { publicUrl } } = supabase.storage.from('articles').getPublicUrl(fileName)
      image_url = publicUrl
    }

    // Lakukan UPDATE ke Supabase
    const { error } = await supabase
      .from('posts')
      .update({ title, excerpt, content, image_url })
      .eq('slug', slug)

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memperbarui',
        text: error.message,
        confirmButtonColor: '#0f172a',
        customClass: { popup: 'rounded-3xl' }
      })
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Perubahan artikel berhasil disimpan.',
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: 'rounded-3xl' }
      })
      router.push('/admin/artikel')
      router.refresh()
    }
    setLoading(false)
  }

  if (fetching) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-svBlue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium animate-pulse">Menarik data artikel...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/artikel" className="inline-flex items-center gap-2 text-sm font-bold text-svMaroon-800 hover:text-svMaroon-950 transition mb-4">
        <ArrowLeft size={16} /> <span>Batal & Kembali</span>
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-svBlue-900 mb-1">Edit Artikel</h1>
        <p className="text-slate-600">Lakukan perubahan pada konten edukasi Anda.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Judul Artikel</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition font-medium text-svBlue-900" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Gambar Utama (Thumbnail)</label>
            {currentImage && (
              <div className="mb-4">
                <img src={currentImage} alt="Current" className="h-40 rounded-xl border border-slate-200 object-cover shadow-sm" />
                <p className="text-xs font-medium text-slate-400 mt-2">Gambar saat ini. Pilih file baru di bawah jika ingin mengganti.</p>
              </div>
            )}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition border border-slate-200 font-medium text-sm">
                <ImageIcon size={18} />
                <span>{imageFile ? imageFile.name : 'Ganti Gambar (Opsional)'}</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              {imageFile && <span className="text-xs text-emerald-600 font-bold">✓ Siap ditimpa</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Ringkasan Singkat (Excerpt)</label>
            <textarea 
              value={excerpt} 
              onChange={(e) => setExcerpt(e.target.value)} 
              rows={3} 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition text-sm text-slate-700" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Konten Utama</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              rows={12} 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition font-mono text-sm text-slate-700 leading-relaxed" 
              required 
            />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 disabled:opacity-70"
            >
              <Save size={18} /> 
              <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
          
        </form>
      </div>
    </div>
  )
}