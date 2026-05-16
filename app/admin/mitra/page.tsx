'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Edit3, Handshake } from 'lucide-react'
import Swal from 'sweetalert2'

export default function KelolaMitra() {
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPartners = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) setPartners(data)
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Mitra?',
      text: "Logo mitra akan hilang dari halaman utama!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#991b1b',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-3xl' }
    })

    if (result.isConfirmed) {
      const { error } = await supabase.from('partners').delete().eq('id', id)

      if (error) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: error.message, customClass: { popup: 'rounded-3xl' } })
      } else {
        Swal.fire({ icon: 'success', title: 'Terhapus!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-3xl' } })
        fetchPartners()
      }
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-svBlue-900 mb-1">Kelola Mitra & Kolaborasi</h1>
          <p className="text-slate-600">Atur logo perusahaan atau rumah sakit yang tampil di beranda.</p>
        </div>
        <Link 
          href="/admin/mitra/tambah" 
          className="inline-flex items-center gap-2 px-5 py-3 bg-svMaroon-800 text-white font-bold rounded-xl hover:bg-svMaroon-950 transition shadow-lg text-sm"
        >
          <Plus size={18} />
          <span>Tambah Mitra</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Memuat data mitra...</div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Handshake size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="font-medium text-lg">Belum ada logo mitra.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  <th className="py-4 px-6">Logo & Nama Instansi</th>
                  <th className="py-4 px-6 text-center">Urutan Tampil</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-6">
                      <div className="w-24 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-2">
                        <img src={partner.logo_url} alt={partner.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <span className="font-bold text-svBlue-900">{partner.name}</span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-400">
                      #{partner.display_order}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/mitra/edit/${partner.id}`} className="p-2 text-slate-400 hover:text-svBlue-900 hover:bg-slate-100 rounded-lg transition">
                          <Edit3 size={18} />
                        </Link>
                        <button onClick={() => handleDelete(partner.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
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