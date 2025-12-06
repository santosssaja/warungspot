import { MapPin, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const LocationPicker = dynamic(() => import('../../map/LocationPicker'), {
    ssr: false,
    loading: () => <div className="w-full h-64 bg-gray-100 rounded-xl animate-pulse" />
})

interface LocationSectionProps {
    latitude: number | null
    longitude: number | null
    onLocationSelect: (lat: number, lng: number) => void
    loading: boolean
}

export default function LocationSection({
    latitude,
    longitude,
    onLocationSelect,
    loading
}: LocationSectionProps) {
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Lokasi Toko *
            </label>
            <div className="rounded-xl overflow-hidden border border-gray-300">
                {latitude && longitude ? (
                    <LocationPicker
                        initialLat={latitude}
                        initialLng={longitude}
                        onLocationSelect={onLocationSelect}
                    />
                ) : (
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
                Geser peta dan klik untuk menyesuaikan lokasi tepat toko Anda.
            </p>
        </div>
    )
}
