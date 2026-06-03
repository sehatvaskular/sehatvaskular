// proxy.ts
// ✅ Next.js 16: file ini menggantikan middleware.ts
// Export function wajib bernama "proxy" (bukan "middleware")

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Buat response awal — akan di-refresh ulang saat Supabase set/remove cookie
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // ✅ Guard: pastikan env variable tersedia sebelum createServerClient dipanggil
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Proxy] Supabase env variables belum di-set!')
    // Tetap lanjutkan request, jangan block user karena env error
    return supabaseResponse
  }

  // Inisialisasi Supabase client untuk server-side (proxy/middleware)
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        // ✅ Wajib set di kedua sisi (request & response) agar sesi tidak hilang
        request.cookies.set({ name, value, ...options })
        supabaseResponse = NextResponse.next({
          request: { headers: request.headers },
        })
        supabaseResponse.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options })
        supabaseResponse = NextResponse.next({
          request: { headers: request.headers },
        })
        supabaseResponse.cookies.set({ name, value: '', ...options })
      },
    },
  })

  // ✅ Gunakan getUser() bukan getSession() — lebih aman karena memvalidasi token
  //    ke Supabase server, tidak hanya membaca cookie lokal yang bisa dipalsukan
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const currentPath = request.nextUrl.pathname
  const isLoginPage = currentPath === '/admin/login'
  const isAdminPage = currentPath.startsWith('/admin')

  // ATURAN 1: Akses halaman /admin (selain login) tanpa sesi → redirect ke login
  if (isAdminPage && !isLoginPage && !user) {
    const loginUrl = new URL('/admin/login', request.url)
    // ✅ Simpan URL tujuan asal agar setelah login bisa redirect kembali ke sana
    loginUrl.searchParams.set('redirectTo', currentPath)
    return NextResponse.redirect(loginUrl)
  }

  // ATURAN 2: Sudah login tapi buka /admin/login lagi → redirect ke dashboard
  if (isLoginPage && user) {
    // ✅ Jika ada ?redirectTo dari aturan 1, kembalikan ke halaman itu
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') ?? '/admin'
    // Validasi redirectTo: hanya boleh path internal, bukan URL eksternal
    const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/admin'
    return NextResponse.redirect(new URL(safeRedirect, request.url))
  }

  // ✅ Kembalikan supabaseResponse (bukan NextResponse.next() baru) agar
  //    cookie Supabase yang sudah di-refresh ikut terbawa ke browser
  return supabaseResponse
}

// Jalankan proxy hanya untuk rute /admin/* — tidak perlu dijalankan untuk
// halaman publik, API routes, atau static assets
export const config = {
  matcher: ['/admin/:path*'],
}