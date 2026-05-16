import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // PENTING: Ganti dengan domain resmi Anda
  const baseUrl = 'https://sehatvaskular.com' 

  // Ambil data artikel dari Supabase untuk diindeks oleh Google
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, published_at')

  const postUrls = posts?.map((post) => ({
    url: `${baseUrl}/artikel/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  // Daftarkan halaman-halaman statis utama
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1, // Prioritas tertinggi (Beranda)
    },
    {
      url: `${baseUrl}/layanan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tim-dokter`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...postUrls, // Masukkan semua link artikel secara otomatis
  ]
}