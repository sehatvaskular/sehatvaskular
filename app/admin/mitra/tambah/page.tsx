'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function TambahMitra() {
  const [name, setName] = useState('')
  const [displayOrder, setDisplayOrder] = useState('1')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!imageFile) {
      Swal.fire({ icon: 'error', title: 'Oops', text: 'Logo mitra wajib diunggah!', customClass: { popup: 'rounded-3xl' } })
      return
    }

    setLoading(true)

    const fileExt = imageFile.name.split('.').pop()
    const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const fileName = `${safeName}-${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage.from('partners').upload(fileName, imageFile)

    if (uploadError) {
      Swal.fire({ icon: 'error', title: 'Upload Gagal', text: uploadError.message, customClass: { popup: 'rounded-3xl' }})
      setLoading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('partners').getPublicUrl(fileName)

    const { error } = await supabase
      .from('partners')
      .insert([{ name, logo_url: publicUrl, display_order: parseInt(displayOrder) }])

    if (error) {
      Swal.fire({ icon: 'error', title: 'Gagal Menyimpan', text: error.message, customClass: { popup: 'rounded-3xl' }})
    } else {
      Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Mitra sukses ditambahkan.', showConfirmButton: false, timer: 2000, customClass: { popup: 'rounded-3xl' }})
      router.push('/admin/mitra')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/mitra" className="inline-flex items-center gap-2 text-sm font-bold text-svMaroon-800 mb-4">
        <ArrowLeft size={16} /> <span>Kembali</span>
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-svBlue-900 mb-1">Tambah Mitra Baru</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Nama Instansi / Perusahaan</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-svBlue-900" placeholder="Contoh: RS. Bethesda" required />
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Urutan Tampil (Angka)</label>
            <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-svBlue-900" min="1" required />
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Logo Instansi (Gunakan file PNG transparan)</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer border font-medium text-sm">
                <ImageIcon size={18} />
                <span>{imageFile ? imageFile.name : 'Pilih File Logo'}</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-3.5 bg-svBlue-900 text-white font-bold rounded-xl hover:bg-svBlue-800 disabled:opacity-70">
              <Save size={18} /> <span>{loading ? 'Menyimpan...' : 'Simpan Mitra'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}