'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
// Tambahkan PlaySquare di import lucide-react
import { LayoutDashboard, FileText, Users, Handshake, PlaySquare, LogOut, Settings } from 'lucide-react'
import Swal from 'sweetalert2'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const [userEmail, setUserEmail] = useState<string | null>('admin@sehatvaskular.com')

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Middleware sudah mengurus tendang-menendang user.
    // Di sini kita HANYA fokus mengambil data email untuk ditampilkan di header.
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email) {
        setUserEmail(user.email)
      }
    }

    if (!isLoginPage) {
      getUserData()
    }
  }, [isLoginPage])

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Keluar dari Sistem?',
      text: 'Anda harus login kembali untuk masuk ke dashboard.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#991b1b', // svMaroon-800
      cancelButtonColor: '#94a3b8',  // slate-400
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-3xl' }
    })

    if (result.isConfirmed) {
      await supabase.auth.signOut()
      // Paksa refresh rute agar middleware mendeteksi logout
      window.location.href = '/admin/login' 
    }
  }

  // Jika sedang di halaman login, HANYA render konten form loginnya (tanpa sidebar)
  if (isLoginPage) {
    return <>{children}</>
  }

  // Jika di halaman dashboard, tampilkan Layout Admin Penuh
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-svBlue-900 text-slate-300 flex flex-col fixed h-full z-50">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center group w-full">
            <img 
              src="/logoICO.png" 
              alt="Admin Logo" 
              className="h-8 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none' }} // Sembunyikan jika tidak ada
            />
            <span className="text-lg font-bold text-white tracking-tight ml-3">Admin Panel</span>
          </Link>
        </div>

        <div className="flex flex-col flex-grow py-6 px-4 gap-2 overflow-y-auto custom-scrollbar">
          <p className="text-xs font-bold tracking-widest text-slate-500 mb-2 px-2">MENU UTAMA</p>
          
          <Link href="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition group ${pathname === '/admin' ? 'bg-white/10 text-white' : 'hover:text-white'}`}>
            <LayoutDashboard size={20} className="text-svMaroon-400" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link href="/admin/artikel" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition group ${pathname?.includes('/admin/artikel') ? 'bg-white/10 text-white' : 'hover:text-white'}`}>
            <FileText size={20} className="text-svMaroon-400" />
            <span className="font-medium">Kelola Artikel</span>
          </Link>

          <Link href="/admin/dokter" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition group ${pathname?.includes('/admin/dokter') ? 'bg-white/10 text-white' : 'hover:text-white'}`}>
            <Users size={20} className="text-svMaroon-400" />
            <span className="font-medium">Tim Dokter</span>
          </Link>

          <Link href="/admin/mitra" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition group ${pathname?.includes('/admin/mitra') ? 'bg-white/10 text-white' : 'hover:text-white'}`}>
            <Handshake size={20} className="text-svMaroon-400" />
            <span className="font-medium">Mitra & Kolaborasi</span>
          </Link>

          {/* MENU JURNAL VASKULAR DITAMBAHKAN DI SINI */}
          <Link href="/admin/jurnal" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition group ${pathname?.includes('/admin/jurnal') ? 'bg-white/10 text-white' : 'hover:text-white'}`}>
            <PlaySquare size={20} className="text-svMaroon-400" />
            <span className="font-medium">Jurnal Vaskular</span>
          </Link>
        </div>

        <div className="p-4 border-t border-white/10">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 hover:text-white transition mb-2">
            <Settings size={20} className="text-slate-400" />
            <span className="font-medium text-sm">Lihat Website Publik</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-xl font-bold text-svBlue-900">Selamat datang, Admin!</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-svBlue-900">Administrator</p>
              <p className="text-xs text-slate-500">{userEmail}</p>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-svMaroon-800 flex items-center justify-center overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=Admin+SV&background=1e293b&color=fff`} alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>

    </div>
  )
}