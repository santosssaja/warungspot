'use client'

import { X, MapPin, Phone, Share2, Navigation, Store } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

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

interface ShopDetailModalProps {
    shop: Shop
    onClose: () => void
}

export default function ShopDetailModal({ shop, onClose }: ShopDetailModalProps) {
    const [activeImage, setActiveImage] = useState(shop.banner_image_url || null)

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shop.shop_name,
                    text: `Cek toko ${shop.shop_name} di WarungSpot!`,
                    url: window.location.href,
                })
            } catch (error) {
                console.log('Error sharing:', error)
            }
        } else {
            alert('Fitur share tidak didukung di browser ini')
        }
    }

    const handleDirections = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`, '_blank')
    }

    const allImages = [
        ...(shop.banner_image_url ? [shop.banner_image_url] : []),
        ...(shop.product_images_urls || [])
    ]

    return (
        <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full md:max-w-2xl bg-white md:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Image Gallery */}
                <div className="relative h-64 md:h-80 bg-gray-100 shrink-0">
                    {activeImage ? (
                        <Image
                            src={activeImage}
                            alt={shop.shop_name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Store className="w-16 h-16" />
                        </div>
                    )}

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-orange-500 scale-105' : 'border-white/50 hover:border-white'}`}
                                >
                                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full mb-2">
                                {shop.category}
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900">{shop.shop_name}</h2>
                        </div>
                        {/* Rating or other badge could go here */}
                    </div>

                    {/* Address & Contact */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3 text-gray-600">
                            <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                            <span>{shop.address_clue || 'Alamat tidak tersedia'}</span>
                        </div>
                        {shop.phone_number && (
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                                <span>{shop.phone_number}</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-orange-50 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-orange-900 mb-2">Tentang Toko</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {shop.marketing_desc}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleDirections}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            <Navigation className="w-5 h-5" />
                            Rute
                        </button>
                        {shop.phone_number ? (
                            <a
                                href={`tel:${shop.phone_number}`}
                                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                Hubungi
                            </a>
                        ) : (
                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                Bagikan
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
