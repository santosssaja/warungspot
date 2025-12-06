import { Camera, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface ImageUploadSectionProps {
    bannerPreview: string | null
    onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    productPreviews: string[]
    onProductsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRemoveProduct: (index: number) => void
    loading: boolean
    productCount: number
}

export default function ImageUploadSection({
    bannerPreview,
    onBannerChange,
    productPreviews,
    onProductsChange,
    onRemoveProduct,
    loading,
    productCount
}: ImageUploadSectionProps) {
    return (
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
                        onChange={onBannerChange}
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
                        onChange={onProductsChange}
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
                        <p className="text-sm text-gray-500 mt-1">{productCount}/10 foto</p>
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
                                        onClick={() => onRemoveProduct(index)}
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
        </div>
    )
}
