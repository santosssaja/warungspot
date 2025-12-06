import Link from 'next/link'
import { Camera, MapPin, Zap, Globe, ArrowRight, Store } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-orange-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Store className="w-8 h-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">WarungSpot</h1>
          </div>
          <nav className="flex gap-4">
            <Link 
              href="/explore" 
              className="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              Eksplor
            </Link>
            <Link 
              href="/login" 
              className="px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
            >
              Masuk
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                🚀 Platform Peta UMKM Terbaru
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              Satu Foto,<br />
              <span className="text-orange-600">Langsung di Peta</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Pedagang tidak perlu mengetik alamat atau mengisi formulir pendaftaran. 
              Cukup upload foto spanduk toko, AI yang bekerja! 🤖
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link 
                href="/explore"
                className="px-8 py-4 bg-orange-600 text-white rounded-full text-lg font-semibold hover:bg-orange-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                Lihat Demo Peta
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/login"
                className="px-8 py-4 bg-white text-orange-600 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all border-2 border-orange-600 flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Tambah Toko Saya
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Kenapa WarungSpot?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Upload Foto Aja</h3>
              <p className="text-gray-600 leading-relaxed">
                Foto spanduk toko dan produk. AI otomatis baca nama toko, nomor HP, 
                dan bikin deskripsi promosi yang menarik!
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">AI yang Pintar</h3>
              <p className="text-gray-600 leading-relaxed">
                Teknologi AI canggih ekstrak semua info dari foto. Gak perlu ketik-ketik lagi. 
                Hemat waktu, anti ribet!
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Otomatis di Peta</h3>
              <p className="text-gray-600 leading-relaxed">
                Lokasi toko langsung terdeteksi dan muncul di peta. Pelanggan bisa 
                temukan warung kamu dengan mudah!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Cara Kerjanya Super Gampang
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Foto Spanduk</h3>
              <p className="text-gray-600 text-sm">Ambil foto spanduk atau brosur toko kamu</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Upload Gambar</h3>
              <p className="text-gray-600 text-sm">Upload ke aplikasi, bisa tambahin foto produk juga</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">AI Proses</h3>
              <p className="text-gray-600 text-sm">AI baca semua info dan bikin deskripsi promosi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="font-bold text-lg mb-2">Muncul di Peta</h3>
              <p className="text-gray-600 text-sm">Toko kamu langsung nongol di peta, siap ditemukan!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-amber-600">
        <div className="container mx-auto max-w-4xl text-center">
          <Globe className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Siap Tampilkan Warung Kamu?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Gabung sekarang dan biarkan pelanggan menemukan usaha kamu dengan mudah!
          </p>
          <Link 
            href="/explore"
            className="inline-block px-10 py-4 bg-white text-orange-600 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            Mulai Sekarang - GRATIS!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Store className="w-6 h-6 text-orange-500" />
            <span className="text-xl font-bold">WarungSpot</span>
          </div>
          <p className="text-gray-400">
            Platform Peta UMKM dengan AI - Satu Foto, Langsung di Peta
          </p>
          <p className="text-gray-500 text-sm mt-4">
            © 2025 WarungSpot. Dibuat dengan ❤️ untuk UMKM Indonesia
          </p>
        </div>
      </footer>
    </div>
  )
}
