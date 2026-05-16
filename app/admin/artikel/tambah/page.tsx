'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function TambahArtikel() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const slug = generateSlug(title)
    if (!slug) {
      Swal.fire({
        icon: 'error',
        title: 'Judul Tidak Valid',
        text: 'Pastikan Anda telah mengisi judul dengan benar.',
        confirmButtonColor: '#0f172a',
        customClass: { popup: 'rounded-3xl' }
      })
      setLoading(false)
      return
    }

    let image_url = null;

    // 1. Proses Upload Gambar (Jika ada)
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${slug}-${Date.now()}.${fileExt}` // Bikin nama file unik
      
      const { error: uploadError } = await supabase.storage
        .from('articles')
        .upload(fileName, imageFile)

      if (uploadError) {
        Swal.fire({
          icon: 'error',
          title: 'Upload Gagal',
          text: uploadError.message,
          confirmButtonColor: '#0f172a',
          customClass: { popup: 'rounded-3xl' }
        })
        setLoading(false)
        return
      }

      // Ambil public URL dari gambar yang baru diupload
      const { data: { publicUrl } } = supabase.storage.from('articles').getPublicUrl(fileName)
      image_url = publicUrl
    }

    // 2. Simpan Data ke Database
    const { error } = await supabase
      .from('posts')
      .insert([{ title, slug, excerpt, content, image_url, published_at: new Date().toISOString() }])

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: error.message,
        confirmButtonColor: '#0f172a',
        customClass: { popup: 'rounded-3xl' }
      })
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Artikel edukasi sukses diterbitkan.',
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: 'rounded-3xl' }
      })
      router.push('/admin/artikel')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/artikel" className="inline-flex items-center gap-2 text-sm font-bold text-svMaroon-800 hover:text-svMaroon-950 transition mb-4">
        <ArrowLeft size={16} /> <span>Kembali</span>
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-svBlue-900 mb-1">Tulis Artikel Baru</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Judul Artikel</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800" required />
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Gambar Utama (Thumbnail)</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition border border-slate-200 font-medium text-sm">
                <ImageIcon size={18} />
                <span>{imageFile ? imageFile.name : 'Pilih File Gambar'}</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              {imageFile && <span className="text-xs text-emerald-600 font-bold">✓ Siap diunggah</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Ringkasan Singkat (Excerpt)</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800" />
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Konten Utama Artikel</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 font-mono text-sm" required />
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-3.5 bg-svBlue-900 text-white font-bold rounded-xl hover:bg-svBlue-800 transition disabled:opacity-70">
              <Save size={18} /> <span>{loading ? 'Menyimpan...' : 'Terbitkan Artikel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}