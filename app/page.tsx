import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

export default async function Home() {
  // Mengambil data dari Supabase (batasi 6 artikel terbaru untuk beranda)
  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, excerpt, published_at')
    .order('published_at', { ascending: false })
    .limit(6)

  // Fallback gambar dummy dari Unsplash
  const heroImage = "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000"
  const defaultThumbnail = "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800"

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* Menggunakan elemen img biasa untuk kemudahan bypass konfigurasi Next.js Image domain */}
          <img src={heroImage} alt="Medical Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <span className="px-4 py-1.5 bg-blue-500/30 border border-blue-400/50 rounded-full text-blue-100 text-sm font-semibold tracking-wide mb-6 backdrop-blur-sm">
            Edukasi Medis Terpercaya
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Jaga Kesehatan <br className="hidden md:block" />
            <span className="text-blue-300">Pembuluh Darah Anda</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-10 leading-relaxed">
            Temukan panduan lengkap, artikel informatif, dan tips medis untuk mencegah penyakit vaskular sedini mungkin.
          </p>
          <a href="#artikel" className="px-8 py-4 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-200">
            Mulai Membaca
          </a>
        </div>
      </section>

      {/* SECTION ARTIKEL TERBARU */}
      <section id="artikel" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Artikel Terbaru</h2>
            <p className="text-slate-500 mt-2">Update informasi medis seputar kesehatan vaskular.</p>
          </div>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.slug} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col">
                <div className="relative h-56 overflow-hidden bg-slate-200">
                  <img 
                    src={defaultThumbnail} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-blue-700">
                    Kesehatan
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <time className="text-xs font-medium text-slate-400 mb-3 block uppercase tracking-wider">
                    {new Date(post.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  <Link href={`/artikel/${post.slug}`} className="group-hover:text-blue-600 transition-colors">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {post.excerpt || "Baca selengkapnya mengenai topik kesehatan pembuluh darah ini untuk mengetahui cara pencegahan dan penanganannya."}
                  </p>
                  <Link href={`/artikel/${post.slug}`} className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                    Baca Artikel <span>→</span>
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-500 bg-slate-100 rounded-2xl border border-dashed border-slate-300">
              Belum ada artikel. Silakan tambahkan data di Supabase.
            </div>
          )}
        </div>
      </section>
    </>
  )
}