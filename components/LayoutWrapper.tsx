'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ReactNode } from 'react'
import ChatBot from './ChatBot'

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  // Jika URL adalah /admin, jangan tampilkan Header, Footer & ChatBot Publik
  if (isAdmin) {
    return <>{children}</>
  }

  // Jika web publik biasa, tampilkan Header, Footer, & ChatBot
  return (
    <>
      <header className="bg-svBlue-900 sticky top-0 z-50 border-b-4 border-svMaroon-900 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="Logo Sehat Vaskular" 
              className="h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity" 
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x50?text=Logo+Sehat+Vaskular' }} // Fallback jika logo belum di-upload
            />
          </Link>

          <nav className="hidden lg:flex gap-6 xl:gap-8 font-medium text-slate-300 items-center">
  <Link href="/" className="hover:text-white hover:underline decoration-svMaroon-600 decoration-2 underline-offset-8 transition-all">Beranda</Link>
  
  {/* Dropdown Edukasi */}
  <div className="relative group py-6">
    <Link href="/layanan" className="flex items-center gap-1 hover:text-white hover:underline decoration-svMaroon-600 decoration-2 underline-offset-8 transition-all">
      Edukasi <span className="text-xs">▼</span>
    </Link>
    {/* ... isi dropdown biarkan tetap sama ... */}
  </div>

  {/* TAMBAHKAN MENU ARTIKEL DI SINI */}
  <Link href="/artikel" className={`hover:text-white hover:underline decoration-svMaroon-600 decoration-2 underline-offset-8 transition-all ${pathname === '/artikel' ? 'text-white underline' : ''}`}>
    Artikel
  </Link>
  
  <Link href="/tim-dokter" className="hover:text-white hover:underline decoration-svMaroon-600 decoration-2 underline-offset-8 transition-all">Tim Dokter</Link>
  <Link href="/kontak" className="hover:text-white hover:underline decoration-svMaroon-600 decoration-2 underline-offset-8 transition-all">Kontak</Link>
</nav>

          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-svMaroon-800 text-white font-semibold rounded-full hover:bg-svMaroon-900 transition shadow-lg shadow-svMaroon-900/30">
            <span>Tanya Admin</span>
            <span>→</span>
          </a>
        </div>
      </header>

      {/* Perbaikan Tailwind: flex-grow diubah menjadi grow */}
      <main className="grow">
        {children}
      </main>

      <footer className="bg-svBlue-900 text-slate-400 py-16 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
            <div className="flex items-center mb-6">
               <img 
                 src="/logo.png" 
                 alt="Logo Sehat Vaskular Footer" 
                 className="h-12 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" 
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

      {/* CHATBOT AI - Muncul melayang di seluruh halaman publik */}
      <ChatBot />
    </>
  )
}