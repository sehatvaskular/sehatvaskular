'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function TambahJurnal() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('jurnal_vaskular').insert([{ 
      youtube_url: url, 
      description: deskripsi 
    }])

    setLoading(false)
    if (error) {
      Swal.fire('Error', error.message, 'error')
    } else {
      Swal.fire('Sukses', 'Video Jurnal ditambahkan!', 'success').then(() => {
        router.push('/admin/jurnal')
      })
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-svBlue-900 mb-6">Tambah Jurnal Vaskular</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
        <div>
          <label className="block text-sm font-bold text-svBlue-900 mb-2">Link YouTube (Shorts / Regular)</label>
          <input 
            type="url" 
            value={url} onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-svMaroon-800" 
            placeholder="Contoh: https://youtube.com/shorts/xyz123" required 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-svBlue-900 mb-2">Deskripsi / Caption</label>
          <textarea 
            rows={6} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-svMaroon-800" 
            placeholder="Tuliskan caption yang menarik di sini..." required 
          ></textarea>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-svBlue-900 text-white font-bold rounded-xl hover:bg-svMaroon-800 transition">
          {loading ? 'Menyimpan...' : 'Simpan Jurnal'}
        </button>
      </form>
    </div>
  )
}