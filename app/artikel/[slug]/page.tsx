import { supabase } from '@/lib/supabase' // sesuaikan path import Anda jika masih pakai relative path
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const runtime = 'edge';

// 1. Ubah params menjadi Promise
interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 2. Await params sebelum digunakan
  const resolvedParams = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('seo_title, seo_description, title')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) return { title: 'Not Found' }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description,
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  // 3. Await params sebelum digunakan
  const resolvedParams = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) notFound()

  return (
    <article className="max-w-3xl mx-auto p-8 prose prose-blue lg:prose-xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <time className="text-sm text-gray-500 mb-8 block">
        {new Date(post.published_at).toLocaleDateString('id-ID')}
      </time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}