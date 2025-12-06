# 🏗️ Architecture & Structure

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Kolosal AI (MiniMax M2) / OpenAI / Gemini
- **Maps**: Leaflet, React-Leaflet, OpenStreetMap

## Struktur Project
```
warungspot/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes (AI Analysis)
│   ├── auth/               # Auth Callbacks
│   ├── dashboard/          # Protected User Area
│   ├── explore/            # Public Map View
│   └── page.tsx            # Landing Page
├── components/
│   ├── auth/               # Login/Signup Forms
│   ├── dashboard/          # Dashboard Widgets
│   ├── map/                # Map & Location Components
│   └── shop/               # Shop Forms & Modals
├── lib/
│   ├── supabase/           # Supabase Client & Server Utils
│   └── types/              # TypeScript Definitions
└── docs/                   # Documentation
```

## Core Components

### Map System
Menggunakan `react-leaflet` dengan custom markers.
- `MapComponent.tsx`: Main map view.
- `LocationPicker.tsx`: Draggable marker untuk set lokasi toko.

### AI Analysis
Endpoint `/api/analyze-shop` menerima gambar, mengirim ke AI Provider, dan mengembalikan JSON berisi:
- Nama Toko
- Kategori
- No HP
- Alamat
- Deskripsi Marketing

### Database Schema
Tabel `shops`:
- `user_id`: Link ke Supabase Auth.
- `banner_image_url`: Link ke Supabase Storage.
- `latitude/longitude`: Koordinat lokasi.
