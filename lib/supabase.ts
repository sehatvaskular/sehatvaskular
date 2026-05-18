import { createBrowserClient } from '@supabase/ssr'

// Menggunakan createBrowserClient agar Supabase otomatis 
// menyimpan sesi login ke dalam Cookie, bukan Local Storage.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)