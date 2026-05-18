import Link from 'next/link'

export const metadata = {
  title: 'Layanan Vaskular | Sehat Vaskular',
  description: 'Daftar layanan medis spesialis bedah vaskular dan endovaskular.',
}

export default function LayananPage() {
  // Tambahkan 'slug' di setiap layanan agar bisa di-link
  const services = [
    {
      icon: '🩸',
      title: 'Diabetic Foot (Kaki Diabetes)',
      desc: 'Penanganan komprehensif luka diabetes untuk mencegah risiko amputasi dengan teknik revaskularisasi modern.',
      slug: 'diabetic-foot'
    },
    {
      icon: '🫀',
      title: 'Peripheral Artery Disease (PAD)',
      desc: 'Terapi penyumbatan pembuluh darah arteri pada tungkai dan lengan untuk mengembalikan aliran darah.',
      slug: 'pad'
    },
    {
      icon: '🩺',
      title: 'Varises & Gangguan Vena',
      desc: 'Tindakan minimal invasif (Laser/EVLA, Skleroterapi) untuk mengatasi varises yang mengganggu kenyamanan dan kosmetik.',
      slug: 'varises'
    },
    {
      icon: '🧬',
      title: 'Akses Hemodialisa (Cimino)',
      desc: 'Pembuatan dan perawatan akses cuci darah (AV Fistula/Cimino) yang andal untuk pasien gagal ginjal.',
      slug: 'akses-hemodialisa'
    },
    {
      icon: '🚑',
      title: 'Trauma Vaskular',
      desc: 'Penanganan darurat bedah untuk cedera pembuluh darah akibat kecelakaan atau trauma tajam/tumpul.',
      slug: 'trauma-vaskular'
    },
    {
      icon: '🧠',
      title: 'Deep Vein Thrombosis (DVT)',
      desc: 'Penanganan gumpalan darah di vena dalam untuk mencegah komplikasi fatal seperti emboli paru.',
      slug: 'dvt'
    }
  ]

  return (
    <>
      {/* Header Halaman */}
      <div className="bg-svBlue-900 py-20 border-t border-svBlue-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Layanan Medis Kami</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Fokus pada penanganan subspesialis dengan teknologi terkini untuk hasil klinis yang optimal.
          </p>
        </div>
      </div>

      {/* Konten Layanan */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, idx) => (
            <Link key={idx} href={`/layanan/${svc.slug}`} className="block bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-svMaroon-900/30 transition-all duration-300 group">
              <div className="w-16 h-16 bg-slate-100 text-3xl rounded-2xl flex items-center justify-center mb-6 group-hover:bg-svMaroon-900 group-hover:scale-110 transition-transform">
                {svc.icon}
              </div>
              <h3 className="text-2xl font-bold text-svBlue-900 mb-4 group-hover:text-svMaroon-800 transition-colors">{svc.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{svc.desc}</p>
              <span className="text-sm font-bold text-svBlue-900 group-hover:text-svMaroon-800 flex items-center gap-2">
                Pelajari Lebih Lanjut →
              </span>
            </Link>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <Link href="/kontak" className="inline-flex items-center gap-2 px-8 py-4 bg-svMaroon-900 text-white font-bold rounded-full hover:bg-svMaroon-800 transition shadow-lg shadow-svMaroon-900/30">
            Konsultasikan Kondisi Anda →
          </Link>
        </div>
      </section>
    </>
  )
}