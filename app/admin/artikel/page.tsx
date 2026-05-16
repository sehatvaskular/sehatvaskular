'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Edit3, FileText, Calendar } from 'lucide-react'
import Swal from 'sweetalert2'

export default function KelolaArtikel() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Function untuk mengambil data artikel terbaru dari Supabase
  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('title, slug, published_at')
      .order('published_at', { ascending: false })

    if (!error && data) {
      setPosts(data)
    }
    setLoading(false)
  }

  // Function untuk menghapus artikel dengan SweetAlert2
  const handleDelete = async (slug: string) => {
    const result = await Swal.fire({
      title: 'Hapus Artikel?',
      text: "Artikel yang dihapus tidak dapat dikembalikan ke sistem!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#991b1b', // svMaroon-800
      cancelButtonColor: '#94a3b8',  // slate-400
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-3xl'
      }
    })

    if (result.isConfirmed) {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('slug', slug)

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: error.message,
          customClass: { popup: 'rounded-3xl' }
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Artikel berhasil dihapus dari sistem.',
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: 'rounded-3xl' }
        })
        fetchPosts() // Refresh data tabel
      }
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-svBlue-900 mb-1">Kelola Artikel Edukasi</h1>
          <p className="text-slate-600">Tambah, ubah, atau hapus artikel literasi vaskular publik.</p>
        </div>
        <Link 
          href="/admin/artikel/tambah" 
          className="inline-flex items-center gap-2 px-5 py-3 bg-svMaroon-800 text-white font-bold rounded-xl hover:bg-svMaroon-950 transition shadow-lg shadow-svMaroon-900/20 text-sm self-start sm:self-center"
        >
          <Plus size={18} />
          <span>Tulis Artikel Baru</span>
        </Link>
      </div>

      {/* TABEL / DAFTAR ARTIKEL */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Memuat daftar artikel...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="font-medium text-lg">Belum ada artikel edukasi.</p>
            <p className="text-sm text-slate-400 mt-1">Mulai buat artikel pertama Anda dengan mengklik tombol di atas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  <th className="py-4 px-6">Judul Artikel Edukasi</th>
                  <th className="py-4 px-6 hidden md:table-cell">Tanggal Rilis</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {posts.map((post) => (
                  <tr key={post.slug} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-svBlue-900 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 md:hidden">
                        {new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Tombol Edit */}
                        <Link 
                          href={`/admin/artikel/edit/${post.slug}`}
                          className="p-2 text-slate-400 hover:text-svBlue-900 hover:bg-slate-100 rounded-lg transition"
                          title="Edit Artikel"
                        >
                          <Edit3 size={18} />
                        </Link>
                        {/* Tombol Hapus */}
                        <button 
                          onClick={() => handleDelete(post.slug)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus Artikel"
                        >
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