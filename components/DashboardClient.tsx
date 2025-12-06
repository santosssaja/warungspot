'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Store, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ShopUploadForm from './ShopUploadForm'

interface DashboardClientProps {
  user: any
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleShopSubmit = async (data: any) => {
    try {
      const { bannerImage, productImages, ...shopData } = data

      // Upload banner image to Supabase Storage
      const bannerFileName = `${user.id}/${Date.now()}_banner_${bannerImage.name}`
      const { data: bannerUploadData, error: bannerUploadError } = await supabase.storage
        .from('shop-images')
        .upload(bannerFileName, bannerImage)

      if (bannerUploadError) throw bannerUploadError

      const { data: { publicUrl: bannerUrl } } = supabase.storage
        .from('shop-images')
        .getPublicUrl(bannerFileName)

      // Upload product images
      const productUrls: string[] = []
      for (let i = 0; i < productImages.length; i++) {
        const productFileName = `${user.id}/${Date.now()}_product_${i}_${productImages[i].name}`
        const { data: productUploadData, error: productUploadError } = await supabase.storage
          .from('shop-images')
          .upload(productFileName, productImages[i])

        if (productUploadError) throw productUploadError

        const { data: { publicUrl: productUrl } } = supabase.storage
          .from('shop-images')
          .getPublicUrl(productFileName)

        productUrls.push(productUrl)
      }

      // Insert shop data into database
      const { error: insertError } = await supabase
        .from('shops')
        .insert({
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
        })

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        router.push('/explore')
      }, 2000)
    } catch (error: any) {
      console.error('Error submitting shop:', error)
      throw new Error(error.message || 'Gagal menyimpan data toko')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Berhasil!</h2>
          <p className="text-gray-600 mb-4">
            Toko Anda telah ditambahkan ke peta!
          </p>
          <p className="text-sm text-gray-500">
            Mengalihkan ke halaman peta...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Store className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">WarungSpot</h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5" />
                <span className="text-sm">{user.email}</span>
              </div>
              <Link
                href="/explore"
                className="px-4 py-2 text-orange-600 hover:text-orange-700 transition-colors"
              >
                Lihat Peta
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang, {user.user_metadata?.full_name || 'Pedagang'}! 👋
          </h2>
          <p className="text-gray-600">
            Mari tambahkan toko Anda ke peta dengan bantuan AI
          </p>
        </div>

        <ShopUploadForm onSubmit={handleShopSubmit} />
      </main>
    </div>
  )
}
