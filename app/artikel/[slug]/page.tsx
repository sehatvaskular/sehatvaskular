import { supabase } from '@/lib/supabase'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const runtime = 'edge';

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

  // Gambar default jika dari n8n tidak mengirim URL gambar (bisa disesuaikan dengan kolom gambar di database Anda)
  const heroImage = post.image_url || post.feature_image || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000"

  // Ambil tanggal publish, jika null gunakan waktu saat ini atau created_at
  const dateToDisplay = post.published_at || post.created_at || new Date().toISOString();

  return (
    <main className="min-h-screen bg-[#fafafa] py-12 md:py-20">
      <article className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Tombol Kembali */}
        <div className="mb-8 text-center">
          <Link 
            href="/artikel" 
            className="text-blue-600 font-medium hover:text-blue-500 transition inline-flex items-center gap-2"
          >
            &larr; Kembali ke Artikel
          </Link>
        </div>

        {/* Header Artikel (Judul & Meta) */}
        <header className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center space-x-3 text-sm text-slate-500 font-medium">
            <span>Tim Medis Sehat Vaskular</span>
            <span className="text-slate-300">•</span>
            <time dateTime={dateToDisplay}>
              {new Date(dateToDisplay).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
          </div>
        </header>

        {/* Gambar Utama (Hero Image) Ala Pinterest */}
        <div className="relative w-full aspect-video md:aspect-[21/9] mb-16 rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 bg-white group">
          {/* Menggunakan tag <img> standar untuk menghindari error Next Config jika image dari sumber eksternal */}
          <img 
            src={heroImage} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
          />
        </div>

        {/* Konten Artikel (Dari n8n) */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 max-w-3xl mx-auto">
          <div 
            className="prose prose-slate prose-lg md:prose-xl mx-auto 
                       prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 
                       prose-p:text-slate-700 prose-p:leading-relaxed 
                       prose-a:text-blue-600 hover:prose-a:text-blue-500 transition-colors
                       prose-img:rounded-2xl prose-img:shadow-md
                       prose-li:text-slate-700"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>

      </article>
    </main>
  )
}