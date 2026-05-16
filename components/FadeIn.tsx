'use client' // Wajib untuk Framer Motion di Next.js App Router

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function FadeIn({ children, delay = 0, direction = 'up' }: FadeInProps) {
  // Menentukan arah datangnya elemen
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        filter: 'blur(10px)', // Efek blur saat awal
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        filter: 'blur(0px)', // Blur hilang saat masuk layar
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-100px" }} // Animasi jalan sebelum elemen 100% terlihat
      transition={{ 
        duration: 0.8, // Durasi animasi (detik)
        delay: delay, 
        ease: [0.21, 0.47, 0.32, 0.98] // Kurva animasi mulus ala Apple
      }}
    >
      {children}
    </motion.div>
  )
}