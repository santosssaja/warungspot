import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Increase timeout for API route
export const maxDuration = 60

// Types
interface AnalysisResult {
  shopName: string
  phoneNumber: string
  address_clue: string
  category: string
  marketing_desc: string
  _source?: string
  _error?: string
}

const SYSTEM_PROMPT = `Analisis gambar ini. Gambar 1 adalah spanduk toko, Gambar 2 dan seterusnya adalah produk (jika ada).

Ekstrak data berikut dalam format JSON murni (tanpa markdown, tanpa backticks, hanya JSON):
{
  "shopName": "Nama toko dari spanduk (jika tidak ada, buat nama kreatif berdasarkan produk yang terlihat)",
  "phoneNumber": "Nomor HP dari spanduk (jika tidak ada, kosongkan string)",
  "address_clue": "Alamat/Jalan yang terbaca di spanduk/brosur atau petunjuk lokasi yang relevan (jika tidak ada, kosongkan string)",
  "category": "Jenis makanan/produk (contoh: Sate, Bakso, Kelontong, Minuman, dll)",
  "marketing_desc": "Buatkan kalimat promosi pendek (maksimal 2 kalimat) yang menarik dan menggugah selera dalam bahasa Indonesia gaul/akrab. Fokus pada keunikan produk atau daya tarik toko."
}

PENTING: Response harus HANYA berupa JSON yang valid, tanpa markdown formatting, tanpa \`\`\`json, langsung mulai dengan {`

export async function POST(request: NextRequest) {
  console.log('[API] Analyze shop request received')
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const sendMessage = (type: string, data: any) => {
        const message = `data: ${JSON.stringify({ type, data })}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      try {
        // 1. Parse Request
        sendMessage('progress', { step: 'parse', message: 'Membaca file gambar...' })
        const formData = await request.formData()
        const bannerImage = formData.get('bannerImage') as File | null

        if (!bannerImage) {
          throw new Error('Foto spanduk toko wajib diupload')
        }

        const productImages: File[] = []
        for (let i = 0; i < 10; i++) {
          const img = formData.get(`productImage${i}`) as File | null
          if (img) productImages.push(img)
        }

        // 2. Convert Images
        sendMessage('progress', { step: 'convert', message: 'Memproses gambar...' })
        const bannerBase64 = await fileToBase64(bannerImage)
        const productBase64s = await Promise.all(productImages.map(fileToBase64))

        // 3. Analyze with Fallback
        sendMessage('progress', { step: 'ai', message: 'Menganalisis dengan AI...' })

        let result: AnalysisResult | null = null
        let errorDetails = ''

        // Strategy: Kolosal -> Gemini -> OpenAI (Official) -> Fallback

        // 1. Try Kolosal AI (via OpenAI SDK)
        try {
          const kolosalKey = process.env.KOLOSAL_API_KEY
          if (kolosalKey) {
            console.log('[API] Trying Kolosal AI...')
            sendMessage('progress', { step: 'ai', message: 'Menganalisis dengan Kolosal AI...' })
            result = await analyzeWithOpenAICompatible(
              'https://api.kolosal.ai/v1',
              kolosalKey,
              'Qwen 3 30BA3B', // Or other model Kolosal supports
              bannerBase64, productBase64s, bannerImage.type, productImages.map(f => f.type)
            )
            result._source = 'kolosal'
          }
        } catch (err: any) {
          console.error('[API] Kolosal failed:', err.message)
          errorDetails += `Kolosal: ${err.message}. `
        }

        // 2. Try Gemini Fallback
        if (!result) {
          try {
            if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not set')
            console.log('[API] Trying Gemini...')
            sendMessage('progress', { step: 'ai', message: 'Mencoba Gemini AI...' })
            result = await analyzeWithGemini(bannerBase64, productBase64s, bannerImage.type, productImages.map(f => f.type))
            result._source = 'gemini'
          } catch (err: any) {
            console.error('[API] Gemini failed:', err.message)
            errorDetails += `Gemini: ${err.message}. `
          }
        }

        // 3. Try Official OpenAI
        if (!result && process.env.OPENAI_API_KEY) {
          try {
            console.log('[API] Trying Official OpenAI...')
            sendMessage('progress', { step: 'ai', message: 'Mencoba OpenAI Official...' })
            result = await analyzeWithOpenAICompatible(
              'https://api.openai.com/v1',
              process.env.OPENAI_API_KEY,
              'gpt-4o-mini',
              bannerBase64, productBase64s, bannerImage.type, productImages.map(f => f.type)
            )
            result._source = 'openai'
          } catch (err: any) {
            console.error('[API] OpenAI failed:', err.message)
            errorDetails += `OpenAI: ${err.message}. `
          }
        }

        // 4. Final Fallback (Mock/Free)
        if (!result) {
          console.warn('[API] All providers failed. Using fallback data.')
          result = {
            shopName: 'Toko Baru',
            phoneNumber: '',
            address_clue: '',
            category: 'Umum',
            marketing_desc: 'Toko dengan berbagai produk menarik untuk kebutuhan Anda!',
            _source: 'fallback_free',
            _error: errorDetails
          }
        }

        // 5. Send Result
        sendMessage('progress', { step: 'complete', message: '✨ Analisis selesai!' })
        sendMessage('success', result)
        controller.close()

      } catch (error: any) {
        console.error('[API] Fatal error:', error)
        sendMessage('error', {
          error: 'Gagal menganalisis gambar',
          details: error.message
        })
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

async function analyzeWithOpenAICompatible(
  baseURL: string,
  apiKey: string,
  model: string,
  bannerBase64: string,
  productBase64s: string[],
  bannerType: string,
  productTypes: string[]
): Promise<AnalysisResult> {
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
  })

  const messages: any[] = [
    {
      type: 'image_url',
      image_url: { url: `data:${bannerType};base64,${bannerBase64}` }
    }
  ]

  productBase64s.forEach((base64, i) => {
    messages.push({
      type: 'image_url',
      image_url: { url: `data:${productTypes[i]};base64,${base64}` }
    })
  })

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: SYSTEM_PROMPT },
          ...messages
        ]
      }
    ],
    max_tokens: 1000,
    response_format: { type: 'json_object' }
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('No content from API')

  return JSON.parse(content)
}

async function analyzeWithGemini(
  bannerBase64: string,
  productBase64s: string[],
  bannerType: string,
  productTypes: string[]
): Promise<AnalysisResult> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const promptParts: any[] = [SYSTEM_PROMPT]

  promptParts.push({
    inlineData: {
      data: bannerBase64,
      mimeType: bannerType
    }
  })

  productBase64s.forEach((base64, i) => {
    promptParts.push({
      inlineData: {
        data: base64,
        mimeType: productTypes[i]
      }
    })
  })

  const result = await model.generateContent(promptParts)
  const response = result.response
  const text = response.text()

  // Clean up markdown if Gemini adds it
  const jsonText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
  return JSON.parse(jsonText)
}

async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  return buffer.toString('base64')
}

