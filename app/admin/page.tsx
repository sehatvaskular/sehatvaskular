import { supabase } from '@/lib/supabase'
import { FileText, Users, Handshake, Eye } from 'lucide-react'

export const runtime = 'nodejs';

export const revalidate = 0 // Jangan di-cache agar admin selalu melihat data terbaru

export default async function AdminDashboard() {
  // Hitung total data dari Supabase
  const { count: postsCount } = await supabase.from('posts').select('*', { count: 'exact', head: true })
  const { count: doctorsCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true })
  
  // Perbaikan TypeScript: Menggunakan try...catch alih-alih .catch() langsung
  let partnersCount = 0;
  try {
    const { count } = await supabase.from('partners').select('*', { count: 'exact', head: true });
    partnersCount = count || 0;
  } catch (error) {
    // Biarkan kosong agar fallback ke angka 0 berjalan mulus jika tabel belum ada
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-svBlue-900 mb-2">Ikhtisar Sistem</h1>
        <p className="text-slate-600">Pantau aktivitas dan kelola konten edukasi Sehat Vaskular.</p>
      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FileText size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Total Artikel</p>
            <h3 className="text-3xl font-black text-svBlue-900">{postsCount || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Tim Dokter</p>
            <h3 className="text-3xl font-black text-svBlue-900">{doctorsCount || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Handshake size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Total Mitra</p>
            <h3 className="text-3xl font-black text-svBlue-900">{partnersCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-svMaroon-900/10 text-svMaroon-800 rounded-xl flex items-center justify-center">
            <Eye size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Status Web</p>
            <h3 className="text-xl font-black text-emerald-600 mt-2">ONLINE</h3>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h3 className="text-lg font-bold text-svBlue-900 mb-6">Aksi Cepat</h3>
        <p className="text-slate-600 mb-6">Silakan pilih menu di sidebar kiri untuk mulai mengelola data situs. Anda dapat menambah, mengedit, dan menghapus artikel edukasi serta memperbarui susunan tim dokter dan mitra kolaborasi.</p>
        <div className="flex gap-4">
          <a href="/admin/artikel" className="px-6 py-3 bg-svBlue-900 text-white font-medium rounded-lg hover:bg-svBlue-800 transition">
            Tulis Artikel Baru
          </a>
        </div>
      </div>
    </div>
  )
}