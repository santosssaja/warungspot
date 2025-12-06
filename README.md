# WarungSpot: Satu Foto, Langsung di Peta 🗺️📱

Platform peta UMKM berbasis AI yang memudahkan pedagang untuk mendaftarkan toko mereka hanya dengan upload foto spanduk. AI akan otomatis membaca dan mengekstrak informasi dari foto!

![WarungSpot Banner](https://img.shields.io/badge/WarungSpot-UMKM%20Platform-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)

---

## ⚡ Quick Start

Ingin langsung mencoba? Ikuti langkah cepat ini (5 menit):

1.  **Setup Supabase**:
    *   Buat project di [supabase.com](https://supabase.com).
    *   Run query dari [`supabase-schema.sql`](supabase-schema.sql) di SQL Editor.
    *   Ambil **URL** & **Anon Key** dari Settings > API.

2.  **Setup Environment**:
    *   Copy `.env.example` ke `.env.local`.
    *   Isi credentials Supabase dan AI (Kolosal/OpenAI).

3.  **Run**:
    ```bash
    npm install
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) 🎉

> **Butuh panduan detail?** Baca **[📖 Panduan Setup Lengkap](docs/SETUP_GUIDE.md)**.

---

## 📚 Dokumentasi

Semua dokumentasi lengkap sekarang ada di folder [`docs/`](docs/):

*   **[📂 Index Dokumentasi](docs/index.md)** - Mulai dari sini untuk navigasi lengkap.
*   **[🛠️ Setup Guide](docs/SETUP_GUIDE.md)** - Panduan instalasi step-by-step.
*   **[🔑 Supabase Keys](docs/SUPABASE_KEYS_GUIDE.md)** - Penjelasan security keys.
*   **[📝 Todo Checklist](docs/TODO_CHECKLIST.md)** - Checklist testing fitur.
*   **[🐛 Debugging API](docs/DEBUG_API_GUIDE.md)** - Cara fix masalah API.

---

## 🌟 Fitur Utama

### 1. Upload Foto Aja! 📸
*   Pedagang tidak perlu mengetik alamat atau mengisi formulir panjang.
*   Cukup upload foto spanduk toko atau brosur.
*   AI otomatis membaca semua informasi penting.

### 2. AI yang Pintar 🤖
*   Menggunakan **Kolosal AI (MiniMax M2)** untuk analisis gambar.
*   Ekstrak nama toko, nomor HP, petunjuk alamat otomatis.
*   Generate deskripsi promosi yang menarik.

### 3. Peta Interaktif 🗺️
*   Menggunakan **OpenStreetMap** (gratis!).
*   Geolocation otomatis mendeteksi lokasi pengguna.
*   Marker custom untuk user dan toko.

### 4. Autentikasi Mudah 🔐
*   Login dengan email/password.
*   **Google OAuth** supported.
*   Powered by **Supabase Auth**.

---

## 🚀 Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Database**: Supabase (PostgreSQL)
*   **AI**: OpenAI SDK (Kolosal AI - MiniMax M2)
*   **Maps**: Leaflet + React-Leaflet
*   **Icons**: Lucide React

---

## 📁 Project Structure

```
warungspot/
├── app/                 # Next.js App Router
├── components/          # React Components
├── docs/                # 📚 Dokumentasi Project
├── lib/                 # Utilities & Supabase Client
├── public/              # Static Assets
├── supabase-schema.sql  # Database Schema
└── .env.local           # Env Vars (Gitignored)
```

---

## 🤝 Contributing

Contributions welcome! Silakan buat issue atau pull request.

## 📄 License

MIT License - bebas digunakan untuk project pribadi maupun komersial.

---

**Dibuat dengan ❤️ untuk UMKM Indonesia**

© 2025 WarungSpot
