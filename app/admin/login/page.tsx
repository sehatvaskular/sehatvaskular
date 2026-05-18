'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Tampilkan pesan error ASLI dari Supabase agar kita tahu apa masalahnya
      setError(error.message === 'Invalid login credentials' ? 'Email atau password salah.' : error.message)
      setLoading(false)
    } else if (data.session) {
      // LOGIN BERHASIL! 
      // Kita gunakan window.location.href untuk memaksa browser memuat ulang 
      // halaman secara penuh agar Middleware langsung mengenali sesi Anda.
      window.location.href = '/admin'
    } else {
      setError('Terjadi kesalahan tidak terduga. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 relative">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-svBlue-900 z-0"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl z-10 overflow-hidden">
        <div className="bg-svBlue-900 p-8 text-center border-b-4 border-svMaroon-800 flex flex-col items-center">
          <img 
            src="/logoICO.png" 
            alt="Login Logo" 
            className="h-16 w-auto object-contain mb-4 drop-shadow-md"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-slate-300 text-sm mt-1">Sistem Manajemen Konten</p>
        </div>

        <form onSubmit={handleLogin} className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Email Administrator</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 focus:bg-white transition"
              placeholder="admin@sehatvaskular.com"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-svBlue-900 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-svMaroon-800 focus:bg-white transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-svMaroon-800 text-white font-bold rounded-xl hover:bg-svMaroon-900 transition shadow-lg disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memverifikasi...
              </span>
            ) : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}