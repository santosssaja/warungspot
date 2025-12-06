import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Crosshair } from 'lucide-react'

// Fix Leaflet icon issue
const icon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ea580c" stroke="#fff" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="#fff"></circle>
    </svg>
  `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
})

interface LocationPickerProps {
    initialLat?: number
    initialLng?: number
    onLocationSelect: (lat: number, lng: number) => void
}

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo(center, map.getZoom())
    }, [center, map])
    return null
}

export default function LocationPicker({ initialLat, initialLng, onLocationSelect }: LocationPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    )
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleLocationSelect = (lat: number, lng: number) => {
        setPosition([lat, lng])
        onLocationSelect(lat, lng)
    }

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords
                    handleLocationSelect(latitude, longitude)
                },
                (err) => {
                    console.error('Error getting location:', err)
                    alert('Gagal mendeteksi lokasi. Pastikan GPS aktif.')
                }
            )
        }
    }

    if (!isClient) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Memuat peta...</p>
            </div>
        )
    }

    const center: [number, number] = position || [-6.2088, 106.8456] // Default Jakarta

    return (
        <div className="relative w-full h-80 rounded-xl overflow-hidden border border-gray-300">
            <MapContainer
                center={center}
                zoom={15}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents onLocationSelect={handleLocationSelect} />
                <MapUpdater center={center} />
                {position && <Marker position={position} icon={icon} />}
            </MapContainer>

            <button
                type="button"
                onClick={handleCurrentLocation}
                className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg z-[1000] hover:bg-gray-50 transition-colors"
                title="Gunakan Lokasi Saya"
            >
                <Crosshair className="w-6 h-6 text-blue-600" />
            </button>

            {!position && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg z-[1000] text-sm font-medium text-gray-700">
                    Klik peta untuk menandai lokasi
                </div>
            )}
        </div>
    )
}
