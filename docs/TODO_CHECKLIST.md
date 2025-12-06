# ✅ WarungSpot - Setup Checklist

Ikuti checklist ini untuk memastikan aplikasi berjalan dengan sempurna!

---

## 🎯 Phase 1: Setup Akun & Credentials (10 menit)

### Supabase Setup
- [ ] Buat akun di [supabase.com](https://supabase.com)
- [ ] Buat project baru dengan nama "warungspot"
- [ ] Tunggu project siap (~2 menit)
- [ ] Buka Settings > API
- [ ] Copy **Project URL** → Simpan di notepad
- [ ] Copy **Publishable Key (anon public)** → Simpan di notepad
- [ ] 💡 **Bingung?** Lihat [SUPABASE_KEYS_GUIDE.md](SUPABASE_KEYS_GUIDE.md) untuk panduan detail

### Database Setup
- [ ] Buka **SQL Editor** di Supabase dashboard
- [ ] Klik "New query"
- [ ] Open file `../supabase-schema.sql` di text editor
- [ ] Copy semua isi file
- [ ] Paste ke Supabase SQL Editor
- [ ] Klik **Run** atau tekan Ctrl+Enter
- [ ] Pastikan muncul "Success. No rows returned"
- [ ] Verify: Buka **Table Editor** → Harus ada table "shops"
- [ ] Verify: Buka **Storage** → Harus ada bucket "shop-images"

### AI API Setup
- [ ] **Pilih salah satu:**
  
  **Option A: Kolosal AI**
  - [ ] Buka [api.kolosal.com](https://api.kolosal.com)
  - [ ] Sign up / Login
  - [ ] Create API Key
  - [ ] Copy API Key
  - [ ] Note: Base URL = `https://api.kolosal.com/v1`
  
  **Option B: OpenAI**
  - [ ] Buka [platform.openai.com](https://platform.openai.com)
  - [ ] Login / Sign up
  - [ ] Buka API Keys
  - [ ] Create new secret key
  - [ ] Copy API Key
  - [ ] Note: Base URL = `https://api.openai.com/v1`

---

## 🔧 Phase 2: Konfigurasi Project (2 menit)

### Environment Variables
- [ ] Buka file `../.env.local` di root project
- [ ] Ganti `https://xxxxx.supabase.co` dengan Supabase Project URL Anda
- [ ] Ganti `your-publishable-key-here` dengan Supabase Publishable Key Anda
- [ ] Ganti `your-openai-api-key-here` dengan AI API key Anda
- [ ] Jika pakai OpenAI, ganti base URL jadi `https://api.openai.com/v1`
- [ ] **Save** file
- [ ] Verify: File `.env.local` tidak ada placeholder "your-xxx"

### Verification
- [ ] Pastikan semua env variables sudah terisi
- [ ] Jangan ada yang masih "your-xxx-here"
- [ ] Format URL harus valid (https://)
- [ ] API key harus tidak ada spasi di awal/akhir

---

## 🚀 Phase 3: Run & Test Application (5 menit)

### Build Test
```bash
npm run build
```
- [ ] Command berhasil tanpa error
- [ ] Muncul "✓ Compiled successfully"
- [ ] Muncul "✓ Generating static pages"
- [ ] Exit code: 0 (sukses)

### Run Development Server
```bash
npm run dev
```
- [ ] Server running di http://localhost:3000
- [ ] No error di terminal
- [ ] Buka browser ke http://localhost:3000
- [ ] Landing page muncul dengan sempurna

---

## ✨ Phase 4: Test Fitur-Fitur (10 menit)

### Test Landing Page
- [ ] Landing page loads tanpa error
- [ ] Hero section tampil
- [ ] Button "Lihat Demo Peta" ada
- [ ] Button "Tambah Toko Saya" ada
- [ ] Footer tampil
- [ ] Responsive di mobile (resize browser)
- [ ] Klik "Lihat Demo Peta" → Redirect ke /explore

### Test Explore Page (Public - No Login)
- [ ] Peta muncul (OpenStreetMap tiles)
- [ ] Browser minta izin location (Allow)
- [ ] User location marker muncul (blue circle)
- [ ] 3 sample shops muncul (red markers)
- [ ] Klik marker shop → Popup info muncul
- [ ] Search bar berfungsi
- [ ] Shop list tampil (desktop: sidebar, mobile: bottom sheet)
- [ ] Button "Tambah Toko" muncul

### Test Authentication - Signup
- [ ] Klik "Daftar" di header
- [ ] Form signup muncul
- [ ] Isi nama, email, password (min 6 char)
- [ ] Klik "Daftar Sekarang"
- [ ] Muncul success message
- [ ] Cek email → Ada verification email dari Supabase
- [ ] Klik link verifikasi di email
- [ ] Account verified

### Test Authentication - Login
- [ ] Klik "Masuk" di header
- [ ] Form login muncul
- [ ] Masukkan email & password yang tadi didaftar
- [ ] Klik "Masuk"
- [ ] Redirect ke /dashboard
- [ ] Header menampilkan email user
- [ ] Tombol "Keluar" ada

### Test Google OAuth (Optional - Skip if not setup)
- [ ] Klik "Masuk dengan Google"
- [ ] Redirect ke Google login
- [ ] Pilih akun Google
- [ ] Authorize app
- [ ] Redirect kembali ke /dashboard
- [ ] Login berhasil

### Test Dashboard - Upload Shop
- [ ] Halaman dashboard muncul
- [ ] Welcome message tampil dengan nama user
- [ ] Form upload muncul
- [ ] Status lokasi: "✓ Terdeteksi"
- [ ] Latitude & longitude terisi otomatis

### Test AI Analysis
- [ ] Klik "Foto Spanduk Toko"
- [ ] Upload foto spanduk (JPG/PNG)
- [ ] Preview gambar muncul
- [ ] (Optional) Klik "Foto Produk" → Upload 1-3 foto
- [ ] Preview produk muncul
- [ ] Button "Analisis dengan AI" aktif (tidak disabled)
- [ ] Klik "Analisis dengan AI"
- [ ] Loading state muncul: "Sedang membaca tulisan di spanduk..."
- [ ] Tunggu 5-10 detik
- [ ] Form hasil muncul dengan data autofill:
  - [ ] Nama toko terisi
  - [ ] Kategori terisi
  - [ ] Deskripsi promosi terisi (2 kalimat menarik)
  - [ ] Nomor HP terisi (jika ada di foto)
  - [ ] Alamat terisi (jika ada di foto)

### Test Submit Shop
- [ ] Review data yang sudah diisi AI
- [ ] Edit jika perlu (misal: perbaiki typo)
- [ ] Klik "Simpan & Tambahkan ke Peta"
- [ ] Loading: "Menyimpan..."
- [ ] Success message muncul
- [ ] Redirect ke /explore
- [ ] Toko baru muncul di peta! 🎉
- [ ] Klik marker toko baru → Info benar

### Test Logout
- [ ] Klik tombol "Keluar" di header
- [ ] Redirect ke homepage
- [ ] Session cleared (klik "Masuk" lagi → harus login)

---

## 🔍 Phase 5: Verify Database (Optional)

### Supabase Dashboard
- [ ] Buka Supabase > Table Editor > shops
- [ ] Ada 1 row data (toko yang baru ditambahkan)
- [ ] Kolom terisi dengan benar:
  - [ ] shop_name
  - [ ] category
  - [ ] marketing_desc
  - [ ] latitude & longitude
  - [ ] banner_image_url (link Supabase Storage)
  - [ ] user_id (your user ID)
  - [ ] timestamps

### Supabase Storage
- [ ] Buka Supabase > Storage > shop-images
- [ ] Ada folder dengan nama = your user_id
- [ ] Di dalam folder ada file gambar:
  - [ ] xxx_banner_xxx.jpg
  - [ ] (Optional) xxx_product_0_xxx.jpg
- [ ] Klik file → Preview muncul
- [ ] Copy URL → Buka di browser → Gambar tampil (public access)

---

## 🐛 Phase 6: Troubleshooting (If Needed)

### Jika Peta Tidak Muncul
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard reload (Ctrl+Shift+R)
- [ ] Cek browser console (F12) → Lihat error
- [ ] Pastikan Leaflet CSS sudah di globals.css
- [ ] Restart dev server

### Jika Login Gagal
- [ ] Cek `.env.local` → Supabase URL & key benar?
- [ ] Cek Supabase dashboard → Project masih aktif?
- [ ] Cek browser console → Lihat error message
- [ ] Try incognito mode (clear cookies)

### Jika AI Analysis Error
- [ ] Cek `.env.local` → OPENAI_API_KEY benar?
- [ ] Cek API key masih valid (login ke dashboard)
- [ ] Cek quota API (apakah masih ada credit?)
- [ ] Check network tab (F12) → Response error
- [ ] Restart dev server setelah edit .env

### Jika Upload Gagal
- [ ] Cek file size < 10MB
- [ ] Cek format: JPG, PNG, WEBP
- [ ] Cek storage bucket `shop-images` sudah dibuat
- [ ] Cek storage policies sudah di-run (dari .sql file)
- [ ] Cek browser console untuk error

---

## ✅ Final Checklist

Pastikan semua ini sudah dicek:

- [ ] ✅ Build berhasil tanpa error
- [ ] ✅ Dev server running
- [ ] ✅ Landing page tampil
- [ ] ✅ Explore map berfungsi
- [ ] ✅ Signup/Login berhasil
- [ ] ✅ Dashboard bisa diakses
- [ ] ✅ Upload foto berhasil
- [ ] ✅ AI analysis berfungsi
- [ ] ✅ Submit shop berhasil
- [ ] ✅ Toko muncul di peta
- [ ] ✅ Logout berfungsi
- [ ] ✅ Data tersimpan di Supabase

---

## 🎉 Selamat!

Jika semua checklist di atas ✅ (checked), berarti:

🎊 **APLIKASI WARUNGSPOT ANDA SUDAH SIAP DIGUNAKAN!** 🎊

### Next Steps:
1. 🎨 Customize design sesuai keinginan
2. 📱 Test di device mobile real
3. 🚀 Deploy ke production (Vercel)
4. 🌟 Share dengan UMKM di sekitar Anda!

---

**Happy Building! 🚀**

Jika ada masalah, cek:
- `SETUP_GUIDE.md` → Troubleshooting section
- `README.md` → Full documentation
- Browser console (F12) → Error messages
- Supabase Logs → API errors

Made with ❤️ for UMKM Indonesia
