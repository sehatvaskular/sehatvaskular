'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ReactNode, useState, useEffect } from 'react'
import ChatBot from './ChatBot'
import { supabase } from '@/lib/supabase'

// Data bayangan jika koneksi lambat
const fallbackDoctors = [
  { id: 1, name: 'dr. Kresna Agung Prabowo' },
  { id: 2, name: 'dr. Kurniawan Eko Wibowo' },
  { id: 3, name: 'dr. Josep Joko Hendratno' }
]

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  // State Navigasi
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isEduDropdownOpen, setIsEduDropdownOpen] = useState(false)
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false)

  // State Data Dokter
  const [doctorsList, setDoctorsList] = useState<any[]>(fallbackDoctors)

  // Ambil data dokter asli untuk dropdown
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await supabase
        .from('doctors')
        .select('id, name')
        .order('display_order', { ascending: true })
      
      if (data && data.length > 0) {
        setDoctorsList(data)
      }
    }
    fetchDoctors()
  }, [])

  // JIKA ADMIN: Tampilkan konten saja (Tanpa Header/Footer Publik)
  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <header className="bg-svBlue-900 sticky top-0 z-50 border-b-4 border-svMaroon-900 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
{/* LOGO */}
<Link href="/" className="flex items-center gap-3 group z-50">
            <img 
              src="/logo.png" 
              alt="Logo Sehat Vaskular" 
              className="h-10 md:h-12 w-auto object-contain group-hover:opacity-90 transition-opacity" 
              onError={(e) => { e.currentTarget.style.display = 'none' }} // Sembunyikan jika gambar gagal dimuat
            />
          </Link>

          {/* HAMBURGER MOBILE */}
          <button 
            className="lg:hidden text-white p-2 z-50"
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

          {/* NAVIGASI DESKTOP */}
          <nav className="hidden lg:flex gap-6 xl:gap-8 font-medium text-slate-300 items-center h-full">
            <Link href="/" className={`hover:text-white transition-colors ${pathname === '/' ? 'text-white border-b-2 border-svMaroon-600' : ''}`}>Beranda</Link>
            
            {/* Dropdown Edukasi */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsEduDropdownOpen(true)}
              onMouseLeave={() => setIsEduDropdownOpen(false)}
            >
              <button className={`flex items-center gap-1 hover:text-white py-8 transition-colors ${pathname?.startsWith('/layanan') ? 'text-white' : ''}`}>
                Edukasi <span className="text-[10px] ml-1">▼</span>
              </button>
              
              {isEduDropdownOpen && (
                <div className="absolute top-[80px] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link onClick={() => setIsEduDropdownOpen(false)} href="/layanan/diabetic-foot" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Diabetic Foot</Link>
                  <Link onClick={() => setIsEduDropdownOpen(false)} href="/layanan/akses-hemodialisa" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Akses Hemodialisa (Cimino)</Link>
                  <Link onClick={() => setIsEduDropdownOpen(false)} href="/layanan/varises" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Varises</Link>
                  <Link onClick={() => setIsEduDropdownOpen(false)} href="/layanan/pad" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Peripheral Artery Disease</Link>
                  <Link onClick={() => setIsEduDropdownOpen(false)} href="/layanan/dvt" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Deep Vein Thrombosis</Link>
                  <Link onClick={() => setIsEduDropdownOpen(false)} href="/layanan/trauma-vaskular" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Trauma Vaskular</Link>
                </div>
              )}
            </div>

            <Link href="/artikel" className={`hover:text-white transition-colors ${pathname === '/artikel' ? 'text-white border-b-2 border-svMaroon-600' : ''}`}>Artikel</Link>
            
            <Link href="/jurnal-vaskular" className={`hover:text-white transition-colors ${pathname === '/jurnal-vaskular' ? 'text-white border-b-2 border-svMaroon-600' : ''}`}>Jurnal Vaskular</Link>
            
            {/* Dropdown Tim Dokter */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsDocDropdownOpen(true)}
              onMouseLeave={() => setIsDocDropdownOpen(false)}
            >
              <button className={`flex items-center gap-1 hover:text-white py-8 transition-colors ${pathname?.startsWith('/tim-dokter') ? 'text-white' : ''}`}>
                Tim Dokter <span className="text-[10px] ml-1">▼</span>
              </button>
              
              {isDocDropdownOpen && (
                <div className="absolute top-[80px] left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link onClick={() => setIsDocDropdownOpen(false)} href="/tim-dokter" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 font-bold border-b border-slate-100 transition">Lihat Semua Tim Pakar →</Link>
                  {doctorsList.map((doc) => (
                    <Link key={doc.id} onClick={() => setIsDocDropdownOpen(false)} href={`/tim-dokter/${doc.id}`} className="px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-svMaroon-800 font-medium border-l-4 border-transparent hover:border-svMaroon-800 transition">
                      {doc.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/kontak" className={`hover:text-white transition-colors ${pathname === '/kontak' ? 'text-white border-b-2 border-svMaroon-600' : ''}`}>Kontak</Link>
          </nav>

          <a href="https://wa.me/6282245645756" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-svMaroon-800 text-white font-semibold rounded-full hover:bg-svMaroon-900 transition shadow-lg shadow-svMaroon-900/30">
            <span>Tanya Admin</span>
            <span>→</span>
          </a>
        </div>

        {/* MENU MOBILE OVERLAY */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed top-20 left-0 w-full h-[calc(100vh-80px)] bg-svBlue-900 z-40 flex flex-col pt-8 px-6 pb-20 gap-6 overflow-y-auto">
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="text-xl font-bold text-white border-b border-white/10 pb-4">Beranda</Link>
            
            <div className="flex flex-col gap-4 border-b border-white/10 pb-4">
              <span className="text-xl font-bold text-white uppercase text-xs tracking-widest text-svMaroon-400">Topik Edukasi</span>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/diabetic-foot" className="text-slate-300 pl-4 py-1">Diabetic Foot</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/akses-hemodialisa" className="text-slate-300 pl-4 py-1">Akses Hemodialisa</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/varises" className="text-slate-300 pl-4 py-1">Varises</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/pad" className="text-slate-300 pl-4 py-1">Peripheral Artery Disease</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/dvt" className="text-slate-300 pl-4 py-1">Deep Vein Thrombosis</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/trauma-vaskular" className="text-slate-300 pl-4 py-1">Trauma Vaskular</Link>
            </div>

            <Link onClick={() => setIsMobileMenuOpen(false)} href="/artikel" className="text-xl font-bold text-white border-b border-white/10 pb-4">Artikel</Link>
            
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/jurnal-vaskular" className="text-xl font-bold text-white border-b border-white/10 pb-4">Jurnal Vaskular</Link>
            
            <div className="flex flex-col gap-4 border-b border-white/10 pb-4">
              <span className="text-xl font-bold text-white uppercase text-xs tracking-widest text-svMaroon-400">Tim Dokter</span>
              {doctorsList.map((doc) => (
                <Link key={doc.id} onClick={() => setIsMobileMenuOpen(false)} href={`/tim-dokter/${doc.id}`} className="text-slate-300 pl-4 py-1">{doc.name}</Link>
              ))}
            </div>

            <Link onClick={() => setIsMobileMenuOpen(false)} href="/kontak" className="text-xl font-bold text-white">Kontak</Link>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-svBlue-900 text-slate-400 py-16 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            {/* Logo Footer (Diubah menjadi putih menggunakan CSS Filter) */}
            <Link href="/" className="inline-block mb-6">
              <img 
                src="/logo.png" 
                alt="Logo Sehat Vaskular Footer" 
                className="h-10 md:h-12 w-auto object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" 
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-md">Platform edukasi dan informasi kesehatan spesialis bedah vaskular & endovaskular terdepan di Indonesia.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-xs">Menu Cepat</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/layanan" className="hover:text-white transition-all">Topik Edukasi</Link></li>
              <li><Link href="/jurnal-vaskular" className="hover:text-white transition-all">Jurnal Vaskular</Link></li>
              <li><Link href="/tim-dokter" className="hover:text-white transition-all">Tim Dokter</Link></li>
              <li><Link href="/kontak" className="hover:text-white transition-all">Hubungi Kami</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-xs">Kontak Resmi</h4>
            <ul className="space-y-3 text-sm">
              <li>Email: admin@sehatvaskular.com</li>
              <li>Telp/WA: 0822-4564-5756</li>
              <li>Lokasi: Surabaya, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-xs">
          © 2026 Sehat Vaskular. All Rights Reserved.
        </div>
      </footer>

      {/* CHATBOT AI */}
      <ChatBot />
    </>
  )
}