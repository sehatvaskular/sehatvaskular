import { supabase } from '@/lib/supabase'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const runtime = 'edge';;

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: post } = await supabase
    .from('posts')
    .select('seo_title, seo_description, title')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) return { title: 'Not Found' }

  return {
    title: `${post.seo_title || post.title} | Sehat Vaskular`,
    description: post.seo_description,
  }
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) notFound()

  // Gambar default
  const heroImage = post.image_url || post.feature_image || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000"

  // Ambil tanggal publish
  const dateToDisplay = post.published_at || post.created_at || new Date().toISOString();

  return (
    <main className="min-h-screen bg-white py-8 md:py-12">
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tombol Kembali */}
        <div className="mb-6">
          <Link 
            href="/artikel" 
            className="text-slate-500 font-medium hover:text-slate-900 transition inline-flex items-center gap-2 text-sm"
          >
            &larr; Kembali
          </Link>
        </div>

        {/* Gambar Utama (Hero Image) diletakkan paling atas */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] mb-8 md:mb-12 rounded-[2rem] overflow-hidden bg-slate-100 group">
          <img 
            src={heroImage} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
          />
        </div>

        {/* Layout Utama Artikel (Dua Kolom di Desktop) */}
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Kolom Kiri: Sidebar Meta & Interaksi (Sticky) */}
          <aside className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <div className="sticky top-12">
              
              {/* Profil Penulis & Tanggal */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {/* Placeholder Avatar Logo/Inisial */}
                  <span className="text-slate-600 font-bold text-lg">SV</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">Tim Medis <br/> Sehat Vaskular</h3>
                  <time className="text-xs text-slate-500 mt-1 block" dateTime={dateToDisplay}>
                    {new Date(dateToDisplay).toLocaleDateString('id-ID', { 
                      year: 'numeric', month: 'short', day: 'numeric' 
                    })}
                  </time>
                </div>
              </div>

              {/* Garis Pemisah */}
              <hr className="border-slate-100 mb-6" />

              {/* Tombol Interaksi ala Pinterest (Hati, Komentar, Share, Save) */}
              <div className="flex items-center gap-4 text-slate-500">
                {/* Like */}
                <button className="hover:text-red-500 transition hover:bg-red-50 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
                {/* Comment */}
                <button className="hover:text-blue-500 transition hover:bg-blue-50 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                </button>
                {/* Share */}
                <button className="hover:text-emerald-500 transition hover:bg-emerald-50 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                </button>
                {/* Spacer */}
                <div className="flex-grow"></div>
                {/* Save/Bookmark */}
                <button className="hover:text-slate-900 transition hover:bg-slate-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
              </div>

            </div>
          </aside>

          {/* Kolom Kanan: Judul & Konten Artikel */}
          <div className="flex-1 order-1 lg:order-2">
            
            {/* Judul Artikel */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-8 tracking-tight">
              {post.title}
            </h1>

            {/* Konten Artikel dari n8n */}
            <div 
              className="prose prose-slate prose-lg max-w-none
                         prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 
                         prose-p:text-slate-700 prose-p:leading-relaxed 
                         prose-a:text-blue-600 hover:prose-a:text-blue-500 transition-colors
                         prose-img:rounded-2xl prose-img:shadow-sm prose-img:w-full
                         prose-li:text-slate-700"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </div>

        </div>

      </article>
    </main>
  )
}