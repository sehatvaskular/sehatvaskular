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
      'Bahaya merokok bagi arteri perifer',
      'Pencegahan varises bagi pekerja kantoran',
      'Mengenal Ulkus Vena pada tungkai bawah',
      'Pentingnya deteksi dini gangguan aliran darah'
    ]
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]

    // 4. Perintahkan Gemini membuat artikel berformat JSON
    // Kita gunakan model flash agar lebih cepat mencegah timeout di Edge server
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite', // Model Flash 1.5 lebih stabil merespons JSON panjang
      generationConfig: { 
          responseMimeType: "application/json",
          maxOutputTokens: 4000, // Memaksa AI memberikan output yang lebih panjang
      }
    })

    const prompt = `Bertindaklah sebagai Dokter Spesialis Bedah Vaskular di Indonesia dan Ahli SEO. 
    Buatlah 1 artikel edukasi kesehatan yang SANGAT PANJANG, detail, mendalam (minimal 800 kata), dan sangat dioptimalkan untuk SEO Google mengenai topik: "${randomCategory}".
    
    ATURAN SEO & FORMAT KONTEN HTML:
    1.  **Struktur Heading (Wajib SEO):**
        * JANGAN PERNAH gunakan tag <h1>.
        * Gunakan tag <h2> untuk subtopik utama (cth: Penyebab, Gejala, Pengobatan).
        * Gunakan tag <h3> untuk rincian di bawah subtopik utama.
        * Sisipkan kata kunci utama secara natural di beberapa <h2> dan <h3>.
    2.  **Keterbacaan (Readability):**
        * Gunakan paragraf pendek (maksimal 3-4 kalimat).
        * Sering gunakan <ul> dan <li> (bullet points) agar artikel mudah di-scan oleh pembaca dan Google.
        * Gunakan <strong> untuk menebalkan istilah medis penting atau fokus informasi.
    3.  **Alur Artikel:**
        * **Pendahuluan:** Paragraf pertama harus menarik (hook) dan mengandung topik utama.
        * **Isi Utama:** Bahas komprehensif (Penyebab, Gejala, Diagnosis, dan Pilihan Terapi Medis).
        * **Infografis Ringkasan:** WAJIB buat 1 bagian khusus menggunakan elemen HTML: <div class="bg-slate-50 p-6 rounded-2xl border-l-4 border-svMaroon-800 my-8 shadow-sm">. Di dalamnya, gunakan <h3>Ringkasan Cepat</h3> dan buat daftar poin-poin terpenting.
        * **Kesimpulan & CTA:** Tutup dengan paragraf yang menyarankan pembaca untuk tidak menunda dan segera berkonsultasi ke dokter bedah vaskular.
    4.  **Gaya Bahasa:** Profesional, empatik (E-E-A-T), dan mudah dimengerti orang awam Indonesia.

    Kembalikan dalam format JSON persis seperti ini:
    {
      "title": "Judul Menarik SEO-Friendly (Maksimal 60 karakter)",
      "excerpt": "Meta deskripsi SEO (maksimal 160 karakter) yang sangat memikat klik (Click-Through Rate). Harus mengandung kata kunci.",
      "content": "Isi artikel lengkap dan panjang dalam format tag HTML seperti yang diinstruksikan."
    }`;

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // Parsing hasil AI secara aman
    let articleData;
    try {
        articleData = JSON.parse(responseText);
    } catch (parseError) {
        console.error("Gagal parse JSON dari AI:", responseText);
        throw new Error("AI mengembalikan format JSON yang rusak karena terlalu panjang atau meleset");
    }

    // 5. Generate Slug otomatis yang SEO Friendly
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // 6. Pilih gambar placeholder yang relevan dengan topik Vaskular
    const medicalPlaceholders = [
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1200', // Surgery/Vascular
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200', // Lab/Medical
      'https://images.unsplash.com/photo-1551076805-e18690c5e53b?auto=format&fit=crop&q=80&w=1200', // Abstract blue medical
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200', // Doctor walking
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200'  // Consultation
    ]
    const randomImage = medicalPlaceholders[Math.floor(Math.random() * medicalPlaceholders.length)]

    // 7. Masukkan ke Database menggunakan Admin Client
    const { error: insertError } = await supabaseAdmin
      .from('posts')
      .insert([{
        title: articleData.title,
        slug: slug,
        excerpt: articleData.excerpt, // Sekarang berisi Meta Description SEO berkualitas tinggi
        content: articleData.content,
        image_url: randomImage,
        published_at: new Date().toISOString()
      }])

    if (insertError) {
        // Cek apakah slug duplikat (Error code 23505 di Postgres)
        if (insertError.code === '23505') {
            throw new Error(`Artikel dengan slug '${slug}' sudah ada. AI mungkin kehabisan ide, coba lagi.`);
        }
        throw insertError;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil! Artikel SEO panjang dengan infografis dibuat: ${articleData.title}` 
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error("Cron Error:", errorMessage)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}