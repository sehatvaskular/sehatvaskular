// app/api/chat/route.ts

import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

// ✅ HAPUS runtime edge — tidak kompatibel dengan @google/generative-ai
// export const runtime = 'edge';  <-- DIHAPUS

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("API Key Gemini belum di-setting!")

    const genAI = new GoogleGenerativeAI(apiKey)
    const { message, history, userName } = await req.json()

    // ✅ Guard: pastikan history selalu array
    const safeHistory: ChatMessage[] = Array.isArray(history) ? history : []

    const systemPrompt = `Kamu adalah Asisten AI dari "Sehat Vaskular", platform edukasi bedah vaskular di Indonesia.
    Pengguna yang sedang berkonsultasi denganmu saat ini bernama: ${userName}.
    
    ATURAN SANGAT PENTING:
    1. Bersikaplah ramah, empatik, profesional, dan ringkas. Jangan menjawab terlalu panjang. Gunakan nama pengguna sesekali agar akrab.
    2. Kamu HANYA BOLEH memberikan informasi edukasi umum. JANGAN PERNAH mendiagnosis atau memberikan saran medis spesifik.
    3. JIKA pengguna bertanya tentang: diagnosis keluhannya, biaya tindakan, jadwal dokter, atau meminta rekomendasi tindakan medis, KAMU HARUS BERHENTI MENJELASKAN.
    4. Saat berhenti menjelaskan dan mengarahkan ke Admin, kamu WAJIB menyisipkan kode rahasia ini di paling akhir jawabanmu:
    [HANDOFF_WA: Tuliskan ringkasan keluhan dan pertanyaan pengguna sejauh ini dengan singkat dan jelas]
    
    Contoh balasan:
    Mohon maaf Kak ${userName}, untuk keluhan luka yang semakin menghitam tersebut memerlukan pemeriksaan langsung oleh dokter spesialis kami dan tidak bisa saya diagnosa di sini. Silakan konsultasikan lebih lanjut dengan admin ya.
    [HANDOFF_WA: Pasien memiliki luka diabetes di kaki yang menghitam, ingin menanyakan jadwal dokter dan perkiraan biaya perawatan luka.]`

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
      systemInstruction: systemPrompt,
    })

    // ✅ Filter history: skip pesan pertama jika role-nya 'model' (Gemini tidak terima history diawali model)
    const formattedHistory = safeHistory
      .map((msg: ChatMessage) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
      .filter((_, index, arr) => {
        // Hapus leading 'model' messages
        if (index === 0 && arr[0].role === 'model') return false
        return true
      })

    const chat = model.startChat({ history: formattedHistory })
    const result = await chat.sendMessage(message)
    const responseText = result.response.text()

    return NextResponse.json({ reply: responseText })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan pada server'
    console.error('[Chat API Error]', errorMessage) // ✅ Log untuk debugging
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}