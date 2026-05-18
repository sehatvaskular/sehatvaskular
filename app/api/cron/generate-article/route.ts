import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js' 
import { NextResponse } from 'next/server'

// Edge runtime cocok untuk Vercel/Cloudflare Pages
export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    // 1. Validasi Keamanan: Cek Header Authorization
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }

    // 2. Inisialisasi Supabase menggunakan SERVICE_ROLE agar bisa bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! 
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase Key belum di-setting di Environment Variables.")
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 3. Inisialisasi Gemini AI
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("API Key Gemini belum di-setting.")

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // List kategori topik agar AI menggilir topik secara acak
    const categories = [
      'Varises kaki dan penanganannya', 
      'Luka Kaki Diabetes dan resiko amputasi', 
      'Penyakit Arteri Perifer (PAD)', 
      'Penyumbatan vena dalam (DVT)', 
      'Akses Cimino untuk cuci darah',
      'Pola makan sehat untuk pembuluh darah',
      'Bahaya merokok bagi arteri perifer'
    ]
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]

    // 4. Perintahkan Gemini membuat artikel berformat JSON
    // Kita gunakan model flash agar lebih cepat mencegah timeout di Edge server
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      generationConfig: { responseMimeType: "application/json" }
    })

    const prompt = `Bertindaklah sebagai Dokter Spesialis Bedah Vaskular di Indonesia. 
    Buatlah 1 artikel edukasi kesehatan yang ringkas namun mendalam mengenai topik: "${randomCategory}".
    Gunakan format HTML (<h2>, <h3>, <p>, <ul>, <li>). Jangan gunakan <h1>.
    Gunakan gaya bahasa profesional, empatik, dan mudah dimengerti orang awam.
    
    Kembalikan dalam format JSON persis seperti ini:
    {
      "title": "Judul Menarik (Maksimal 60 karakter)",
      "excerpt": "Ringkasan pendek 2 kalimat sebagai pengantar",
      "content": "Isi artikel dalam format tag HTML"
    }`;

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // Parsing hasil AI secara aman
    let articleData;
    try {
        articleData = JSON.parse(responseText);
    } catch (parseError) {
        console.error("Gagal parse JSON dari AI:", responseText);
        throw new Error("AI mengembalikan format yang salah");
    }

    // 5. Generate Slug otomatis
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // 6. Pilih gambar placeholder acak
    const medicalPlaceholders = [
      'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1504817342169-4a572a5f3ffa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800'
    ]
    const randomImage = medicalPlaceholders[Math.floor(Math.random() * medicalPlaceholders.length)]

    // 7. Masukkan ke Database menggunakan Admin Client
    const { error: insertError } = await supabaseAdmin
      .from('posts')
      .insert([{
        title: articleData.title,
        slug: slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        image_url: randomImage, // Memastikan gambar diset
        published_at: new Date().toISOString()
      }])

    if (insertError) {
        // Cek apakah slug duplikat (Error code 23505 di Postgres)
        if (insertError.code === '23505') {
            throw new Error(`Artikel dengan slug '${slug}' sudah ada. Coba lagi nanti.`);
        }
        throw insertError;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Artikel baru berhasil dibuat: ${articleData.title}` 
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error("Cron Error:", errorMessage)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}