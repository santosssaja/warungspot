# 🛠️ Setup Guide

## Prasyarat
- Node.js 18+
- Git
- Akun Supabase

## 1. Instalasi
```bash
git clone https://github.com/santosssaja/warungspot.git
cd warungspot
npm install
```

## 2. Konfigurasi Supabase
Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard).
Masukkan query SQL di [SQL Editor](https://supabase.com/dashboard/sql-editor): dari file `supabase-schema.sql`.

## 3. Environment Variables
Copy `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel berikut:
- `NEXT_PUBLIC_SUPABASE_URL`: Project Settings > API > Project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Project Settings > API > anon public
- `KOLOSAL_API_KEY` (Recommended) atau `OPENAI_API_KEY` atau `GOOGLE_GENERATIVE_AI_API_KEY` : Untuk fitur AI.

> **Note**: Jangan gunakan `service_role` key di frontend!

## 4. Menjalankan Aplikasi
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000).
