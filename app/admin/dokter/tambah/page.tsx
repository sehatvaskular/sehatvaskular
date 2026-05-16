'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function TambahDokter() {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [specialty, setSpecialty] = useState('PESBEVI')
  const [displayOrder, setDisplayOrder] = useState('1')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let image_url = 'https://via.placeholder.com/400x500?text=No+Image';

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      // Hapus karakter aneh dari nama file
      const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
      const fileName = `${safeName}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('doctors').upload(fileName, imageFile)

      if (uploadError) {
        Swal.fire({ icon: 'error', title: 'Upload Gagal', text: uploadError.message, customClass: { popup: 'rounded-3xl' }})
        setLoading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage.from('doctors').getPublicUrl(fileName)
      image_url = publicUrl
    }

    const { error } = await supabase
      .from('doctors')
      .insert([{ 
        name, 
        title, 
        specialty, 
        image_url, 
        display_order: parseInt(displayOrder) 
      }])

    if (error) {
      Swal.fire({ icon: 'error', title: 'Gagal Menyimpan', text: error.message, customClass: { popup: 'rounded-3xl' }})
    } else {
      Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Profil dokter sukses ditambahkan.', showConfirmButton: false, timer: 2000, customClass: { popup: 'rounded-3xl' }})
      router.push('/admin/dokter')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/dokter" className="inline-flex items-center gap-2 text-sm font-bold text-svMaroon-800 mb-4">
        <ArrowLeft size={16} /> <span>Kembali</span>
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-svBlue-900 mb-1">Tambah Profil Dokter</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-svBlue-900 mb-2">Nama Dokter Lengkap</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-svBlue-900" placeholder="Contoh: dr. Budi Santoso" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-svBlue-900 mb-2">Gelar Medis</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-svBlue-900" placeholder="Contoh: Sp.B, Subsp.BVE (K)" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-svBlue-900 mb-2">Asosiasi / Spesialisasi</label>
              <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-svBlue-900" placeholder="Contoh: PESBEVI" />
            </div>
            <div>
              <label className="block text-sm font-bold text-svBlue-900 mb-2">Urutan Tampil (Angka)</label>
              <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-svBlue-900" min="1" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Foto Dokter (Portrait / Berdiri)</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer border font-medium text-sm">
                <ImageIcon size={18} />
                <span>{imageFile ? imageFile.name : 'Pilih File Gambar'}</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              {imageFile && <span className="text-xs text-emerald-600 font-bold">✓ File Siap</span>}
            </div>
            <p className="text-xs text-slate-500 mt-2">Rasio gambar yang disarankan adalah 4:5 (agak memanjang ke atas).</p>
          </div>

          <div className="pt-6 border-t flex justify-end">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-3.5 bg-svBlue-900 text-white font-bold rounded-xl hover:bg-svBlue-800 disabled:opacity-70">
              <Save size={18} /> <span>{loading ? 'Menyimpan...' : 'Simpan Profil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}