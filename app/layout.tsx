import './globals.css'
import Link from 'next/link'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Sehat Vaskular | Edukasi Kesehatan Pembuluh Darah',
  description: 'Platform informasi dan edukasi terpercaya seputar kesehatan vaskular dan pembuluh darah.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-800 font-sans antialiased flex flex-col min-h-screen">
        
        {/* Navbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              {/* Logo Dummy - Bisa diganti SVG nanti */}
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                SV
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                Sehat<span className="text-blue-600">Vaskular</span>
              </span>
            </Link>
            <nav className="hidden md:flex gap-8 font-medium text-slate-600">
              <Link href="/" className="hover:text-blue-600 transition">Beranda</Link>
              <Link href="#artikel" className="hover:text-blue-600 transition">Artikel</Link>
              <Link href="#tentang" className="hover:text-blue-600 transition">Tentang Kami</Link>
            </nav>
            {/* Tombol Konsultasi mengarah ke Channel/WA */}
            <a href="https://whatsapp.com/channel/..." target="_blank" rel="noreferrer" className="hidden md:block px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition shadow-md hover:shadow-lg">
              Gabung Channel WA
            </a>
          </div>
        </header>

        {/* Konten Utama */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-20">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">SehatVaskular</h3>
              <p className="text-sm leading-relaxed">Platform edukasi digital yang berdedikasi untuk meningkatkan kesadaran masyarakat tentang pentingnya kesehatan pembuluh darah.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Tautan Penting</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
                <li><Link href="#artikel" className="hover:text-white transition">Daftar Artikel</Link></li>
                <li><Link href="#" className="hover:text-white transition">Kebijakan Privasi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Kontak</h4>
              <p className="text-sm">Email: info@sehatvaskular.com</p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
            &copy; {new Date().getFullYear()} Sehat Vaskular. All rights reserved.
          </div>
        </footer>

      </body>
    </html>
  )
}