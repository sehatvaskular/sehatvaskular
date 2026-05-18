'use client'

import { useState } from 'react'
import FadeIn from '@/components/FadeIn'
// Menggunakan ikon generik standar yang 100% dijamin ada di semua versi lucide-react
import { Camera, Smartphone, Video, Users, Send, Terminal, MessageSquare } from 'lucide-react'

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
      handle: 'const ig = "@sehatvaskular"',
      url: 'https://instagram.com/sehatvaskular',
      icon: <Camera size={28} strokeWidth={1.5} />, // Ikon Kamera
      color: 'from-purple-600 via-pink-500 to-yellow-500',
      desc: 'Dapatkan infografis harian, tips cepat pembuluh darah, dan cuplikan video edukasi.'
    },
    {
      name: 'TikTok',
      handle: 'let tiktok = "@sehatvaskular"',
      url: 'https://tiktok.com/@sehatvaskular',
      icon: <Smartphone size={28} strokeWidth={1.5} />, // Ikon Smartphone
      color: 'from-slate-900 via-stone-800 to-black',
      desc: 'Tonton video penjelasan singkat dan interaktif langsung dari tim dokter spesialis.'
    },
    {
      name: 'YouTube',
      handle: 'var yt = "Sehat Vaskular"',
      url: 'https://youtube.com/@sehatvaskular',
      icon: <Video size={28} strokeWidth={1.5} />, // Ikon Video/Player
      color: 'from-red-600 to-rose-700',
      desc: 'Saksikan video edukasi mendalam, rekaman simposium medis, dan bincang sehat.'
    },
    {
      name: 'Facebook',
      handle: 'fb.init("Sehat Vaskular")',
      url: 'https://facebook.com/sehatvaskular',
      icon: <Users size={28} strokeWidth={1.5} />, // Ikon Komunitas/Grup
      color: 'from-blue-600 to-blue-800',
      desc: 'Bergabunglah dengan komunitas literasi kesehatan pembuluh darah terbesar di Indonesia.'
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
              <Terminal size={14} />
              <span>CONNECT_WITH_US</span>
            </div>
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
            <div className="lg:col-span-5 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl order-2 lg:order-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-svMaroon-800 to-red-400"></div>
              
              <FadeIn direction="up">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare size={28} className="text-svMaroon-800" />
                  <h2 className="text-2xl font-bold text-svBlue-900">Direct Message</h2>
                </div>
                <p className="text-slate-500 text-sm mb-8 font-mono">{'//'} Punya pertanyaan medis? Hubungi kami.</p>
                
                <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-svBlue-900 uppercase tracking-wider mb-2 font-mono">{'<'}Nama_Lengkap {'/>'}</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 focus:bg-white transition text-sm font-medium" 
                      placeholder="Input_String..." 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-svBlue-900 uppercase tracking-wider mb-2 font-mono">{'<'}Nomor_WhatsApp {'/>'}</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 focus:bg-white transition text-sm font-medium font-mono" 
                      placeholder="Input_Number..." 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-svBlue-900 uppercase tracking-wider mb-2 font-mono">{'<'}Isi_Pesan {'/>'}</label>
                    <textarea 
                      rows={5} 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 focus:bg-white transition text-sm font-medium" 
                      placeholder="Input_Text_Area..." 
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="w-full py-4 bg-svBlue-900 text-white font-bold rounded-xl hover:bg-svMaroon-800 transition-all duration-300 shadow-lg shadow-svBlue-900/20 text-sm tracking-wide mt-4 flex justify-center items-center gap-2 group">
                    <span>Execute Send</span>
                    <Send size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </FadeIn>
            </div>

            {/* JALUR KIRI: GRID MEDIA SOSIAL RESMI */}
            <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
              <FadeIn delay={0.2} direction="up">
                <div>
                  <h2 className="text-3xl font-black text-svBlue-900 mb-2">Saluran Resmi Platform</h2>
                  <p className="text-slate-600 font-medium font-mono text-sm">root@sehatvaskular:~# list_social_networks</p>
                </div>
              </FadeIn>

              <div className="grid sm:grid-cols-2 gap-6">
                {socialMedia.map((soc, idx) => (
                  <FadeIn key={idx} delay={0.1 * (idx + 1)} direction="up">
                    <a 
                      href={soc.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="group block bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-svMaroon-800/50 transition-all duration-300 h-full flex flex-col justify-between overflow-hidden relative"
                    >
                      <div className="absolute left-0 top-0 w-1 h-full bg-slate-100 group-hover:bg-svMaroon-600 transition-colors"></div>
                      
                      <div className="pl-2">
                        <div className={`w-12 h-12 bg-linear-to-tr ${soc.color} rounded-xl flex items-center justify-center shadow-md text-white mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                          {soc.icon}
                        </div>
                        <h3 className="text-xl font-bold text-svBlue-900 group-hover:text-svMaroon-800 transition-colors mb-2">
                          {soc.name}
                        </h3>
                        <p className="text-xs font-mono font-bold text-slate-500 bg-slate-100 py-1 px-2 rounded-md inline-block mb-3 border border-slate-200">
                          {soc.handle}
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {soc.desc}
                        </p>
                      </div>
                      <div className="pl-2 text-xs font-mono font-bold text-svBlue-900 group-hover:text-svMaroon-800 transition-colors flex items-center gap-1.5 mt-6 pt-4 border-t border-slate-100">
                        sudo open {soc.name.toLowerCase()} <span className="transform group-hover:translate-x-1 transition-transform">_</span>
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