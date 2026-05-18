'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <header className="bg-svBlue-900 sticky top-0 z-50 border-b-4 border-svMaroon-900 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group z-50">
          <div className="w-12 h-12 bg-svMaroon-800 rounded-xl flex items-center justify-center text-white font-bold text-2xl group-hover:bg-svMaroon-900 transition">
            SV
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white tracking-tight leading-none">
              Sehat<span className="text-svMaroon-400">Vaskular</span>
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-widest mt-1">EDUKASI MEDIS</span>
          </div>
        </Link>

        {/* Tombol Hamburger (Mobile) */}
        <button 
          className="lg:hidden text-white p-2 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Menu Desktop */}
        <nav className="hidden lg:flex gap-8 font-medium text-slate-300 items-center relative">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          
          {/* Dropdown Layanan / Edukasi */}
          <div 
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-white transition-colors py-8">
              Topik Edukasi <span className="text-xs">▼</span>
            </button>
            
            {/* Isi Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-[80px] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/diabetic-foot" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Diabetic Foot</Link>
                <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/akses-hemodialisa" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Akses Hemodialisa (Cimino)</Link>
                <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/varises" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Varises</Link>
                <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/pad" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Peripheral Artery Disease</Link>
                <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/dvt" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Deep Vein Thrombosis</Link>
                <Link onClick={() => setIsDropdownOpen(false)} href="/layanan/trauma-vaskular" className="px-5 py-3 text-sm text-svBlue-900 hover:bg-slate-50 hover:text-svMaroon-800 font-bold border-l-4 border-transparent hover:border-svMaroon-800 transition">Trauma Vaskular</Link>
              </div>
            )}
          </div>

          <Link href="/tim-dokter" className="hover:text-white transition-colors">Tim Dokter</Link>
          <Link href="/kontak" className="hover:text-white transition-colors">Kontak</Link>
        </nav>
      </div>

      {/* Menu Mobile (Layar Penuh saat dibuka) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full h-[calc(100vh-80px)] bg-svBlue-900 z-40 flex flex-col pt-8 px-6 gap-6 overflow-y-auto">
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="text-xl font-bold text-white border-b border-white/10 pb-4">Beranda</Link>
          
          <div className="flex flex-col gap-4 border-b border-white/10 pb-4">
            <span className="text-xl font-bold text-white">Topik Edukasi</span>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/diabetic-foot" className="text-slate-300 pl-4">Diabetic Foot</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/akses-hemodialisa" className="text-slate-300 pl-4">Akses Hemodialisa</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/varises" className="text-slate-300 pl-4">Varises</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/pad" className="text-slate-300 pl-4">Peripheral Artery Disease</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/dvt" className="text-slate-300 pl-4">Deep Vein Thrombosis</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/layanan/trauma-vaskular" className="text-slate-300 pl-4">Trauma Vaskular</Link>
          </div>

          <Link onClick={() => setIsMobileMenuOpen(false)} href="/tim-dokter" className="text-xl font-bold text-white border-b border-white/10 pb-4">Tim Dokter</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/kontak" className="text-xl font-bold text-white pb-4">Kontak</Link>
        </div>
      )}
    </header>
  )
}