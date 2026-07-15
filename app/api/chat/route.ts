// app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

// ✅ WAJIB untuk Vercel: paksa Node.js runtime agar @google/generative-ai bisa berjalan
export const runtime = 'edge';

// ✅ Timeout maksimal 30 detik (Vercel Pro: 60s, Free: 10s — sesuaikan jika perlu)
export const maxDuration = 30

interface ChatMessage {
  role: string
  content: string
}

export async function POST(req: Request) {
  try {
    // ✅ Validasi API Key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('API Key Gemini belum di-setting di environment variables!')
    }

    // ✅ Validasi & parse request body
    let body: { message?: unknown; history?: unknown; userName?: unknown }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Request body tidak valid (bukan JSON)' },
        { status: 400 }
      )
    }

    const { message, history, userName } = body

    // ✅ Validasi input wajib
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Field "message" wajib diisi dan harus berupa teks.' },
        { status: 400 }
      )
    }

    // ✅ Sanitasi userName — fallback jika kosong/tidak valid
    const safeName =
      typeof userName === 'string' && userName.trim() !== ''
        ? userName.trim()
        : 'Kak'

    // ✅ Guard: history selalu array, dan pastikan strukturnya valid
    const safeHistory: ChatMessage[] = (Array.isArray(history) ? history : []).filter(
      (msg): msg is ChatMessage =>
        msg !== null &&
        typeof msg === 'object' &&
        typeof msg.role === 'string' &&
        typeof msg.content === 'string' &&
        msg.content.trim() !== ''
    )

    // ✅ System prompt dengan nama pengguna yang sudah disanitasi
    const systemPrompt = `Kamu adalah Asisten AI dari "Sehat Vaskular", platform edukasi bedah vaskular di Indonesia.
Pengguna yang sedang berkonsultasi denganmu saat ini bernama: ${safeName}.

ATURAN SANGAT PENTING:
1. Bersikaplah ramah, empatik, profesional, dan ringkas. Jangan menjawab terlalu panjang. Gunakan nama pengguna sesekali agar akrab.
2. Kamu HANYA BOLEH memberikan informasi edukasi umum. JANGAN PERNAH mendiagnosis atau memberikan saran medis spesifik.
3. JIKA pengguna bertanya tentang: diagnosis keluhannya, biaya tindakan, jadwal dokter, atau meminta rekomendasi tindakan medis, KAMU HARUS BERHENTI MENJELASKAN.
4. Saat berhenti menjelaskan dan mengarahkan ke Admin, kamu WAJIB menyisipkan kode rahasia ini di paling akhir jawabanmu:
[HANDOFF_WA: Tuliskan ringkasan keluhan dan pertanyaan pengguna sejauh ini dengan singkat dan jelas]

Contoh balasan:
Mohon maaf Kak ${safeName}, untuk keluhan luka yang semakin menghitam tersebut memerlukan pemeriksaan langsung oleh dokter spesialis kami dan tidak bisa saya diagnosa di sini. Silakan konsultasikan lebih lanjut dengan admin ya.
[HANDOFF_WA: Pasien memiliki luka diabetes di kaki yang menghitam, ingin menanyakan jadwal dokter dan perkiraan biaya perawatan luka.]`

    const genAI = new GoogleGenerativeAI(apiKey)

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    })

    // ✅ Format history untuk Gemini:
    //    - Map role: 'user' | 'model'
    //    - Gemini WAJIB: history harus diawali role 'user', bukan 'model'
    //    - Pastikan giliran user/model bergantian (alternating) — Gemini error jika tidak
    const formattedHistory = safeHistory
      .map((msg: ChatMessage) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))
      .reduce(
        (acc: { role: string; parts: { text: string }[] }[], cur) => {
          // Hapus jika pesan pertama bukan 'user'
          if (acc.length === 0 && cur.role !== 'user') return acc
          // Hindari dua role sama berturut-turut (Gemini tidak suka)
          if (acc.length > 0 && acc[acc.length - 1].role === cur.role) return acc
          acc.push(cur)
          return acc
        },
        []
      )

    const chat = model.startChat({ history: formattedHistory })
    const result = await chat.sendMessage(message.trim())
    const responseText = result.response.text()

    return NextResponse.json({ reply: responseText })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Terjadi kesalahan pada server'

    // ✅ Log detail untuk debugging di Vercel Functions log
    console.error('[SeVa AI — Chat API Error]', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}