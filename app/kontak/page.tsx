import FadeIn from '@/components/FadeIn'

export const metadata = {
  title: 'Hubungi Kami | Sehat Vaskular',
  description: 'Terhubung bersama Sehat Vaskular melalui jaringan media sosial resmi dan layanan konsultasi kami.',
}

export default function KontakPage() {
  const socialMedia = [
    {
      name: 'Instagram',
      handle: '@sehatvaskular',
      url: 'https://instagram.com/sehatvaskular',
      icon: '📸',
      color: 'from-purple-600 via-pink-500 to-yellow-500',
      desc: 'Dapatkan infografis harian, tips cepat pembuluh darah, dan cuplikan video edukasi interaktif.'
    },
    {
      name: 'TikTok',
      handle: '@sehatvaskular',
      url: 'https://tiktok.com/@sehatvaskular',
      icon: '🎵',
      color: 'from-slate-900 via-stone-800 to-black',
      desc: 'Tonton video penjelasan singkat dan interaktif langsung dari tim dokter spesialis vaskular.'
    },
    {
      name: 'YouTube',
      handle: 'Sehat Vaskular',
      url: 'https://youtube.com/@sehatvaskular',
      icon: '📺',
      color: 'from-red-600 to-rose-700',
      desc: 'Saksikan video edukasi mendalam, rekaman simposium medis, dan bincang sehat vaskular lengkap.'
    },
    {
      name: 'Facebook',
      handle: 'Sehat Vaskular',
      url: 'https://facebook.com/sehatvaskular',
      icon: '👥',
      color: 'from-blue-600 to-blue-800',
      desc: 'Bergabunglah dengan komunitas literasi kesehatan pembuluh darah terbesar di Indonesia.'
    }
  ]

  return (
    <>
      {/* HEADER HALAMAN */}
      <div className="bg-svBlue-900 py-20 border-t border-svBlue-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-svMaroon-800 rounded-full blur-[120px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <FadeIn direction="up">
            <span className="inline-block py-1 px-3 rounded-full bg-svMaroon-900/40 border border-svMaroon-600 text-red-200 text-xs font-bold tracking-widest uppercase mb-4">
              CONNECT WITH US
            </span>
          </FadeIn>
          <FadeIn delay={0.2} direction="up">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Hubungi & Ikuti Kami</h1>
          </FadeIn>
          <FadeIn delay={0.4} direction="up">
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Kami hadir lebih dekat di berbagai platform media sosial untuk menyajikan konten literasi kesehatan pembuluh darah terbaik.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* JALUR KANAN: FORMULIR HUBUNGI ADMIN */}
            <div className="lg:col-span-5 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl order-2 lg:order-1">
              <FadeIn direction="up">
                <h2 className="text-2xl font-bold text-svBlue-900 mb-2">Kirim Pesan Langsung</h2>
                <p className="text-slate-500 text-sm mb-8">Punya pertanyaan seputar layanan atau kerja sama edukasi? Hubungi tim responsif kami.</p>
                
                <form className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-svBlue-900 uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 focus:bg-white transition text-sm font-medium" placeholder="Contoh: Budi Santoso" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-svBlue-900 uppercase tracking-wider mb-2">Nomor WhatsApp / HP</label>
                    <input type="tel" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 focus:bg-white transition text-sm font-medium" placeholder="Contoh: 0812345678xx" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-svBlue-900 uppercase tracking-wider mb-2">Isi Pesan / Pertanyaan</label>
                    <textarea rows={5} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 focus:bg-white transition text-sm font-medium" placeholder="Tuliskan pesan Anda secara mendetail di sini..." required></textarea>
                  </div>
                  
                  <button type="submit" className="w-full py-4 bg-svMaroon-800 text-white font-bold rounded-xl hover:bg-svMaroon-900 transition shadow-lg shadow-svMaroon-900/30 text-sm tracking-wide mt-4">
                    Kirim Pesan ke WhatsApp Admin →
                  </button>
                </form>
              </FadeIn>
            </div>

            {/* JALUR KIRI: GRID MEDIA SOSIAL RESMI */}
            <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
              <FadeIn delay={0.2} direction="up">
                <div>
                  <h2 className="text-3xl font-black text-svBlue-900 mb-2">Saluran Resmi @sehatvaskular</h2>
                  <p className="text-slate-600 font-medium">Klik pada salah satu platform di bawah ini untuk terhubung dan mendapatkan update konten harian langsung dari dokter spesialis.</p>
                </div>
              </FadeIn>

              <div className="grid sm:grid-cols-2 gap-6">
                {socialMedia.map((soc, idx) => (
                  <FadeIn key={idx} delay={0.1 * (idx + 1)} direction="up">
                    <a 
                      href={soc.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="group block bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-svMaroon-800/30 transition-all duration-300 h-full flex flex-col justify-between"
                    >
                      <div>
                        {/* Efek Lingkaran Gradasi Ikon */}
                        <div className={`w-14 h-14 bg-linear-to-tr ${soc.color} rounded-2xl flex items-center justify-center text-2xl shadow-md text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                          {soc.icon}
                        </div>
                        <h3 className="text-xl font-bold text-svBlue-900 group-hover:text-svMaroon-800 transition-colors mb-1">
                          {soc.name}
                        </h3>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                          {soc.handle}
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {soc.desc}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-svBlue-900 group-hover:text-svMaroon-800 transition-colors flex items-center gap-1.5 mt-6 pt-4 border-t border-slate-100">
                        Kunjungi {soc.name} <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </a>
                  </FadeIn>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}