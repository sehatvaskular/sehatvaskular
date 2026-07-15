'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'
import Swal from 'sweetalert2'

export const runtime = 'edge';;

export default function EditMitra({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()

  const [name, setName] = useState('')
  const [displayOrder, setDisplayOrder] = useState('1')
  const [currentImage, setCurrentImage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetchPartner = async () => {
      const { data, error } = await supabase.from('partners').select('*').eq('id', id).single()
      if (data) {
        setName(data.name)
        setDisplayOrder(data.display_order.toString())
        setCurrentImage(data.logo_url || '')
      }
      setFetching(false)
    }
    fetchPartner()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let logo_url = currentImage;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
      const fileName = `update-${safeName}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('partners').upload(fileName, imageFile)
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('partners').getPublicUrl(fileName)
        logo_url = publicUrl
      }
    }

    const { error } = await supabase
      .from('partners')
      .update({ name, logo_url, display_order: parseInt(displayOrder) })
      .eq('id', id)

    if (error) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: error.message, customClass: { popup: 'rounded-3xl' }})
    } else {
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data mitra diperbarui.', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-3xl' }})
      router.push('/admin/mitra')
      router.refresh()
    }
    setLoading(false)
  }

  if (fetching) return <div className="p-20 text-center text-slate-500">Memuat...</div>

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/mitra" className="inline-flex items-center gap-2 text-sm font-bold text-svMaroon-800 mb-4">
        <ArrowLeft size={16} /> <span>Kembali</span>
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-svBlue-900 mb-1">Edit Mitra</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Nama Instansi</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-svBlue-900" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Urutan Tampil</label>
            <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-svBlue-900" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Logo Saat Ini</label>
            {currentImage && (
              <div className="mb-4 bg-slate-50 p-4 border rounded-xl inline-block">
                <img src={currentImage} alt="Current" className="h-16 object-contain" />
              </div>
            )}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer border text-sm font-medium">
                <ImageIcon size={18} />
                <span>{imageFile ? imageFile.name : 'Ganti Logo'}</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-70">
              <Save size={18} /> <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}