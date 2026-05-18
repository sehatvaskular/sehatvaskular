'use client'

import { useState } from 'react'
import FadeIn from '@/components/FadeIn'
import { Camera, Film, PlayCircle, Users, Send, PhoneCall, MessageSquare } from 'lucide-react'

export default function KontakPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetNumber = '6282245645756'
    const waText = `Halo Admin Sehat Vaskular, saya ingin bertanya/berkonsultasi.%0A%0A*Nama:* ${name}%0A*No. HP/WA:* ${phone}%0A*Pesan:*%0A${message}`
    window.open(`https://wa.me/${targetNumber}?text=${waText}`, '_blank')
    setName('')
    setPhone('')
    setMessage('')
  }

  const socialMedia = [
    {
      name: 'Instagram',
      handle: '@sehatvaskular',
      url: 'https://instagram.com/sehatvaskular',
      icon: <Camera size={26} strokeWidth={1.5} />,
      desc: 'Infografis harian, tips kesehatan pembuluh darah, dan cuplikan edukasi interaktif.'
    },
    {
      name: 'TikTok',
      handle: '@sehatvaskular',
      url: 'https://tiktok.com/@sehatvaskular',
      icon: <Film size={26} strokeWidth={1.5} />,
      desc: 'Video penjelasan singkat dan interaktif langsung dari tim dokter spesialis vaskular.'
    },
    {
      name: 'YouTube',
      handle: 'Sehat Vaskular',
      url: 'https://youtube.com/@sehatvaskular',
      icon: <PlayCircle size={26} strokeWidth={1.5} />,
      desc: 'Video edukasi mendalam, rekaman simposium medis, dan bincang sehat komprehensif.'
    },
    {
      name: 'Facebook',
      handle: 'Sehat Vaskular',
      url: 'https://facebook.com/sehatvaskular',
      icon: <Users size={26} strokeWidth={1.5} />,
      desc: 'Komunitas diskusi dan literasi kesehatan pembuluh darah terbesar di Indonesia.'
    }
  ]

  return (
    <>
      {/* HEADER HALAMAN */}
      <div className="bg-svBlue-900 py-20 border-t border-svBlue-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-svMaroon-800 rounded-full blur-[120px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          <FadeIn direction="up">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-svMaroon-900/40 border border-svMaroon-600 text-red-200 text-xs font-bold tracking-widest uppercase mb-6">
              <PhoneCall size={14} />
              <span>LAYANAN INFORMASI & KONSULTASI</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} direction="up">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Hubungi Kami</h1>
          </FadeIn>
          <FadeIn delay={0.4} direction="up">
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Tim Sehat Vaskular siap membantu menjawab pertanyaan Anda dan memfasilitasi kebutuhan edukasi kesehatan pembuluh darah.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* JALUR KANAN: FORMULIR HUBUNGI ADMIN */}
            <div className="lg:col-span-5 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl order-2 lg:order-1 relative overflow-hidden">
              <FadeIn direction="up">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-svMaroon-900/10 flex items-center justify-center text-svMaroon-800">
                    <MessageSquare size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-svBlue-900">Kirim Pesan</h2>
                </div>
                <p className="text-slate-500 text-sm mb-8 mt-2">Isi formulir di bawah ini untuk terhubung langsung dengan layanan WhatsApp admin kami.</p>
                
                <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-svBlue-900 uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 focus:bg-white transition text-sm" 
                      placeholder="Masukkan nama lengkap Anda" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-svBlue-900 uppercase tracking-wider mb-2">Nomor WhatsApp</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 focus:bg-white transition text-sm" 
                      placeholder="Contoh: 0812345678xx" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-svBlue-900 uppercase tracking-wider mb-2">Pesan & Pertanyaan</label>
                    <textarea 
                      rows={5} 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 focus:bg-white transition text-sm" 
                      placeholder="Tuliskan pertanyaan medis atau keperluan Anda di sini..." 
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="w-full py-4 bg-svMaroon-800 text-white font-bold rounded-xl hover:bg-svMaroon-900 transition-all duration-300 shadow-lg shadow-svMaroon-900/30 text-sm tracking-wide mt-4 flex justify-center items-center gap-2 group">
                    <span>Kirim via WhatsApp</span>
                    <Send size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </FadeIn>
            </div>

            {/* JALUR KIRI: GRID MEDIA SOSIAL RESMI */}
            <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
              <FadeIn delay={0.2} direction="up">
                <div>
                  <h2 className="text-3xl font-black text-svBlue-900 mb-3">Jejaring Sosial Kami</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Dapatkan edukasi medis terpercaya seputar kesehatan pembuluh darah secara rutin melalui berbagai kanal resmi Sehat Vaskular.
                  </p>
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
                      <div className="pl-2">
                        {/* Ikon dengan warna DNA brand yang menyatu */}
                        <div className="w-14 h-14 bg-svBlue-900/5 group-hover:bg-svMaroon-800 rounded-2xl flex items-center justify-center text-svBlue-900 group-hover:text-white mb-6 transition-colors duration-300">
                          {soc.icon}
                        </div>
                        <h3 className="text-xl font-bold text-svBlue-900 group-hover:text-svMaroon-800 transition-colors mb-1">
                          {soc.name}
                        </h3>
                        <p className="text-sm font-semibold text-slate-500 mb-3">
                          {soc.handle}
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {soc.desc}
                        </p>
                      </div>
                      <div className="pl-2 text-sm font-bold text-svBlue-900 group-hover:text-svMaroon-800 transition-colors flex items-center gap-1.5 mt-6 pt-4 border-t border-slate-100">
                        Kunjungi Halaman <span className="transform group-hover:translate-x-1 transition-transform">→</span>
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