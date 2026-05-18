'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, Trash2, Video } from 'lucide-react'
import Swal from 'sweetalert2'

export default function AdminJurnal() {
  const [jurnal, setJurnal] = useState<any[]>([])

  const fetchJurnal = async () => {
    const { data } = await supabase.from('jurnal_vaskular').select('*').order('created_at', { ascending: false })
    if (data) setJurnal(data)
  }

  useEffect(() => { fetchJurnal() }, [])

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({ title: 'Hapus Jurnal?', text: "Data tidak bisa dikembalikan!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#991b1b', confirmButtonText: 'Ya, Hapus!' })
    if (result.isConfirmed) {
      await supabase.from('jurnal_vaskular').delete().eq('id', id)
      fetchJurnal()
      Swal.fire('Terhapus!', 'Jurnal berhasil dihapus.', 'success')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-svBlue-900">Jurnal Vaskular</h1>
          <p className="text-slate-500">Kelola video edukasi (Shorts/Reels).</p>
        </div>
        <Link href="/admin/jurnal/tambah" className="bg-svMaroon-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-svMaroon-900 transition">
          <Plus size={18} /> Tambah Video Baru
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-svBlue-900">
              <th className="p-4 font-bold">Video</th>
              <th className="p-4 font-bold">Deskripsi</th>
              <th className="p-4 font-bold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jurnal.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4">
                  <div className="flex items-center gap-3 text-sm font-mono text-svBlue-900 break-all w-64">
                    <Video size={18} className="text-svMaroon-800 shrink-0" />
                    <a href={item.youtube_url} target="_blank" className="hover:underline">{item.youtube_url}</a>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600 line-clamp-2 max-w-md">{item.description}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}