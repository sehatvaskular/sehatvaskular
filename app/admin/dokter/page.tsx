'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Edit3, Users } from 'lucide-react'
import Swal from 'sweetalert2'

// Tambahkan Interface pengganti 'any'
interface Doctor {
  id: number;
  name: string;
  title: string;
  specialty: string;
  image_url: string;
  display_order: number;
}

export default function KelolaDokter() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0) // Tambahkan trigger refresh

  // Pindahkan fetch langsung ke dalam useEffect
  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('display_order', { ascending: true })

      if (!error && data) setDoctors(data)
      setLoading(false)
    }
    loadDoctors()
  }, [refreshKey])

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Dokter?',
      text: "Profil dokter ini akan dihapus dari sistem!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#991b1b',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-3xl' }
    })

    if (result.isConfirmed) {
      const { error } = await supabase.from('doctors').delete().eq('id', id)

      if (error) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: error.message, customClass: { popup: 'rounded-3xl' } })
      } else {
        Swal.fire({ icon: 'success', title: 'Terhapus!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-3xl' } })
        setRefreshKey(prev => prev + 1) // Gunakan refreshKey
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-svBlue-900 mb-1">Jaringan Pakar & Dokter</h1>
          <p className="text-slate-600">Kelola profil tim dokter yang tampil di website utama.</p>
        </div>
        <Link 
          href="/admin/dokter/tambah" 
          className="inline-flex items-center gap-2 px-5 py-3 bg-svMaroon-800 text-white font-bold rounded-xl hover:bg-svMaroon-950 transition shadow-lg text-sm self-start sm:self-center"
        >
          <Plus size={18} />
          <span>Tambah Dokter Baru</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Memuat data dokter...</div>
        ) : doctors.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="font-medium text-lg">Belum ada profil dokter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  <th className="py-4 px-6">Profil</th>
                  <th className="py-4 px-6 hidden sm:table-cell">Gelar & Spesialisasi</th>
                  <th className="py-4 px-6 text-center">Urutan Tampil</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-4">
                      <img src={doc.image_url || 'https://via.placeholder.com/150'} alt={doc.name} className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm" />
                      <span className="font-bold text-svBlue-900">{doc.name}</span>
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell">
                      <p className="font-medium text-slate-600">{doc.title}</p>
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-bold mt-1">{doc.specialty}</span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-400">
                      #{doc.display_order}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/dokter/edit/${doc.id}`} className="p-2 text-slate-400 hover:text-svBlue-900 hover:bg-slate-100 rounded-lg transition" title="Edit">
                          <Edit3 size={18} />
                        </Link>
                        <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}