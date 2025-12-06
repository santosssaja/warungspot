'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Store, LogOut, User, Edit, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ShopUploadForm from '../shop/ShopUploadForm'
import Image from 'next/image'

interface DashboardClientProps {
  user: any
}

interface Shop {
  id: string
  shop_name: string
  category: string
  marketing_desc: string
  latitude: number
  longitude: number
  phone_number: string
  address_clue: string
  banner_image_url: string
  product_images_urls: string[]
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  const router = useRouter()
  const supabase = createClient()

  // Get display name (from metadata or email prefix)
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  useEffect(() => {
    fetchUserShops()
  }, [user.id])

  const fetchUserShops = async () => {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setShops(data || [])
    } catch (error) {
      console.error('Error fetching shops:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleDeleteShop = async (shopId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus toko ini?')) return

    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', shopId)

      if (error) throw error

      setShops(shops.filter(s => s.id !== shopId))
    } catch (error) {
      console.error('Error deleting shop:', error)
      alert('Gagal menghapus toko')
    }
  }

  const handleEditClick = (shop: Shop) => {
    setEditingShop(shop)
    setView('edit')
  }

  const handleShopSubmit = async (data: any) => {
    try {
      const { bannerImage, productImages, ...shopData } = data
      let bannerUrl = editingShop?.banner_image_url

      // 1. Upload new banner if provided
      if (bannerImage instanceof File) {
        const bannerFileName = `${user.id}/${Date.now()}_banner_${bannerImage.name}`
        const { error: bannerUploadError } = await supabase.storage
          .from('shop-images')
          .upload(bannerFileName, bannerImage)

        if (bannerUploadError) throw bannerUploadError

        const { data: { publicUrl } } = supabase.storage
          .from('shop-images')
          .getPublicUrl(bannerFileName)

        bannerUrl = publicUrl
      }

      // 2. Upload new product images
      let productUrls = editingShop?.product_images_urls || []

      // If we have new files, upload them
      if (productImages && productImages.length > 0) {
        // Filter out existing URLs (strings) from new files (File objects)
        const newFiles = productImages.filter((img: any) => img instanceof File)
        const existingUrls = productImages.filter((img: any) => typeof img === 'string')

        const newUrls: string[] = []
        for (let i = 0; i < newFiles.length; i++) {
          const file = newFiles[i]
          const fileName = `${user.id}/${Date.now()}_product_${i}_${file.name}`
          const { error: uploadError } = await supabase.storage
            .from('shop-images')
            .upload(fileName, file)

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from('shop-images')
            .getPublicUrl(fileName)

          newUrls.push(publicUrl)
        }

        productUrls = [...existingUrls, ...newUrls]
      }

      // 3. Insert or Update
      const payload = {
        user_id: user.id,
        shop_name: shopData.shopName,
        phone_number: shopData.phoneNumber,
        address_clue: shopData.address_clue,
        category: shopData.category,
        marketing_desc: shopData.marketing_desc,
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        banner_image_url: bannerUrl,
        product_images_urls: productUrls,
      }

      if (view === 'edit' && editingShop) {
        const { error } = await supabase
          .from('shops')
          .update(payload)
          .eq('id', editingShop.id)

        if (error) throw error
        setSuccessMessage('Toko berhasil diperbarui!')
      } else {
        const { error } = await supabase
          .from('shops')
          .insert(payload)

        if (error) throw error
        setSuccessMessage('Toko berhasil ditambahkan!')
      }

      await fetchUserShops()
      setTimeout(() => {
        setSuccessMessage('')
        setView('list')
        setEditingShop(null)
      }, 2000)

    } catch (error: any) {
      console.error('Error submitting shop:', error)
      throw new Error(error.message || 'Gagal menyimpan data toko')
    }
  }

  if (successMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Berhasil!</h2>
          <p className="text-gray-600 mb-4">{successMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Store className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">WarungSpot</h1>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <User className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">{displayName}</span>
              </div>
              <Link
                href="/explore"
                className="px-4 py-2 text-orange-600 hover:text-orange-700 transition-colors font-medium"
              >
                Lihat Peta
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {view === 'list' ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard Toko</h2>
                <p className="text-gray-600 mt-1">Kelola toko-toko Anda di sini</p>
              </div>
              <button
                onClick={() => setView('create')}
                className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Tambah Toko
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Memuat data toko...</p>
              </div>
            ) : shops.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada toko</h3>
                <p className="text-gray-500 mb-6">Mulai tambahkan toko Anda agar terlihat di peta!</p>
                <button
                  onClick={() => setView('create')}
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Buat Toko Pertama
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {shops.map((shop) => (
                  <div key={shop.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-48 md:h-auto">
                      {shop.banner_image_url ? (
                        <Image
                          src={shop.banner_image_url}
                          alt={shop.shop_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Store className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-md mb-2">
                              {shop.category}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">{shop.shop_name}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {shop.marketing_desc}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Store className="w-4 h-4" />
                            {shop.address_clue || 'Tidak ada alamat'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleEditClick(shop)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteShop(shop.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => {
                setView('list')
                setEditingShop(null)
              }}
              className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium"
            >
              ← Kembali ke Dashboard
            </button>
            <ShopUploadForm
              onSubmit={handleShopSubmit}
              initialData={editingShop ? {
                shopName: editingShop.shop_name,
                phoneNumber: editingShop.phone_number,
                address_clue: editingShop.address_clue,
                category: editingShop.category,
                marketing_desc: editingShop.marketing_desc,
                latitude: editingShop.latitude,
                longitude: editingShop.longitude,
                bannerImage: editingShop.banner_image_url,
                productImages: editingShop.product_images_urls
              } : undefined}
              isEditing={view === 'edit'}
            />
          </div>
        )}
      </main>
    </div>
  )
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}
