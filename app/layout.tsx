import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'

// Konfigurasi font Plus Jakarta Sans
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

// OPTIMASI SEO GLOBAL & VERIFIKASI LOGO SITES
export const metadata: Metadata = {
  metadataBase: new URL('https://sehatvaskular.com'), 
  title: {
    default: 'Sehat Vaskular | Platform Edukasi Bedah Vaskular Indonesia',
    template: '%s | Sehat Vaskular'
  },
  description: 'Pusat informasi, edukasi, dan penanganan medis subspesialis bedah vaskular & endovaskular terdepan di Indonesia. Dapatkan solusi medis kaki diabetes, varises, dan akses cuci darah.',
  keywords: ['bedah vaskular', 'varises', 'kaki diabetes', 'akses cuci darah', 'dokter bedah vaskular indonesia', 'kesehatan pembuluh darah', 'DVT', 'PAD'],
  authors: [{ name: 'Tim Dokter Sehat Vaskular' }],
  creator: 'Sehat Vaskular',
  publisher: 'Sehat Vaskular',
  
  // Konfigurasi Favicon / Logo Tab & Google Search Icon
  icons: {
    icon: [
      { url: '/logoICO.png', type: 'image/png' },
    ],
    shortcut: '/logoICO.png',
    apple: '/logoICO.png',
  },

  openGraph: {
    title: 'Sehat Vaskular | Edukasi Kesehatan Pembuluh Darah',
    description: 'Platform edukasi kesehatan spesialis bedah vaskular & endovaskular terpercaya di Indonesia.',
    url: 'https://sehatvaskular.com',
    siteName: 'Sehat Vaskular',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Sehat Vaskular Logo',
      }
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${jakartaSans.className} bg-slate-50 text-slate-800 antialiased flex flex-col min-h-screen`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}