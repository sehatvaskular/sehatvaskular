import type { Metadata } from 'next' // <-- Perbaikan: Wajib mengimpor tipe Metadata agar tidak error
import { Plus_Jakarta_Sans } from 'next/font/google' // <-- Tambahan: Menggunakan font modern agar website lebih rapi
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'

// Konfigurasi font Plus Jakarta Sans
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

// OPTIMASI SEO GLOBAL UNTUK MENGUSIR JEJAK JUDOL
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
    <html lang="id" className={`scroll-smooth ${jakartaSans.variable}`}>
      <body className="bg-slate-50 text-slate-800 font-sans antialiased flex flex-col min-h-screen">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}