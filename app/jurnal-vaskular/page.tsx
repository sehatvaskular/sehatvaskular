'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import FadeIn from '@/components/FadeIn'
import { Play, X } from 'lucide-react'

// Fungsi ajaib pengambil ID YouTube
const getYouTubeID = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

export default function JurnalVaskularPage() {
  const [jurnals, setJurnals] = useState<any[]>([])
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('jurnal_vaskular').select('*').order('created_at', { ascending: false })
      if (data) setJurnals(data)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-svBlue-900 mb-4">Jurnal Vaskular</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Cuplikan video edukasi singkat, interaktif, dan informatif langsung dari tim dokter spesialis kami.</p>
          </div>
        </FadeIn>

        {/* GRID THUMBNAIL (Aspek Rasio Portrait 9:16) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {jurnals.map((item, idx) => {
            const videoId = getYouTubeID(item.youtube_url)
            if (!videoId) return null
            return (
              <FadeIn key={item.id} delay={idx * 0.1} direction="up">
                <div 
                  onClick={() => setSelectedVideo({ ...item, videoId })}
                  className="relative group cursor-pointer aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                >
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                    onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }}
                    alt="Thumbnail" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <Play size={36} className="text-white/80 group-hover:text-white mb-2 transform group-hover:scale-110 transition-transform" />
                    <p className="text-white text-xs font-medium line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>

      {/* MODAL POP-UP (Membelah 2: Video Kiri, Teks Kanan) */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-sm">
          {/* Tombol Close */}
          <button 
            onClick={() => setSelectedVideo(null)} 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X size={28} />
          </button>

          {/* Container Modal Split */}
          <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl h-[85vh] md:h-[80vh] relative animate-in fade-in zoom-in duration-300">
            
            {/* KIRI: PLAYER VIDEO (Rasio 9:16) */}
            <div className="w-full md:w-[45%] bg-black flex items-center justify-center relative">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                className="w-full h-full md:aspect-[9/16] aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* KANAN: CAPTION / DESKRIPSI */}
            <div className="w-full md:w-[55%] flex flex-col bg-white h-full">
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                <div className="w-12 h-12 bg-svBlue-900 rounded-full flex items-center justify-center text-white font-bold">SV</div>
                <div>
                  <h3 className="font-bold text-svBlue-900">Sehat Vaskular</h3>
                  <p className="text-xs text-slate-500 font-medium">Jurnal Medis Edukasi</p>
                </div>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedVideo.description}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}