import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

// OPTIMASI: Cache sitemap selama 1 jam (3600 detik) 
// Agar Googlebot bisa membaca dengan sangat cepat tanpa terus-menerus melakukan query ke Supabase
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sehatvaskular.com'

  // Ambil data artikel dari Supabase
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, published_at, created_at')
    .order('published_at', { ascending: false }); // Urutkan dari yang terbaru

  // Pemetaan URL Artikel Dinamis
  const postUrls: MetadataRoute.Sitemap = posts?.map((post) => {
    // Fallback keamanan: Jika published_at kosong, gunakan created_at atau waktu saat ini
    const dateToUse = post.published_at || post.created_at || new Date().toISOString();
    
    return {
      url: `${baseUrl}/artikel/${post.slug}`,
      lastModified: new Date(dateToUse),
      changeFrequency: 'weekly',
      priority: 0.7, // Prioritas wajar untuk artikel individual
    }
  }) || []

  // Pemetaan Halaman Statis Utama & Layanan Spesifik
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Prioritas mutlak tertinggi (Homepage)
    },
    {
      url: `${baseUrl}/layanan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Menambahkan halaman spesifik layanan (Sangat disukai algoritma Google)
    {
      url: `${baseUrl}/layanan/diabetic-foot`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/layanan/pad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/layanan/varises`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
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
      priority: 0.9, // Tinggi, karena ini adalah arsip pusat edukasi
    },
    {
      url: `${baseUrl}/jurnal-vaskular`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ]

  return [...staticPages, ...postUrls]
}