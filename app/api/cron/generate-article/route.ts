import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js' 
import { NextResponse } from 'next/server'

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    // 1. Validasi Keamanan: Cek Header Authorization
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }

    // PINDAHKAN INISIALISASI KE SINI (Di dalam fungsi GET)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! 
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase Key belum di-setting di Environment Variables.")
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("API Key Gemini belum di-setting.")

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // List kategori topik agar AI menggilir topik secara acak
    const categories = [
      'Varises kaki dan penanganannya', 
      'Luka Kaki Diabetes dan resiko amputasi', 
      'Penyakit Arteri Perifer (PAD)', 
      'Penyumbatan vena dalam (DVT)', 
      'Akses Cimino untuk cuci darah'
    ]
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]

    // 2. Perintahkan Gemini membuat artikel berformat JSON
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: { responseMimeType: "application/json" }
    })

    const prompt = `Bertindaklah sebagai Dokter Spesialis Bedah Vaskular. 
    Buatlah 1 artikel edukasi kesehatan yang mendalam mengenai topik: "${randomCategory}".
    Gunakan format HTML (h2, h3, p, ul, li). Jangan gunakan h1.
    
    Kembalikan dalam JSON:
    {
      "title": "Judul Menarik",
      "excerpt": "Ringkasan 2 kalimat",
      "content": "Isi HTML"
    }`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const articleData = JSON.parse(responseText)

    // 3. Generate Slug otomatis
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // 4. Pilih gambar placeholder acak
    const medicalPlaceholders = [
      'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=800',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800',
      'https://images.unsplash.com/photo-1504817342169-4a572a5f3ffa?q=80&w=800'
    ]
    const randomImage = medicalPlaceholders[Math.floor(Math.random() * medicalPlaceholders.length)]

    // 5. Masukkan ke Database menggunakan Admin Client
    const { error: insertError } = await supabaseAdmin
      .from('posts')
      .insert([{
        title: articleData.title,
        slug: slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        image_url: randomImage,
        published_at: new Date().toISOString()
      }])

    if (insertError) throw insertError

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