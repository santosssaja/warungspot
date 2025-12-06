import { Store, Phone, MapPin, Tag, FileText, CheckCircle2, Loader2 } from 'lucide-react'
import React from 'react'

interface ShopInfoFormProps {
    shopName: string
    setShopName: (val: string) => void
    phoneNumber: string
    setPhoneNumber: (val: string) => void
    addressClue: string
    setAddressClue: (val: string) => void
    category: string
    setCategory: (val: string) => void
    marketingDesc: string
    setMarketingDesc: (val: string) => void
    isEditing: boolean
    onSubmit: (e: React.FormEvent) => void
    loading: boolean
    onCancel: () => void
}

export default function ShopInfoForm({
    shopName,
    setShopName,
    phoneNumber,
    setPhoneNumber,
    addressClue,
    setAddressClue,
    category,
    setCategory,
    marketingDesc,
    setMarketingDesc,
    isEditing,
    onSubmit,
    loading,
    onCancel
}: ShopInfoFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {!isEditing && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="font-semibold">✨ Analisis Selesai!</p>
                    <p className="text-sm mt-1">Silakan cek dan edit jika ada yang perlu diperbaiki</p>
                </div>
            )}

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                    placeholder="Deskripsi menarik untuk mempromosikan toko Anda"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                {!isEditing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Kembali
                    </button>
                )}
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
                        isEditing ? 'Simpan Perubahan' : 'Simpan & Tambahkan ke Peta'
                    )}
                </button>
            </div>
        </form>
    )
}
