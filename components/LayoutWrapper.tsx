'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ReactNode, useState, useEffect } from 'react'
import ChatBot from './ChatBot'
import { supabase } from '@/lib/supabase' // Tambahkan import Supabase

// Fallback data dokter agar menu tidak kosong saat loading pertama kali
const fallbackDoctors = [
  { id: 1, name: 'dr. Kresna Agung Prabowo' },
  { id: 2, name: 'dr. Kurniawan Eko Wibowo' },
  { id: 3, name: 'dr. Josep Joko Hendratno' }
]

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  // State navigasi
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Untuk Edukasi
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false) // Untuk Tim Dokter

  // State data dokter untuk menu dropdown
  const [doctorsList, setDoctorsList] = useState<any[]>(fallbackDoctors)

  // Ambil data dokter asli dari database secara asinkron (berjalan di latar belakang)
  useEffect(() => {
    const fetchDoctorsForMenu = async () => {
      const { data } = await supabase
        .from('doctors')
        .select('id, name')
        .order('display_order', { ascending: true })
      
      if (data && data.length > 0) {
        setDoctorsList(data)
      }
    }
    fetchDoctorsForMenu()
  }, [])

  // Jika URL adalah /admin, jangan tampilkan Header, Footer & ChatBot Publik
  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <header className="bg-svBlue-900 sticky top-0 z-50 border-b-4 border-svMaroon-900 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group z-50">
            <img 
              src="/logo.png" 
              alt="Logo Sehat Vaskular" 
              className="h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity" 
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x50?text=Logo+Sehat+Vaskular' }}
            />
          </Link>

          {/* Tombol Hamburger (Khusus Mobile) */}
          <button 
            className="lg:hidden text-white p-2 z-50 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Menu Desktop */}
          <nav className="hidden lg:flex gap-6 xl:gap-8 font-medium text-slate-300 items-center h-full">
            <Link href="/" className="hover:text-white hover:underline decoration-svMaroon-600 decoration-2 underline-offset-8 transition-all">Beranda</Link>
            
            {/* Dropdown Edukasi */}
            <div 
              className="relative h-full flex items-center group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Link href="/layanan" className="flex items-center gap-1 hover:text-white hover:underline decoration-svMaroon-600 decoration-2 underline-offset-8 transition-all py-8">
                Edukasi <span className="text-xs ml-1 transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </Link>
              
              {isDropdownOpen && (
                <div className="absolute top-[80px] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/diabetic-foot" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Diabetic Foot</Link>
                  <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/akses-hemodialisa" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Akses Hemodialisa (Cimino)</Link>
                  <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/varises" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Varises</Link>
                  <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/pad" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Peripheral Artery Disease</Link>
                  <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/dvt" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Deep Vein Thrombosis</Link>
                  <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/trauma-vaskular" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Trauma Vaskular</Link>
                </div>
              )}
            </div>

            <Link href="/artikel" className={`hover:text-white hover:underline decoration-svMaroon-600 decoration-2 underline-offset-8 transition-all ${pathname === '/artikel' ? 'text-white underline' : ''}`}>
              Artikel
            </Link>
            
            {/* Dropdown Tim Dokter */}
            <div 
              className="relative h-full flex items-center group"
              onMouseEnter={() => setIsDoctorDropdownOpen(true)}
              onMouseLeave={() => setIsDoctorDropdownOpen(false)}
            >
              <Link href="/tim-dokter" className="flex items-center gap-1 hover:text-white hover:underline decoration-svMaroon-600 decoration-2 underline-offset-8 transition-all py-8">
                Tim Dokter <span className="text-xs ml-1 transition-transform duration-200" style={{ transform: isDoctorDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </Link>
              
              {isDoctorDropdownOpen && (
                <div className="absolute top-[80px] left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link onClick={() => setIsDoctorDropdownOpen(false)} href="/tim-dokter" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 font-bold border-b border-slate-100 transition">
                    Lihat Semua Tim Pakar →
                  </Link>
                  {doctorsList.map((doc) => (
                    <Link 
                      key={doc.id} 
                      onClick={() => setIsDoctorDropdownOpen(false)} 
                      href={`/tim-dokter/${doc.id}`} 
                      className="px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-svMaroon-800 font-medium border-l-4 border-transparent hover:border-svMaroon-800 transition"
                    >
                      {doc.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/kontak" className="hover:text-white hover:underline decoration-svMaroon-600 decoration-2 underline-offset-8 transition-all">Kontak</Link>
          </nav>

          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-svMaroon-800 text-white font-semibold rounded-full hover:bg-svMaroon-900 transition shadow-lg shadow-svMaroon-900/30">
            <span>Tanya Admin</span>
            <span>→</span>
          </a>
        </div>

        {/* Menu Mobile Fullscreen Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed top-20 left-0 w-full h-[calc(100vh-80px)] bg-svBlue-900 z-40 flex flex-col pt-8 px-6 pb-20 gap-6 overflow-y-auto">
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="text-xl font-bold text-white border-b border-white/10 pb-4">Beranda</Link>
            
            <div className="flex flex-col gap-4 border-b border-white/10 pb-4">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan" className="text-xl font-bold text-white">Topik Edukasi</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/diabetic-foot" className="text-slate-300 pl-4 py-2 hover:text-white">Diabetic Foot</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/akses-hemodialisa" className="text-slate-300 pl-4 py-2 hover:text-white">Akses Hemodialisa</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/varises" className="text-slate-300 pl-4 py-2 hover:text-white">Varises</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/pad" className="text-slate-300 pl-4 py-2 hover:text-white">Peripheral Artery Disease</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/dvt" className="text-slate-300 pl-4 py-2 hover:text-white">Deep Vein Thrombosis</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/trauma-vaskular" className="text-slate-300 pl-4 py-2 hover:text-white">Trauma Vaskular</Link>
            </div>

            <Link onClick={() => setIsMobileMenuOpen(false)} href="/artikel" className="text-xl font-bold text-white border-b border-white/10 pb-4">Artikel</Link>
            
            <div className="flex flex-col gap-4 border-b border-white/10 pb-4">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/tim-dokter" className="text-xl font-bold text-white">Tim Dokter</Link>
              {doctorsList.map((doc) => (
                <Link 
                  key={doc.id} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  href={`/tim-dokter/${doc.id}`} 
                  className="text-slate-300 pl-4 py-2 hover:text-white"
                >
                  {doc.name}
                </Link>
              ))}
            </div>

            <Link onClick={() => setIsMobileMenuOpen(false)} href="/kontak" className="text-xl font-bold text-white pb-4">Kontak</Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-svBlue-900 text-slate-400 py-16 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center mb-6">
               <img 
                 src="/logo.png" 
                 alt="Logo Sehat Vaskular Footer" 
                 className="h-12 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" 
                 onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x50?text=Logo+Sehat+Vaskular' }}
               />
            </div>
            <p className="text-sm leading-relaxed max-w-md">Platform edukasi dan informasi kesehatan spesialis bedah vaskular & endovaskular terdepan di Indonesia.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Menu Cepat</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/layanan" className="hover:text-white hover:pl-2 transition-all">Topik Edukasi</Link></li>
              <li><Link href="/tim-dokter" className="hover:text-white hover:pl-2 transition-all">Tim Dokter</Link></li>
              <li><Link href="/kontak" className="hover:text-white hover:pl-2 transition-all">Hubungi Kami</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Informasi</h4>
            <ul className="space-y-3 text-sm">
              <li>Email: admin@sehatvaskular.com</li>
              <li>Telp: 0822-4564-5756</li>
              <li>Beroperasi: Senin - Sabtu</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* CHATBOT AI */}
      <ChatBot />
    </>
  )
}