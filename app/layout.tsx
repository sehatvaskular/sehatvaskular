import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'

export const metadata = {
  title: 'Sehat Vaskular | Platform Edukasi Vaskular',
  description: 'Pusat informasi dan penanganan medis masalah pembuluh darah dan vaskular.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-800 font-sans antialiased flex flex-col min-h-screen">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}