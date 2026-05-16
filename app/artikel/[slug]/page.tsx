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

  const defaultHero = "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000"

  return (
    <>
      {/* Header Artikel */}
      <div className="w-full h-[40vh] md:h-[50vh] relative bg-slate-900">
        <img src={defaultHero} alt={post.title} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute bottom-0 w-full">
          <div className="max-w-4xl mx-auto px-6 pb-12">
            <Link href="/" className="text-blue-400 font-medium mb-6 inline-block hover:text-blue-300 transition">
              ← Kembali ke Beranda
            </Link>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
              <span>Tim Medis Sehat Vaskular</span>
              <span>•</span>
              <time>{new Date(post.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </div>
          </div>
        </div>
      </div>

      {/* Konten Artikel */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <article className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-500">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
    </>
  )
}