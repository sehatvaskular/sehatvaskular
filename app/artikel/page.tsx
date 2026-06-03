import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import FadeIn from '@/components/FadeIn'

export const runtime = 'nodejs'; // Wajib untuk Cloudflare
export const revalidate = 60;

export default async function DaftarArtikel() {
  // Ambil semua artikel dari Supabase
  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, excerpt, published_at, image_url')
    .order('published_at', { ascending: false });

  const defaultThumbnail = "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-svBlue-900 mb-4">Artikel & Edukasi</h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Kumpulan informasi medis terpercaya mengenai kesehatan pembuluh darah dari tim pakar Sehat Vaskular.
            </p>
          </div>
        </FadeIn>

        {(!posts || posts.length === 0) ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200">
            Belum ada artikel yang diterbitkan saat ini.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <FadeIn key={post.slug} delay={0.1 * index} direction="up">
                <article className="group cursor-pointer bg-white rounded-3xl p-4 border border-slate-100 hover:shadow-xl transition h-full flex flex-col">
                  <div className="h-48 rounded-2xl bg-slate-200 mb-6 overflow-hidden relative">
                    <img 
                      src={post.image_url || defaultThumbnail} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="px-2 flex flex-col grow">
                    <time className="text-xs font-bold text-svMaroon-800 mb-3 block uppercase tracking-wider">
                      {new Date(post.published_at).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </time>
                    <Link href={`/artikel/${post.slug}`}>
                      <h2 className="text-xl font-bold text-svBlue-900 mb-3 group-hover:text-svMaroon-800 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 grow">
                      {post.excerpt || "Baca selengkapnya mengenai topik kesehatan vaskular ini."}
                    </p>
                    <Link href={`/artikel/${post.slug}`} className="text-svBlue-900 font-semibold text-sm flex items-center gap-2 mt-auto group-hover:text-svMaroon-800 transition-colors">
                      Baca Selengkapnya →
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}