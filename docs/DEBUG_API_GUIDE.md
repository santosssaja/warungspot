# 🐛 Debug API /api/analyze-shop

Panduan lengkap untuk debug dan troubleshoot API analyze-shop.

---

## 🔍 Cara Melihat Error Logs

### 1. Terminal Server (npm run dev)
Buka terminal tempat Anda menjalankan `npm run dev`.

Semua log akan muncul dengan prefix `[API]`:
```
[API] Analyze shop request received
[API] Parsing form data...
[API] Banner image: photo.jpg image/jpeg 245678
[API] Converting images to base64...
[API] OpenAI client initialized with base URL: ...
[API] Calling OpenAI API...
```

### 2. Browser Console (F12)
Buka Developer Tools (F12) > Console tab.

Lihat error response dari API:
```javascript
{
  error: "Gagal menganalisis gambar",
  details: "Error message here...",
  errorType: "Error"
}
```

### 3. Network Tab (F12)
Buka Developer Tools (F12) > Network tab:
1. Upload gambar dan klik "Analisis dengan AI"
2. Cari request ke `/api/analyze-shop`
3. Klik request tersebut
4. Lihat:
   - **Headers**: Request method, status code
   - **Payload**: Data yang dikirim (FormData)
   - **Response**: Response dari server

---

## ⚠️ Error Umum & Solusinya

### Error 1: "API Key tidak dikonfigurasi"

**Penyebab:**
- `OPENAI_API_KEY` tidak terisi di `.env.local`

**Solusi:**
```bash
# Edit .env.local
OPENAI_API_KEY=your-actual-api-key-here
```

**Verify:**
```bash
# Di terminal (Windows)
echo %OPENAI_API_KEY%

# Atau cek di code (temporary)
console.log('API Key:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET')
```

**PENTING:** Restart dev server setelah edit `.env.local`!
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### Error 2: "401 Unauthorized" atau "Invalid API Key"

**Penyebab:**
- API key salah atau expired
- API key tidak valid untuk provider yang dipilih

**Solusi:**

#### Jika pakai OpenAI:
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.openai.com/v1
```

Verify API key:
1. Login ke [platform.openai.com](https://platform.openai.com)
2. Buka API Keys
3. Pastikan key masih aktif
4. Check usage quota (credit tersisa)

#### Jika pakai Kolosal AI:
```env
OPENAI_API_KEY=your-kolosal-api-key
OPENAI_BASE_URL=https://api.kolosal.com/v1
```

Verify API key:
1. Login ke [api.kolosal.com](https://api.kolosal.com)
2. Check API key status
3. Check quota/credit

---

### Error 3: "Model not found" atau "Invalid model"

**Penyebab:**
- Model name tidak sesuai dengan provider

**Solusi:**

API akan otomatis detect model berdasarkan `OPENAI_BASE_URL`:

**Kolosal AI:**
```env
OPENAI_BASE_URL=https://api.kolosal.com/v1
# Model: Claude Sonnet 4.5 (auto-detected)
```

**OpenAI:**
```env
OPENAI_BASE_URL=https://api.openai.com/v1
# Model: gpt-4o-mini (auto-detected)
```

**Check logs untuk model yang digunakan:**
```
[API] Using model: gpt-4o-mini
```

---

### Error 4: "Foto spanduk toko wajib diupload"

**Penyebab:**
- File tidak terkirim ke API
- Input file name salah

**Solusi:**

Verify di `ShopUploadForm.tsx`:
```typescript
// Pastikan name attribute sesuai
formData.append('bannerImage', bannerImage)

// BUKAN:
// formData.append('banner', bannerImage) ❌
```

**Debug:**
1. Check browser Network tab
2. Lihat FormData yang dikirim
3. Pastikan ada field `bannerImage`

---

### Error 5: "Ukuran foto terlalu besar (max 10MB)"

**Penyebab:**
- File gambar > 10MB

**Solusi:**
1. Compress gambar sebelum upload
2. Atau ubah max size di API:
```typescript
const maxSize = 20 * 1024 * 1024 // 20MB
```

**Recommend:**
- Banner: < 5MB
- Product photos: < 3MB each

---

### Error 6: "Failed to fetch" atau Network Error

**Penyebab:**
- Server dev tidak running
- Port blocked
- Network issue

**Solusi:**
1. Pastikan `npm run dev` masih running
2. Check terminal untuk error
3. Restart dev server
4. Check http://localhost:3000/api/analyze-shop (should return 405 Method Not Allowed - ini normal untuk GET request)

---

### Error 7: "JSON parse error" atau "AI gagal menganalisis gambar"

**Penyebab:**
- AI response bukan valid JSON
- AI response format tidak sesuai

**Solusi:**

API sudah handle ini dengan fallback response!

Response fallback:
```json
{
  "shopName": "Toko Baru",
  "phoneNumber": "",
  "address_clue": "",
  "category": "Umum",
  "marketing_desc": "Toko dengan berbagai produk menarik untuk kebutuhan Anda!",
  "_note": "AI gagal menganalisis gambar. Silakan isi manual.",
  "_error": "Unexpected token...",
  "_rawResponse": "Raw AI response here"
}
```

**Jika ini terjadi:**
1. Check `_rawResponse` di console
2. Verifikasi gambar jelas dan readable
3. Try gambar lain
4. Atau isi manual (form masih bisa diedit)

---

### Error 8: "Rate limit exceeded" atau "429 Too Many Requests"

**Penyebab:**
- Terlalu banyak request ke AI API
- Quota habis

**Solusi:**
1. Tunggu beberapa menit
2. Check quota di dashboard provider
3. Upgrade plan jika perlu

---

## 🧪 Testing API Secara Manual

### 1. Test dengan cURL (Command Line)

```bash
# Prepare test
cd C:\Users\sans\projects\imphnen\warungspot

