import Link from 'next/link'
import FadeIn from '@/components/FadeIn'

export default function NotFound() {
  return (
    <main className="min-h-[80vh] bg-slate-50 flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn direction="up">
          
          {/* Ikon Medis */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-svMaroon-900/10 text-svMaroon-800 rounded-full flex items-center justify-center text-4xl shadow-inner">
              🩺
            </div>
          </div>

          {/* Teks 404 */}
          <h1 className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-svBlue-900 to-svBlue-800 mb-4 tracking-tighter drop-shadow-sm">
            404
          </h1>
          
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Aliran Terputus
          </h2>
          
          {/* Deskripsi Tema Vaskular */}
          <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-lg mx-auto font-medium">
            Maaf, rute yang Anda tuju sepertinya sedang tersumbat atau halaman ini sudah dipindahkan. Mari kembali ke jalur utama informasi vaskular.
          </p>
          
          {/* Tombol Navigasi */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="px-8 py-4 bg-svBlue-900 text-white font-bold rounded-full hover:bg-svBlue-800 transition-all duration-300 w-full sm:w-auto shadow-lg shadow-svBlue-900/20 hover:shadow-xl hover:-translate-y-1"
            >
              Kembali ke Beranda
            </Link>
            <Link 
              href="/artikel" 
              className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-full hover:border-svMaroon-600 hover:text-svMaroon-700 transition-all duration-300 w-full sm:w-auto hover:-translate-y-1"
            >
              Baca Artikel Edukasi
            </Link>
          </div>

        </FadeIn>
      </div>
    </main>
  )
}