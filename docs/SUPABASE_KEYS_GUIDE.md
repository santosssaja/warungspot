# 🔑 Panduan Supabase Keys

Panduan singkat untuk memahami keys yang digunakan di WarungSpot.

---

## 📌 Keys yang Dibutuhkan

### 1. Project URL
**Nama di Supabase Dashboard:** `Project URL` atau `API URL`

**Lokasi:** Settings > API > Project URL

**Contoh:**
```
https://abcdefghijklmno.supabase.co
```

**Digunakan untuk:**
- Koneksi ke Supabase database
- Koneksi ke Supabase Storage
- Koneksi ke Supabase Auth

**Environment Variable:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmno.supabase.co
```

---

### 2. Publishable Key (anon public)
**Nama di Supabase Dashboard:** 
- `anon` key (di bagian Project API keys)
- Atau disebut juga **"Publishable key"** atau **"anon public"**

**Lokasi:** Settings > API > Project API keys > anon public

**Contoh:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ubyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjc4ODg4ODg4LCJleHAiOjE5OTQ0NjQ4ODh9.xxxxx-xxxxxx-xxxxx
```

**Digunakan untuk:**
- Client-side authentication
- Public API access
- Row Level Security (RLS) policies
- Safe untuk diexpose di frontend (public)

**Environment Variable:**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ CATATAN PENTING:**
- Key ini aman untuk digunakan di frontend (browser)
- Protected oleh Row Level Security (RLS) policies
- Tidak boleh digunakan untuk bypass RLS
- Prefix `NEXT_PUBLIC_` artinya akan di-expose ke browser

---

## 🔐 Keys yang TIDAK Digunakan di WarungSpot

### Service Role Key ⛔
**JANGAN GUNAKAN** key ini di frontend!

**Nama di Supabase Dashboard:** `service_role` secret

**Bahaya jika digunakan:**
- Bypass semua RLS policies
- Full admin access ke database
- Jika bocor = database bisa dihack!

**Hanya untuk:**
- Backend server-side operations
- Admin scripts
- Database migrations
- TIDAK untuk Next.js frontend

---

## 📋 Checklist Setup Keys

### ✅ Yang Harus Dilakukan:

1. **Copy Project URL**
   - [ ] Buka Supabase Dashboard
   - [ ] Settings > API
   - [ ] Copy **Project URL**
   - [ ] Paste ke `.env.local` sebagai `NEXT_PUBLIC_SUPABASE_URL`

2. **Copy Publishable Key (anon public)**
   - [ ] Masih di Settings > API
   - [ ] Scroll ke **Project API keys**
   - [ ] Cari key dengan label `anon` atau `public`
   - [ ] Klik icon copy (📋)
   - [ ] Paste ke `.env.local` sebagai `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Verify**
   - [ ] Pastikan kedua keys sudah terisi
   - [ ] URL harus format: `https://xxxxx.supabase.co`
   - [ ] Key harus format JWT (mulai dengan `eyJ...`)
   - [ ] Tidak ada spasi di awal/akhir

### ⛔ Yang JANGAN Dilakukan:

- ❌ **JANGAN** gunakan `service_role` key
- ❌ **JANGAN** commit `.env.local` ke Git (sudah di `.gitignore`)
- ❌ **JANGAN** share keys di public (Discord, forum, dll)
- ❌ **JANGAN** hardcode keys di source code

---

## 🔍 Cara Cek Keys di Supabase

### Step-by-Step:

1. Login ke [supabase.com](https://supabase.com)
2. Pilih project "warungspot" (atau nama project Anda)
3. Klik icon **Settings** (⚙️) di sidebar kiri bawah
4. Klik **API** di menu settings
5. Lihat dua section:

#### Section 1: Configuration
```
Project URL: https://xxxxx.supabase.co
```
👆 Copy ini untuk `NEXT_PUBLIC_SUPABASE_URL`

#### Section 2: Project API keys
```
anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[Copy button] [Reveal button]
```
👆 Copy ini untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🛡️ Keamanan Keys

### Publishable Key (anon) adalah AMAN karena:

1. **Row Level Security (RLS)**
   - Semua tables protected oleh RLS policies
   - User hanya bisa akses data sesuai policy
   - Defined di `supabase-schema.sql`

2. **Rate Limiting**
   - Supabase membatasi requests per key
   - Mencegah abuse

3. **Audit Logs**
   - Supabase mencatat semua aktivitas
   - Bisa monitor di dashboard

### Best Practices:

✅ Gunakan RLS policies untuk semua tables
✅ Test policies sebelum production
✅ Monitor logs secara berkala
✅ Rotate keys jika ada breach
✅ Gunakan environment variables

---

## 🆘 Troubleshooting

### Error: "Invalid API key"
**Solusi:**
- Cek key sudah di-copy lengkap (tidak terpotong)
- Pastikan tidak ada spasi di awal/akhir
- Pastikan menggunakan key yang benar (anon, bukan service_role)
- Try regenerate key di Supabase dashboard

### Error: "supabaseUrl is required"
**Solusi:**
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` terisi
- Format harus: `https://xxxxx.supabase.co`
- Restart dev server setelah edit `.env.local`

### Error: "Failed to fetch"
**Solusi:**
- Cek koneksi internet
- Cek Supabase project masih aktif (buka dashboard)
- Cek tidak ada typo di URL
- Try clear browser cache

---

## 📚 Referensi

- [Supabase API Keys Documentation](https://supabase.com/docs/guides/api/api-keys)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Environment Variables in Next.js](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## ✅ Quick Reference

| Key Name (Dashboard) | Environment Variable | Aman di Frontend? | Digunakan untuk |
|---------------------|---------------------|-------------------|-----------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Connection string |
| anon (public) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Client auth/API |
| service_role | ❌ **DON'T USE** | ❌ **NO** | Server admin only |

---

**Ingat:** Hanya gunakan **anon public** (Publishable Key) untuk frontend WarungSpot! 🔐

Made with ❤️ for UMKM Indonesia
