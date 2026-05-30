// components/NewsCarousel.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
  image_url: string | null;
}

export default function NewsCarousel({ posts }: { posts: Post[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Efek auto-play slideshow (bergeser setiap 5 detik)
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (activeIndex + 1) % posts.length
        const scrollAmount = scrollRef.current.clientWidth * nextIndex
        scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' })
        setActiveIndex(nextIndex)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [activeIndex, posts.length])

  // Deteksi posisi scroll manual oleh user untuk update titik indikator
  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth)
      setActiveIndex(index)
    }
  }

  const defaultImg = "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000"

  if (!posts || posts.length === 0) return null;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 mt-[-5rem] md:mt-[-8rem] z-20 mb-16">
      <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl group bg-slate-900 border-4 border-white">
        
        {/* Area Scroll (Bisa digeser pakai sentuhan jari/mouse) */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {posts.map((post) => (
            <Link 
              href={`/artikel/${post.slug}`} 
              key={post.slug} 
              className="relative w-full flex-shrink-0 snap-center block aspect-[4/3] md:aspect-[21/9]"
            >
              <img 
                src={post.image_url || defaultImg} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
              />
              {/* Gradien Gelap ala Portal Berita */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent flex flex-col justify-end p-6 md:p-12">
                <span className="inline-block w-max px-4 py-1 bg-svMaroon-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg">
                  Sorotan Terkini
                </span>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 max-w-4xl drop-shadow-md">
                  {post.title}
                </h2>
                <p className="text-slate-300 line-clamp-2 md:line-clamp-1 max-w-3xl mb-6 md:mb-0 text-sm md:text-base">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Titik Indikator (Dots) di pojok kanan bawah */}
        <div className="absolute bottom-6 md:bottom-12 right-6 md:right-12 flex gap-2">
          {posts.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-500 ${activeIndex === idx ? 'w-8 bg-svMaroon-600' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}