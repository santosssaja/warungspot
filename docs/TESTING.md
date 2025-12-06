# ✅ Testing Checklist

Gunakan checklist ini untuk memastikan aplikasi berjalan dengan baik.

## 1. Setup & Config
- [ ] `.env.local` sudah terisi (Supabase URL, Anon Key, AI Key).
- [ ] Tabel `shops` sudah dibuat di Supabase.
- [ ] Bucket `shop-images` sudah dibuat dan **Public**.

## 2. Authentication
- [ ] **Sign Up**: Bisa daftar akun baru.
- [ ] **Email Verification**: Terima email (jika diaktifkan) atau auto-confirm.
- [ ] **Login**: Bisa login dengan akun yang dibuat.
- [ ] **Logout**: Berhasil keluar dan redirect ke home.

## 3. Dashboard (User)
- [ ] **Upload Foto**: Bisa upload spanduk.
- [ ] **AI Analysis**: Klik "Analisis" -> Data terisi otomatis (Nama, No HP, dll).
- [ ] **Location**: Peta muncul, marker bisa digeser.
- [ ] **Save**: Berhasil simpan toko. Redirect ke Explore.

## 4. Explore (Public)
- [ ] **Map View**: Peta muncul dengan marker toko.
- [ ] **Detail**: Klik marker -> Muncul popup info toko.
- [ ] **Search**: Bisa cari toko berdasarkan nama.

## 5. Troubleshooting Umum
- **Gambar tidak muncul?** Cek bucket `shop-images` harus Public.
- **Gagal Login?** Cek Supabase Auth settings.
- **AI Error?** Cek API Key dan Quota.
