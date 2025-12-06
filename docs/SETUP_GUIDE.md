# 🚀 Panduan Setup WarungSpot

Panduan lengkap untuk setup dan menjalankan WarungSpot dari awal.

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah punya:

- ✅ Node.js 18+ terinstall
- ✅ npm atau yarn
- ✅ Git (untuk version control)
- ✅ Text editor (VS Code recommended)
- ✅ Browser modern (Chrome, Firefox, Edge)

## 🔧 Step-by-Step Setup

### Step 1: Buat Akun Supabase

1. Buka [supabase.com](https://supabase.com)
2. Klik "Start Your Project"
3. Sign up dengan GitHub atau email
4. Buat **New Project**:
   - Organization: Pilih atau buat baru
   - Name: `warungspot` (atau nama lain)
   - Database Password: Buat password kuat (simpan baik-baik!)
   - Region: Pilih yang terdekat (Southeast Asia - Singapore recommended)
   - Klik "Create new project"
5. Tunggu ~2 menit hingga project ready

### Step 2: Setup Database Schema

1. Di Supabase Dashboard, buka **SQL Editor** (icon di sidebar kiri)
2. Klik "New query"
3. Copy seluruh isi file `../supabase-schema.sql` dari project ini
4. Paste ke SQL Editor
5. Klik **Run** atau tekan `Ctrl+Enter`
6. Pastikan muncul pesan sukses (hijau) - bukan error merah

**Apa yang dibuat:**
- Table `shops` untuk menyimpan data toko
- Storage bucket `shop-images` untuk gambar
- Row Level Security policies
- Indexes untuk performa

### Step 3: Dapatkan Supabase Credentials

1. Di Supabase Dashboard, buka **Settings** > **API**
2. Copy dua value ini:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Publishable Key (anon public)**: Key yang panjang (klik icon copy)
3. Simpan sementara di notepad

> 💡 **Tips:** Bingung tentang keys mana yang digunakan? Baca panduan lengkap di [SUPABASE_KEYS_GUIDE.md](SUPABASE_KEYS_GUIDE.md)

### Step 4: Setup Google OAuth (OPSIONAL)

> **Note**: Step ini opsional. Anda masih bisa login dengan email/password tanpa Google OAuth.

#### 4.1. Buat OAuth Credentials di Google Cloud

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing
3. Enable **Google+ API**:
   - Menu > APIs & Services > Library
   - Cari "Google+ API"
   - Klik "Enable"
4. Buat OAuth Consent Screen:
   - Menu > APIs & Services > OAuth consent screen
   - User Type: External
   - App name: "WarungSpot"
   - User support email: email Anda
   - Developer contact: email Anda
   - Save and Continue
5. Buat Credentials:
   - Menu > APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: Web application
   - Name: "WarungSpot Web"
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
     (Ganti `your-project` dengan project ID Supabase Anda)
   - Klik "Create"
   - Copy **Client ID** dan **Client Secret**

#### 4.2. Configure di Supabase

1. Di Supabase Dashboard > **Authentication** > **Providers**
2. Cari **Google** provider
3. Enable toggle
4. Paste **Client ID** dan **Client Secret** dari Google
5. Klik "Save"

### Step 5: Setup API Key Kolosal AI

1. Buka [https://api.kolosal.com](https://api.kolosal.com)
2. Sign up / Login
3. Buat API Key baru
4. Copy API Key yang diberikan

**Alternatif**: Jika tidak punya Kolosal AI, bisa pakai **OpenAI API**:
- Buka [platform.openai.com](https://platform.openai.com)
- Create API Key
- Ganti `OPENAI_BASE_URL` di .env.local menjadi `https://api.openai.com/v1`

### Step 6: Konfigurasi Environment Variables

1. Buka file `../.env.local` di root project
2. Isi dengan credentials yang sudah dikumpulkan:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Publishable Key)

# OpenAI Configuration (Kolosal AI)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.kolosal.com/v1
```

3. **Save** file

⚠️ **PENTING**: Jangan commit file `.env.local` ke Git! Sudah ada di `.gitignore`.

### Step 7: Install Dependencies

Jika belum diinstall, jalankan:

```bash
npm install
```

### Step 8: Test Build

Pastikan tidak ada error:

```bash
npm run build
```

Kalau sukses, akan muncul:
```
✓ Compiled successfully
✓ Generating static pages
```

### Step 9: Run Development Server

```bash
npm run dev
```

Buka browser ke [http://localhost:3000](http://localhost:3000)

## ✅ Checklist Testing

Setelah aplikasi running, test fitur-fitur ini:

### Landing Page
- [ ] Landing page muncul dengan baik
- [ ] Button "Lihat Demo Peta" berfungsi
- [ ] Button "Masuk" mengarah ke login

### Explore Page (Tanpa Login)
- [ ] Peta muncul (OpenStreetMap)
- [ ] Lokasi user terdeteksi (minta izin location)
- [ ] Sample shops muncul di peta (3 marker merah)
- [ ] Klik marker menampilkan popup info toko
- [ ] Search bar bisa filter toko

### Authentication
- [ ] Halaman signup muncul
- [ ] Bisa daftar dengan email/password
- [ ] Dapat email verifikasi dari Supabase
- [ ] Halaman login muncul
- [ ] Bisa login dengan email/password
- [ ] (Opsional) Bisa login dengan Google

### Dashboard (Setelah Login)
- [ ] Redirect ke `/dashboard` setelah login
- [ ] Form upload foto muncul
- [ ] Status lokasi terdeteksi
- [ ] Upload foto spanduk berhasil (preview muncul)
- [ ] Upload foto produk berhasil (preview muncul)
- [ ] Button "Analisis dengan AI" aktif
- [ ] Klik analisis: loading state muncul
- [ ] Setelah analisis: form autofill dengan hasil AI
- [ ] Bisa edit data manual
- [ ] Submit form berhasil
- [ ] Redirect ke explore page
- [ ] Toko baru muncul di peta

## 🐛 Troubleshooting

### Error: "Invalid supabaseUrl"
**Solusi**: Pastikan `NEXT_PUBLIC_SUPABASE_URL` di `.env.local` sudah benar format `https://xxxxx.supabase.co`

### Error: "Failed to fetch" saat login
**Solusi**: 
- Cek koneksi internet
- Pastikan Supabase project masih aktif (buka dashboard)
- Cek API key masih valid

### Peta tidak muncul
**Solusi**:
- Clear browser cache
- Periksa console browser (F12) untuk error
- Pastikan Leaflet CSS sudah diimport di `globals.css`

### Error 401 saat analisis AI
**Solusi**:
- Cek `OPENAI_API_KEY` di `.env.local` valid
- Pastikan API key punya quota/credit
- Coba restart dev server: `Ctrl+C` lalu `npm run dev` lagi

### Foto tidak bisa diupload
**Solusi**:
- Pastikan storage bucket `shop-images` sudah dibuat di Supabase
- Cek storage policies sudah dijalankan (dari `supabase-schema.sql`)
- Periksa size foto < 10MB

### Lokasi tidak terdeteksi
**Solusi**:
- Izinkan browser access location (popup permission)
- Kalau masih gagal, akan default ke Jakarta (-6.2088, 106.8456)
- Coba buka di HTTPS (location API butuh secure context)

## 📱 Deploy ke Production

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Publishable Key)
   - `OPENAI_API_KEY`
   - `OPENAI_BASE_URL`
4. Deploy!
5. Update Google OAuth redirect URI dengan domain Vercel

### Manual Deploy

```bash
npm run build
npm start
```

## 🎓 Tips Pengembangan

1. **Hot Reload**: Pakai `npm run dev` - otomatis reload saat edit code
2. **Type Safety**: TS akan error kalau ada typo atau type salah
3. **API Testing**: Pakai Postman/Thunder Client untuk test `/api/analyze-shop`
4. **Database**: Pakai Supabase Table Editor untuk lihat/edit data manual
5. **Logs**: Check Supabase Logs untuk debug auth/database issues

## 📞 Need Help?

- **Documentation**: Baca `README.md` untuk overview
- **Database Schema**: Lihat `supabase-schema.sql` untuk struktur DB
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

Happy Coding! 🚀
