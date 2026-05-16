import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("API Key Gemini belum di-setting!")

    const genAI = new GoogleGenerativeAI(apiKey)
    const { message, history, userName } = await req.json()

    // DOKTRIN BARU: Kenalkan AI dengan nama pasien & aturan Handoff WA
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
      model: 'gemini-3-flash-preview',
      systemInstruction: systemPrompt,
    })

    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    const chat = model.startChat({ history: formattedHistory })
    const result = await chat.sendMessage(message)
    const responseText = result.response.text()

    return NextResponse.json({ reply: responseText })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}