# Test API with sample image
curl -X POST http://localhost:3000/api/analyze-shop \
  -F "bannerImage=@path/to/your/banner.jpg"
```

### 2. Test dengan Postman / Thunder Client

1. **Method:** POST
2. **URL:** `http://localhost:3000/api/analyze-shop`
3. **Body:** form-data
   - Key: `bannerImage` | Type: File | Value: (select file)
   - Key: `productImage0` | Type: File | Value: (optional)
4. **Send**

### 3. Test dengan Browser DevTools Console

```javascript
// Buka DevTools Console (F12) di halaman dashboard
const formData = new FormData()
const fileInput = document.querySelector('input[type="file"]')
formData.append('bannerImage', fileInput.files[0])

fetch('/api/analyze-shop', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e))
```

---

## 📊 Melihat Request/Response Detail

### Enable Verbose Logging

Edit `app/api/analyze-shop/route.ts`, tambah logging:

```typescript
// Before calling API
console.log('[DEBUG] Request details:', {
  bannerSize: bannerImage.size,
  bannerType: bannerImage.type,
  productCount: productImages.length,
  model: model,
  baseURL: baseURL
})

// After API call
console.log('[DEBUG] Full AI response:', JSON.stringify(completion, null, 2))
```

---

## ✅ Checklist Debugging

Jika error, check list ini satu per satu:

### Environment
- [ ] `.env.local` file exists
- [ ] `OPENAI_API_KEY` terisi (not empty)
- [ ] `OPENAI_BASE_URL` sesuai provider
- [ ] Restart dev server setelah edit `.env.local`

### API Key
- [ ] API key valid (copy paste tanpa spasi)
- [ ] API key punya quota/credit
- [ ] API key sesuai provider (OpenAI vs Kolosal)
- [ ] Test login ke dashboard provider

### Network
- [ ] Dev server running (`npm run dev`)
- [ ] No error di terminal server
- [ ] Port 3000 tidak blocked
- [ ] Internet connection stabil

### Images
- [ ] File size < 10MB
- [ ] Format: JPG, PNG, WEBP
- [ ] Gambar clear dan readable
- [ ] Banner image uploaded (required)

### Browser
- [ ] Browser console no error (F12)
- [ ] Network tab shows request sent
- [ ] Response status 200 (not 401, 500, etc)

---

## 🔧 Advanced Debugging

### Tambah Logging di Component

Edit `components/ShopUploadForm.tsx`:

```typescript
const handleAnalyze = async () => {
  console.log('[FORM] Starting analysis...')
  console.log('[FORM] Banner image:', bannerImage?.name, bannerImage?.size)
  console.log('[FORM] Product images:', productImages.length)
  
  try {
    const formData = new FormData()
    formData.append('bannerImage', bannerImage!)
    
    console.log('[FORM] FormData created, sending to API...')
    
    const response = await fetch('/api/analyze-shop', {
      method: 'POST',
      body: formData,
    })

    console.log('[FORM] Response status:', response.status)
    const data = await response.json()
    console.log('[FORM] Response data:', data)
    
    if (!response.ok) {
      console.error('[FORM] API error:', data)
      throw new Error(data.error || 'Gagal menganalisis gambar')
    }
    
    // ...rest of code
  } catch (error: any) {
    console.error('[FORM] Caught error:', error)
    setError(error.message || 'Gagal menganalisis gambar')
  }
}
```

### Check Environment Variables di Runtime

Buat test endpoint `app/api/test-env/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET (hidden)' : 'NOT SET',
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'default',
    NODE_ENV: process.env.NODE_ENV
  })
}
```

Test:
```
http://localhost:3000/api/test-env
```

---

## 📞 Quick Help Reference

| Error Message | Quick Fix |
|--------------|-----------|
| API Key tidak dikonfigurasi | Isi `OPENAI_API_KEY` di `.env.local` → Restart |
| 401 Unauthorized | Check API key valid di dashboard provider |
| Model not found | Check `OPENAI_BASE_URL` sesuai provider |
| Foto wajib diupload | Check form input name="bannerImage" |
| Size terlalu besar | Compress gambar < 10MB |
| Failed to fetch | Restart dev server |
| JSON parse error | Use fallback response (form tetap editable) |
| Rate limit | Wait or upgrade quota |

---

## 🆘 Masih Error?

1. **Check semua logs:** Terminal + Browser Console + Network tab
2. **Copy error message lengkap**
3. **Check persis di mana error terjadi:**
   - Saat upload? → Problem di frontend
   - Saat API call? → Problem di API/network
   - Saat parse response? → Problem di AI response

4. **Pastikan:**
   - Environment variables correct
   - API key valid & has credit
   - Images valid & readable
   - Server running without error

---

**Good luck debugging! 🐛🔍**

Made with ❤️ for UMKM Indonesia
