import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Buat response awal yang akan dikembalikan jika tidak ada perubahan rute
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Inisialisasi Supabase untuk Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
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
    }
  )

  // Ambil sesi user saat ini
  const { data: { session } } = await supabase.auth.getSession()

  const currentPath = request.nextUrl.pathname;
  const isLoginPage = currentPath === '/admin/login';
  const isAdminPage = currentPath.startsWith('/admin');

  // PERATURAN 1: Jika user mencoba masuk ke /admin tapi BELUM LOGIN
  if (isAdminPage && !isLoginPage && !session) {
    // Arahkan ke halaman login
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // PERATURAN 2: Jika user SUDAH LOGIN tapi malah buka halaman /admin/login lagi
  if (isLoginPage && session) {
    // Langsung lemparkan ke dashboard admin
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

// Konfigurasi agar middleware hanya dijalankan pada rute yang berawalan /admin
export const config = {
  matcher: ['/admin/:path*'],
}