'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Store, ArrowLeft, MapPin, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ShopDetailModal from '@/components/shop/ShopDetailModal'

const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat peta...</p>
      </div>
    </div>
  ),
})

interface Shop {
  id: string
  shop_name: string
  category: string
  marketing_desc: string
  latitude: number
  longitude: number
  phone_number?: string
  address_clue?: string
  banner_image_url?: string
  product_images_urls?: string[]
}

export default function ExplorePage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setShops(data || [])
    } catch (error) {
      console.error('Error fetching shops:', error)
      // For demo purposes, use sample data if database is not set up yet
      setShops([
        {
          id: '1',
          shop_name: 'Warung Sate Pak Budi',
          category: 'Sate',
          marketing_desc: 'Sate ayam legendaris dengan bumbu kacang rahasia! Bikin ketagihan, dijamin balik lagi! 🔥',
          latitude: -6.2088,
          longitude: 106.8456,
          phone_number: '081234567890',
          address_clue: 'Depan Stasiun Manggarai'
        },
        {
          id: '2',
          shop_name: 'Bakso Mercon Mas Iwan',
          category: 'Bakso',
          marketing_desc: 'Bakso super pedas yang bikin lidah bergoyang! Berani coba level 5? 🌶️',
          latitude: -6.2098,
          longitude: 106.8466,
          phone_number: '081234567891',
          address_clue: 'Samping Indomaret'
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredShops = shops.filter((shop) =>
    shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Store className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">WarungSpot</h1>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Beranda</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari toko atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat toko-toko...</p>
            </div>
          </div>
        ) : (
          <MapComponent
            shops={filteredShops}
            onShopClick={setSelectedShop}
          />
        )}

        {/* Stats Overlay */}
        <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg px-4 py-3 z-[1000]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredShops.length}</p>
              <p className="text-xs text-gray-600">Toko Terdaftar</p>
            </div>
          </div>
        </div>

        {/* Shop List (Mobile) */}
        <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl shadow-2xl max-h-48 overflow-y-auto z-[1000] md:hidden">
          <div className="p-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="font-bold text-lg mb-3">Daftar Toko ({filteredShops.length})</h3>
            <div className="space-y-3">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => setSelectedShop(shop)}
                  className="p-3 bg-orange-50 rounded-lg active:bg-orange-100 cursor-pointer"
                >
                  <h4 className="font-semibold text-orange-900">{shop.shop_name}</h4>
                  <p className="text-sm text-orange-700">{shop.category}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">{shop.marketing_desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shop List (Desktop) */}
        <div className="hidden md:block absolute top-4 right-4 w-80 bg-white rounded-xl shadow-2xl max-h-[calc(100vh-120px)] overflow-y-auto z-[1000]">
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
            <h3 className="font-bold text-lg">Daftar Toko ({filteredShops.length})</h3>
          </div>
          <div className="p-4 space-y-3">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => setSelectedShop(shop)}
                className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors cursor-pointer"
              >
                <h4 className="font-semibold text-orange-900 mb-1">{shop.shop_name}</h4>
                <p className="text-sm text-orange-700 mb-2">{shop.category}</p>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{shop.marketing_desc}</p>
                {shop.phone_number && (
                  <div className="inline-flex items-center gap-1 text-sm text-blue-600">
                    📞 {shop.phone_number}
                  </div>
                )}
              </div>
            ))}
            {filteredShops.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Tidak ada toko yang ditemukan</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Shop Button */}
        <Link
          href="/login"
          className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 z-[1000] flex items-center gap-2 font-semibold"
        >
          <Store className="w-5 h-5" />
          <span className="hidden sm:inline">Tambah Toko</span>
        </Link>
      </div>

      {/* Detail Modal */}
      {selectedShop && (
        <ShopDetailModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
        />
      )}
    </div>
  )
}
