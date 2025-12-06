# 🔐 Setup Google Login (Supabase)

Panduan ini menjelaskan cara mengaktifkan "Login with Google" menggunakan Supabase Auth.

## 1. Google Cloud Console Setup

1.  Buka [Google Cloud Console](https://console.cloud.google.com/).
2.  Buat **Project Baru** atau pilih project yang sudah ada.
3.  Pergi ke **APIs & Services** > **OAuth consent screen**.
    -   Pilih **External** (untuk testing) atau **Internal** (jika organisasi).
    -   Isi **App Name**, **User Support Email**, dan **Developer Contact Information**.
    -   Klik **Save and Continue**.
4.  Pergi ke **Credentials**.
    -   Klik **Create Credentials** > **OAuth client ID**.
    -   Application type: **Web application**.
    -   Name: `WarungSpot Web` (atau nama lain).
    -   **Authorized redirect URIs**:
        -   Anda perlu URL dari Supabase. Lihat langkah selanjutnya.
    -   Klik **Create**.
    -   Salin **Client ID** dan **Client Secret**.

## 2. Supabase Dashboard Setup

1.  Buka Project Anda di [Supabase Dashboard](https://supabase.com/dashboard).
2.  Pergi ke **Authentication** > **Providers**.
3.  Pilih **Google**.
4.  Aktifkan toggle **Enable Google**.
5.  Masukkan **Client ID** dan **Client Secret** dari langkah sebelumnya.
6.  Salin **Callback URL (untuk OAuth)** yang ada di halaman ini (contoh: `https://<project-ref>.supabase.co/auth/v1/callback`).
7.  Kembali ke **Google Cloud Console** > **Credentials** > Edit OAuth Client Anda.
8.  Paste URL tersebut ke bagian **Authorized redirect URIs**.
9.  Klik **Save** di Google Cloud Console.
10. Klik **Save** di Supabase Dashboard.

## 3. Environment Variables (Optional)

Biasanya tidak perlu konfigurasi tambahan di `.env.local` client-side karena Supabase Client sudah menangani redirect ke URL project Supabase. Namun, pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` sudah benar.

## 4. Testing

1.  Jalankan aplikasi: `npm run dev`.
2.  Buka halaman Login.
3.  Klik tombol **Sign in with Google**.
4.  Anda harusnya diarahkan ke halaman login Google, dan kembali ke aplikasi setelah sukses.

> **Note**: Saat development (`localhost`), pastikan URL `http://localhost:3000` juga ditambahkan di **Authentication** > **URL Configuration** > **Redirect URLs** di Supabase Dashboard jika Anda mengalami masalah redirect.
