import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Ganti dengan domain asli Anda nanti jika sudah ada
  const baseUrl = 'https://sehatvaskular.com' 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Blokir robot Google agar tidak mengindeks halaman Admin dan API rahasia
      disallow: ['/admin/', '/api/'], 
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}