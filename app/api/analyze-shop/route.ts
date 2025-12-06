import { NextRequest } from 'next/server'
import OpenAI from 'openai'

// Increase timeout for API route (disable timeout for streaming)
export const maxDuration = 60 // 60 seconds max

export async function POST(request: NextRequest) {
  console.log('[API] Analyze shop request received')
  
  // Create a readable stream for SSE (Server-Sent Events)
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      // Helper function to send SSE message
      const sendMessage = (type: string, data: any) => {
        const message = `data: ${JSON.stringify({ type, data })}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      try {
        // Step 1: Validate API key
        sendMessage('progress', { step: 'validate', message: 'Memeriksa konfigurasi...' })
        
        if (!process.env.OPENAI_API_KEY) {
          console.error('[API] OPENAI_API_KEY not configured')
          sendMessage('error', { 
            error: 'API Key tidak dikonfigurasi',
            details: 'OPENAI_API_KEY belum diisi di .env.local'
          })
          controller.close()
          return
        }

        // Step 2: Parse form data
        sendMessage('progress', { step: 'parse', message: 'Membaca file gambar...' })
        console.log('[API] Parsing form data...')
        
        const formData = await request.formData()
        const bannerImage = formData.get('bannerImage') as File | null
        
        if (!bannerImage) {
          console.error('[API] Banner image missing')
          sendMessage('error', { error: 'Foto spanduk toko wajib diupload' })
          controller.close()
          return
        }

        console.log('[API] Banner image:', bannerImage.name, bannerImage.type, bannerImage.size)

        // Collect product images
        const productImages: File[] = []
        for (let i = 0; i < 10; i++) {
          const productImage = formData.get(`productImage${i}`) as File | null
          if (productImage) {
            productImages.push(productImage)
            console.log(`[API] Product image ${i}:`, productImage.name)
          }
        }

        // Step 3: Validate image sizes
        sendMessage('progress', { step: 'validate', message: 'Memvalidasi ukuran gambar...' })
        
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (bannerImage.size > maxSize) {
          sendMessage('error', { error: 'Ukuran foto spanduk terlalu besar (max 10MB)' })
          controller.close()
          return
        }

        for (const img of productImages) {
          if (img.size > maxSize) {
            sendMessage('error', { error: 'Ukuran foto produk terlalu besar (max 10MB)' })
            controller.close()
            return
          }
        }

        // Step 4: Convert to base64
        sendMessage('progress', { 
          step: 'convert', 
          message: `Memproses ${1 + productImages.length} gambar...` 
        })
        console.log('[API] Converting images to base64...')
        
        const bannerBase64 = await fileToBase64(bannerImage)
        const productBase64s = await Promise.all(
          productImages.map((img) => fileToBase64(img))
        )
        
        console.log('[API] Base64 conversion complete')

        // Step 5: Initialize OpenAI
        sendMessage('progress', { step: 'init', message: 'Menghubungkan ke AI...' })
        
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        })
        
        console.log('[API] OpenAI client initialized')

        // Prepare images
        const imageContents: any[] = [
          {
            type: 'image_url',
            image_url: {
              url: `data:${bannerImage.type};base64,${bannerBase64}`,
            },
          },
        ]

        productBase64s.forEach((base64, index) => {
          imageContents.push({
            type: 'image_url',
            image_url: {
              url: `data:${productImages[index].type};base64,${base64}`,
            },
          })
        })

        // Prompt
        const prompt = `Analisis gambar ini. Gambar 1 adalah spanduk toko, Gambar 2 dan seterusnya adalah produk (jika ada).

Ekstrak data berikut dalam format JSON murni (tanpa markdown, tanpa backticks, hanya JSON):
{
  "shopName": "Nama toko dari spanduk (jika tidak ada, buat nama kreatif berdasarkan produk yang terlihat)",
  "phoneNumber": "Nomor HP dari spanduk (jika tidak ada, kosongkan string)",
  "address_clue": "Alamat/Jalan yang terbaca di spanduk/brosur atau petunjuk lokasi yang relevan (jika tidak ada, kosongkan string)",
  "category": "Jenis makanan/produk (contoh: Sate, Bakso, Kelontong, Minuman, dll)",
  "marketing_desc": "Buatkan kalimat promosi pendek (maksimal 2 kalimat) yang menarik dan menggugah selera dalam bahasa Indonesia gaul/akrab. Fokus pada keunikan produk atau daya tarik toko."
}

PENTING: Response harus HANYA berupa JSON yang valid, tanpa markdown formatting, tanpa \`\`\`json, langsung mulai dengan {`

        // Step 6: Call AI API
        sendMessage('progress', { step: 'ai', message: 'AI sedang membaca gambar...' })
        console.log('[API] Calling OpenAI API...')
        
        const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
        let model = 'gpt-4o-mini'
        
        if (baseURL.includes('kolosal')) {
          model = 'Claude Sonnet 4.5'
        }
        
        console.log('[API] Using model:', model)

        // Use streaming for real-time feedback
        const completion = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt,
                },
                ...imageContents,
              ],
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
          stream: true, // Enable streaming
        })

        let fullResponse = ''
        let chunkCount = 0

        // Stream the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            fullResponse += content
            chunkCount++
            
            // Send progress every 5 chunks or if we detect field names
            if (chunkCount % 5 === 0 || content.includes('"shopName"') || content.includes('"category"')) {
              sendMessage('progress', { 
                step: 'ai', 
                message: 'AI sedang menganalisis...',
                partial: fullResponse.substring(0, 100) + '...'
              })
            }
          }
        }

        console.log('[API] Streaming complete')
        console.log('[API] Full response:', fullResponse)

        // Step 7: Parse response
        sendMessage('progress', { step: 'parse', message: 'Memproses hasil analisis...' })
        
        let jsonText = fullResponse.trim()
        jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '')
        
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          jsonText = jsonMatch[0]
        }

        console.log('[API] Cleaned JSON:', jsonText)

        // Parse JSON
        let analysisResult
        try {
          analysisResult = JSON.parse(jsonText)
          console.log('[API] Parsed successfully:', analysisResult)
        } catch (parseError: any) {
          console.error('[API] JSON parse error:', parseError.message)
          
          // Fallback
          analysisResult = {
            shopName: 'Toko Baru',
            phoneNumber: '',
            address_clue: '',
            category: 'Umum',
            marketing_desc: 'Toko dengan berbagai produk menarik untuk kebutuhan Anda!',
            _note: 'AI gagal menganalisis gambar. Silakan isi manual.',
            _error: parseError.message,
            _rawResponse: fullResponse
          }
        }

        // Validate fields
        if (!analysisResult.shopName) analysisResult.shopName = 'Toko Baru'
        if (!analysisResult.category) analysisResult.category = 'Umum'
        if (!analysisResult.marketing_desc) analysisResult.marketing_desc = 'Toko dengan produk berkualitas!'
        if (analysisResult.phoneNumber === undefined) analysisResult.phoneNumber = ''
        if (analysisResult.address_clue === undefined) analysisResult.address_clue = ''

        // Step 8: Send success
        sendMessage('progress', { step: 'complete', message: '✨ Analisis selesai!' })
        sendMessage('success', analysisResult)
        
        console.log('[API] Analysis complete')
        controller.close()

      } catch (error: any) {
        console.error('[API] Error:', error)
        console.error('[API] Stack:', error.stack)
        
        sendMessage('error', {
          error: 'Gagal menganalisis gambar',
          details: error.message,
          errorType: error.constructor.name,
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

async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  return buffer.toString('base64')
}
