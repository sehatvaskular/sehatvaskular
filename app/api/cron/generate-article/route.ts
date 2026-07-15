import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js' 
import { NextResponse } from 'next/server'

// 1. Matikan Edge Runtime di Netlify karena sering bermasalah dengan request panjang
//export const runtime = 'edge';;

// 2. Minta hosting (Netlify/Vercel) untuk memperpanjang batas waktu eksekusi (maksimal 60 detik)
export const maxDuration = 60; 

export async function GET(req: Request) {
  try {
    // 3. Validasi Keamanan: Cek Header Authorization
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }

    // 4. Inisialisasi Supabase menggunakan SERVICE_ROLE agar bisa bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase Key belum di-setting di Environment Variables Netlify.")
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 5. Inisialisasi Gemini AI
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("API Key Gemini belum di-setting di Environment Variables Netlify.")

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

    // 6. Perintahkan Gemini membuat artikel berformat JSON
    // Menggunakan gemini-2.5-flash karena ini adalah versi paling cepat dan stabil saat ini
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash', 
      generationConfig: { 
          responseMimeType: "application/json",
          // Kurangi sedikit max token untuk memastikan respon selesai sebelum timeout Netlify (10s)
          maxOutputTokens: 2500, 
      }
    })

    const prompt = `Bertindaklah sebagai Dokter Spesialis Bedah Vaskular di Indonesia dan Ahli SEO. 
    Buatlah 1 artikel edukasi kesehatan yang komprehensif, padat, dan dioptimalkan untuk SEO Google mengenai topik: "${randomCategory}".
    
    ATURAN SEO & FORMAT KONTEN HTML:
    1.  **Struktur Heading (Wajib SEO):**
        * JANGAN PERNAH gunakan tag <h1>.
        * Gunakan tag <h2> untuk subtopik utama.
        * Gunakan tag <h3> untuk rincian di bawah subtopik utama.
    2.  **Keterbacaan (Readability):**
        * Gunakan paragraf pendek (maksimal 3 kalimat).
        * Sering gunakan <ul> dan <li> (bullet points) agar artikel mudah di-scan.
        * Gunakan <strong> untuk menebalkan istilah medis penting.
    3.  **Alur Artikel:**
        * **Pendahuluan:** Paragraf pertama harus menarik (hook).
        * **Isi Utama:** Bahas ringkas tentang Penyebab, Gejala, dan Pilihan Terapi Medis.
        * **Infografis Ringkasan:** WAJIB buat 1 bagian khusus dengan HTML: <div class="bg-slate-50 p-6 rounded-2xl border-l-4 border-svMaroon-800 my-8 shadow-sm"><h3>Ringkasan Cepat</h3><ul>...</ul></div>.
        * **Kesimpulan:** Tutup dengan menyarankan pembaca segera ke dokter bedah vaskular.
    
    Kembalikan DENGAN CEPAT dalam format JSON murni persis seperti ini:
    {
      "title": "Judul Menarik SEO-Friendly (Maks 60 karakter)",
      "excerpt": "Meta deskripsi SEO (maks 160 karakter) yang sangat memikat klik.",
      "content": "Isi artikel lengkap dalam format tag HTML seperti yang diinstruksikan."
    }`;

    // Eksekusi pemanggilan AI
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // 7. Parsing hasil AI secara aman
    let articleData;
    try {
        articleData = JSON.parse(responseText);
    } catch (parseError) {
        console.error("Gagal parse JSON dari AI. Teks asli:", responseText);
        throw new Error("AI mengembalikan format JSON yang tidak valid (kemungkinan terpotong karena batas waktu).");
    }

    // 8. Generate Slug otomatis yang SEO Friendly
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // 9. Pilih gambar placeholder yang relevan dengan topik Vaskular
    const medicalPlaceholders = [
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1551076805-e18690c5e53b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200'
    ]
    const randomImage = medicalPlaceholders[Math.floor(Math.random() * medicalPlaceholders.length)]

    // 10. Masukkan ke Database menggunakan Admin Client
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

    if (insertError) {
        if (insertError.code === '23505') {
            throw new Error(`Artikel dengan slug '${slug}' sudah ada.`);
        }
        throw insertError;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil! Artikel dibuat: ${articleData.title}` 
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error("Cron Error Log:", errorMessage)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}