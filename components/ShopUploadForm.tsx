'use client'

import { useState, useEffect } from 'react'
import { Camera, Loader2, Sparkles, MapPin, Phone, Store, Tag, FileText, X, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

interface ShopData {
  shopName: string
  phoneNumber: string
  address_clue: string
  category: string
  marketing_desc: string
}

interface ShopUploadFormProps {
  onSubmit?: (data: ShopData & { latitude: number; longitude: number; bannerImage: File; productImages: File[] }) => Promise<void>
}

export default function ShopUploadForm({ onSubmit }: ShopUploadFormProps) {
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [productImages, setProductImages] = useState<File[]>([])
  const [productPreviews, setProductPreviews] = useState<string[]>([])
  
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Progress tracking
  const [progressMessage, setProgressMessage] = useState('')
  const [progressStep, setProgressStep] = useState('')
  
  const [shopName, setShopName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [addressClue, setAddressClue] = useState('')
  const [category, setCategory] = useState('')
  const [marketingDesc, setMarketingDesc] = useState('')
  
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)

  // Get user location on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          setLocationLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Default to Jakarta
          setLatitude(-6.2088)
          setLongitude(106.8456)
          setLocationLoading(false)
        }
      )
    }
  }, [])

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProductImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + productImages.length > 10) {
      setError('Maksimal 10 foto produk')
      return
    }

    setProductImages([...productImages, ...files])
    
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProductPreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeProductImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index))
    setProductPreviews(productPreviews.filter((_, i) => i !== index))
  }

  const handleAnalyze = async () => {
    if (!bannerImage) {
      setError('Silakan upload foto spanduk toko')
      return
    }

    if (!latitude || !longitude) {
      setError('Menunggu lokasi terdeteksi...')
      return
    }

    setLoading(true)
    setError(null)
    setProgressMessage('Memulai analisis...')
    setProgressStep('start')

    try {
      const formData = new FormData()
      formData.append('bannerImage', bannerImage)
      
      productImages.forEach((img, index) => {
        formData.append(`productImage${index}`, img)
      })

      // Use EventSource for SSE (Server-Sent Events)
      const response = await fetch('/api/analyze-shop', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to connect to API')
      }

      // Check if response is SSE
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error('No reader available')
        }

        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          
          // Process complete messages
          const lines = buffer.split('\n\n')
          buffer = lines.pop() || '' // Keep incomplete message in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.substring(6))
              
              console.log('[FORM] SSE message:', data)

              if (data.type === 'progress') {
                setProgressMessage(data.data.message)
                setProgressStep(data.data.step)
              } else if (data.type === 'success') {
                // Analysis complete
                const result = data.data
                setShopName(result.shopName || '')
                setPhoneNumber(result.phoneNumber || '')
                setAddressClue(result.address_clue || '')
                setCategory(result.category || '')
                setMarketingDesc(result.marketing_desc || '')
                
                setAnalyzed(true)
                setLoading(false)
              } else if (data.type === 'error') {
                throw new Error(data.data.error || 'Gagal menganalisis gambar')
              }
            }
          }
        }
      } else {
        // Fallback: non-streaming response
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }

        setShopName(data.shopName || '')
        setPhoneNumber(data.phoneNumber || '')
        setAddressClue(data.address_clue || '')
        setCategory(data.category || '')
        setMarketingDesc(data.marketing_desc || '')
        
        setAnalyzed(true)
      }
    } catch (error: any) {
      console.error('[FORM] Error:', error)
      setError(error.message || 'Gagal menganalisis gambar')
    } finally {
      setLoading(false)
      setProgressMessage('')
      setProgressStep('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!latitude || !longitude || !bannerImage) {
      setError('Data tidak lengkap')
      return
    }

    if (onSubmit) {
      setLoading(true)
      try {
        await onSubmit({
          shopName,
          phoneNumber,
          address_clue: addressClue,
          category,
          marketing_desc: marketingDesc,
          latitude,
          longitude,
          bannerImage,
          productImages,
        })
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Camera className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Upload Foto Toko
          </h2>
          <p className="text-gray-600">
            AI akan otomatis baca info dari spanduk dan produk!
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Location Status */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 text-blue-800">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold">Lokasi:</span>
          </div>
          {locationLoading ? (
            <p className="text-sm text-blue-600 mt-1">Mendeteksi lokasi Anda...</p>
          ) : latitude && longitude ? (
            <p className="text-sm text-blue-600 mt-1">
              ✓ Terdeteksi: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          ) : (
            <p className="text-sm text-orange-600 mt-1">⚠ Lokasi tidak terdeteksi</p>
          )}
        </div>

        {!analyzed ? (
          <div className="space-y-6">
            {/* Banner Image Upload */}
            <div>
              <label className="block mb-2">
                <span className="text-lg font-semibold text-gray-900">1. Foto Spanduk Toko *</span>
                <span className="block text-sm text-gray-600 mt-1">
                  Foto yang berisi nama toko, nomor HP, alamat
                </span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageChange}
                  className="hidden"
                  id="banner-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="banner-upload"
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {bannerPreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={bannerPreview}
                        alt="Banner preview"
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <Camera className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                      <p className="text-orange-600 font-semibold">Klik untuk upload foto spanduk</p>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG (Max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Product Images Upload */}
            <div>
              <label className="block mb-2">
                <span className="text-lg font-semibold text-gray-900">2. Foto Produk (Opsional)</span>
                <span className="block text-sm text-gray-600 mt-1">
                  Foto makanan/produk yang dijual (max 10)
                </span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleProductImagesChange}
                  className="hidden"
                  id="product-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="product-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer bg-amber-50 hover:bg-amber-100 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Camera className="w-10 h-10 text-amber-600 mb-2" />
                  <p className="text-amber-600 font-semibold">+ Tambah Foto Produk</p>
                  <p className="text-sm text-gray-500 mt-1">{productImages.length}/10 foto</p>
                </label>
              </div>

              {/* Product Previews */}
              {productPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {productPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={preview}
                        alt={`Product ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      {!loading && (
                        <button
                          type="button"
                          onClick={() => removeProductImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            {loading && progressMessage && (
              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 text-orange-600 animate-spin" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{progressMessage}</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 animate-pulse"
                        style={{ 
                          width: progressStep === 'validate' ? '20%' : 
                                 progressStep === 'parse' ? '30%' : 
                                 progressStep === 'convert' ? '50%' : 
                                 progressStep === 'init' ? '60%' : 
                                 progressStep === 'ai' ? '80%' : 
                                 progressStep === 'complete' ? '100%' : '10%' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!bannerImage || loading || !latitude || !longitude}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold text-lg hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>{progressMessage || 'Sedang menganalisis...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Analisis dengan AI</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold">✨ Analisis Selesai!</p>
              <p className="text-sm mt-1">Silakan cek dan edit jika ada yang perlu diperbaiki</p>
            </div>

            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Store className="inline w-4 h-4 mr-1" />
                Nama Toko
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Contoh: Warung Pak Budi"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="inline w-4 h-4 mr-1" />
                Nomor HP
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Contoh: 081234567890"
              />
            </div>

            {/* Address Clue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline w-4 h-4 mr-1" />
                Petunjuk Alamat
              </label>
              <input
                type="text"
                value={addressClue}
                onChange={(e) => setAddressClue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Contoh: Jl. Merdeka No. 123"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Tag className="inline w-4 h-4 mr-1" />
                Kategori
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Contoh: Bakso, Sate, Kelontong"
              />
            </div>

            {/* Marketing Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="inline w-4 h-4 mr-1" />
                Deskripsi Promosi
              </label>
              <textarea
                value={marketingDesc}
                onChange={(e) => setMarketingDesc(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Deskripsi menarik untuk mempromosikan toko Anda"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setAnalyzed(false)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan & Tambahkan ke Peta'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
