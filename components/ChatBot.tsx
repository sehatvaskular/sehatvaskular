'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, User, Bot, Loader2, ArrowRight } from 'lucide-react'

type Message = { role: 'user' | 'bot'; content: string }

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'register' | 'chat'>('register')
  
  // Data Form
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fungsi saat form registrasi di-submit
  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    
    setStep('chat')
    setMessages([
      { role: 'bot', content: `Halo Kak **${name}**! 👋<br/><br/>Saya Asisten AI Sehat Vaskular. Ada yang bisa saya bantu terkait informasi kesehatan pembuluh darah Anda hari ini?` }
    ])
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(1),
          userName: name // Kirim nama ke AI
        }),
      })

      const data = await res.json()
      if (data.reply) {
        let aiReply = data.reply

        // LOGIKA INTERCEPTOR: Cari kode [HANDOFF_WA: ...] dari AI
        const handoffRegex = /\[HANDOFF_WA:\s*(.*?)\]/i
        const match = aiReply.match(handoffRegex)

        if (match) {
          const summary = match[1] // Ambil teks ringkasannya
          
          // Susun pesan WA dan encode agar spasi & enter aman di URL
          const waMessage = `Halo Admin Sehat Vaskular, saya ${name} (${phone}).\n\n*Kesimpulan Chat AI:*\n_${summary}_\n\nSaya ingin berkonsultasi lebih lanjut.`
          const encodedWaMessage = encodeURIComponent(waMessage)
          const waLink = `https://wa.me/6281234567890?text=${encodedWaMessage}`

          // Buat tombol HTML
          const htmlButton = `<br><br><a href="${waLink}" target="_blank" style="display: flex; align-items: center; justify-content: center; background-color: #991b1b; color: white; padding: 12px 16px; border-radius: 99px; text-decoration: none; font-weight: bold; font-size: 13px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">📱 Lanjut Chat Admin via WA</a>`

          // Hapus kode [HANDOFF_WA] dari teks dan ganti dengan tombol
          aiReply = aiReply.replace(handoffRegex, htmlButton)
        }

        setMessages(prev => [...prev, { role: 'bot', content: aiReply }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Maaf, jaringan saya sedang sibuk. Silakan coba lagi.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* TOMBOL MENGAPUNG */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-svMaroon-800 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-svMaroon-900 hover:scale-110 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle size={28} />
      </button>

      {/* JENDELA CHAT */}
      <div className={`fixed bottom-6 right-6 w-[85vw] sm:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden z-50 transition-all origin-bottom-right duration-300 border border-slate-200 flex flex-col ${isOpen ? 'scale-100 opacity-100 h-[550px] max-h-[85vh]' : 'scale-0 opacity-0 h-0 invisible'}`}>
        
        {/* HEADER CHAT */}
        <div className="bg-svBlue-900 p-4 flex items-center justify-between text-white shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-svMaroon-800 rounded-full flex items-center justify-center font-bold border-2 border-white/20">SV</div>
            <div>
              <h3 className="font-bold leading-none">SeVa AI</h3>
              <p className="text-[10px] text-slate-300 mt-1">Sehat Vaskular Customer Care</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white transition bg-white/10 w-8 h-8 flex items-center justify-center rounded-full">
            <X size={18} />
          </button>
        </div>

        {/* KONDISI 1: FORM REGISTRASI AWAL */}
        {step === 'register' ? (
          <div className="flex-1 p-6 flex flex-col justify-center bg-slate-50">
            <div className="text-center mb-6">
              <Bot size={48} className="mx-auto text-svMaroon-800 mb-4" />
              <h4 className="text-lg font-bold text-svBlue-900 mb-2">Selamat Datang!</h4>
              <p className="text-sm text-slate-500">Silakan isi data singkat berikut agar asisten kami dapat mengenali Anda.</p>
            </div>
            <form onSubmit={handleStartChat} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-svBlue-900 mb-1 ml-1">Nama Panggilan</label>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 text-sm" placeholder="Contoh: Budi" />
              </div>
              <div>
                <label className="block text-xs font-bold text-svBlue-900 mb-1 ml-1">Nomor WhatsApp</label>
                <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} required className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 text-sm" placeholder="Contoh: 081234567890" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-svMaroon-800 text-white font-bold rounded-2xl hover:bg-svMaroon-900 transition flex justify-center items-center gap-2 mt-2">
                Mulai Chat <ArrowRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          /* KONDISI 2: AREA PESAN CHAT */
          <>
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-5">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-svBlue-900 text-white' : 'bg-svMaroon-800 text-white'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-svBlue-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                    {/* Render teks yang bisa berisi tag HTML link WA */}
                    <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-svMaroon-800 text-white flex items-center justify-center shrink-0"><Bot size={14} /></div>
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none"><Loader2 size={16} className="animate-spin text-svMaroon-800" /></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AREA INPUT CHAT */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 bg-slate-100 px-4 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-svBlue-900 transition"
                disabled={isLoading}
              />
              <button type="submit" disabled={!input.trim() || isLoading} className="w-11 h-11 bg-svMaroon-800 text-white rounded-full flex items-center justify-center shrink-0 hover:bg-svMaroon-900 disabled:opacity-50 transition shadow-md">
                <Send size={18} className="ml-1" />
              </button>
            </form>
          </>
        )}
      </div>
    </>
  )
}