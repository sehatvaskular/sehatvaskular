'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react' 
import Swal from 'sweetalert2'

export const runtime = 'nodejs';

export default function EditDokter({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()

  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [displayOrder, setDisplayOrder] = useState('1')
  const [currentImage, setCurrentImage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  // State Baru untuk Detail Profil
  const [bio, setBio] = useState('')
  const [education, setEducation] = useState('')
  const [practice, setPractice] = useState('')
  const [experience, setExperience] = useState('')
  const [awards, setAwards] = useState('')

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Fungsi Helper: Array to Text (untuk load data ke textarea)
  const arrayToText = (arr: any) => Array.isArray(arr) ? arr.join('\n') : ''
  // Fungsi Helper: Text to Array (untuk simpan data ke DB)
  const textToArray = (text: string) => text.split('\n').map(item => item.trim()).filter(item => item !== '')

  useEffect(() => {
    const fetchDoctor = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) {
        setName(data.name)
        setTitle(data.title)
        setSpecialty(data.specialty || '')
        setDisplayOrder(data.display_order.toString())
        setCurrentImage(data.image_url || '')
        
        // Load data array ke textarea
        setBio(data.bio || '')
        setEducation(arrayToText(data.education))
        setPractice(arrayToText(data.practice))
        setExperience(arrayToText(data.experience))
        setAwards(arrayToText(data.awards))

      } else if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Tidak Ditemukan',
          text: 'Data dokter gagal dimuat atau tidak ada.',
          confirmButtonColor: '#0f172a',
          customClass: { popup: 'rounded-3xl' }
        })
        router.push('/admin/dokter')
      }
      setFetching(false)
    }
    fetchDoctor()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let image_url = currentImage;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
      const fileName = `update-${safeName}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('doctors').upload(fileName, imageFile)
      
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
      
      const { data: { publicUrl } } = supabase.storage.from('doctors').getPublicUrl(fileName)
      image_url = publicUrl
    }

    const { error } = await supabase
      .from('doctors')
      .update({ 
        name, 
        title, 
        specialty, 
        image_url, 
        display_order: parseInt(displayOrder),
        bio,
        education: textToArray(education),
        practice: textToArray(practice),
        experience: textToArray(experience),
        awards: textToArray(awards)
      })
      .eq('id', id)

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
        text: 'Profil dokter berhasil diperbarui.',
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: 'rounded-3xl' }
      })
      router.push('/admin/dokter')
      router.refresh()
    }
    setLoading(false)
  }

  if (fetching) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-svBlue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Menarik data profil...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link href="/admin/dokter" className="inline-flex items-center gap-2 text-sm font-bold text-svMaroon-800 hover:text-svMaroon-950 transition mb-4">
        <ArrowLeft size={16} /> <span>Batal & Kembali</span>
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-svBlue-900 mb-1">Edit Profil Dokter</h1>
        <p className="text-slate-600">Perbarui informasi, foto, dan portofolio dokter.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* BAGIAN 1: INFORMASI DASAR */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-bold text-svBlue-900 border-b pb-2">Informasi Dasar</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-svBlue-900 mb-2">Nama Dokter Lengkap</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-svBlue-900 mb-2">Gelar Medis</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-svBlue-900 mb-2">Asosiasi / Spesialisasi</label>
              <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-sm font-bold text-svBlue-900 mb-2">Urutan Tampil</label>
              <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition font-bold" min="1" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Foto Dokter</label>
            {currentImage && (
              <div className="mb-4">
                <img src={currentImage} alt="Current" className="h-48 rounded-xl border border-slate-200 object-cover shadow-sm" />
              </div>
            )}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition border border-slate-200 font-medium text-sm">
                <ImageIcon size={18} />
                <span>{imageFile ? imageFile.name : 'Ganti Gambar (Opsional)'}</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              {imageFile && <span className="text-xs text-emerald-600 font-bold">✓ Gambar Baru Siap</span>}
            </div>
          </div>
        </div>

        {/* BAGIAN 2: DETAIL PROFIL (BIO, PENDIDIKAN, PENGALAMAN) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-bold text-svBlue-900 border-b pb-2">Riwayat Detail (Portofolio)</h2>
          
          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Bio / Tentang Dokter</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition" placeholder="Tuliskan paragraf deskripsi profil dokter..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-1">Lokasi Praktek Aktif</label>
            <p className="text-xs text-slate-500 mb-2">Pisahkan setiap lokasi dengan baris baru (Enter).</p>
            <textarea value={practice} onChange={(e) => setPractice(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition"></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-1">Riwayat Pendidikan</label>
            <p className="text-xs text-slate-500 mb-2">Pisahkan setiap riwayat dengan baris baru (Enter).</p>
            <textarea value={education} onChange={(e) => setEducation(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition"></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-1">Pengalaman & Forum Ilmiah</label>
            <p className="text-xs text-slate-500 mb-2">Pisahkan setiap pengalaman dengan baris baru (Enter).</p>
            <textarea value={experience} onChange={(e) => setExperience(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition"></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-svBlue-900 mb-1">Penghargaan & Prestasi (Opsional)</label>
            <p className="text-xs text-slate-500 mb-2">Pisahkan setiap penghargaan dengan baris baru (Enter).</p>
            <textarea value={awards} onChange={(e) => setAwards(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svBlue-900 focus:bg-white transition"></textarea>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-xl disabled:opacity-70 text-lg"
          >
            <Save size={20} /> 
            <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
        
      </form>
    </div>
  )
}