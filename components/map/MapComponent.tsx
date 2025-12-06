'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

interface MapComponentProps {
  shops?: Shop[]
  center?: [number, number]
  zoom?: number
  onShopClick?: (shop: Shop) => void
}

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6" stroke="#fff" stroke-width="2">
      <circle cx="12" cy="12" r="8"/>
      <circle cx="12" cy="12" r="3" fill="#fff"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

// Custom icon for shops
const shopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#ea580c" stroke="#fff" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="#fff"></circle>
    </svg>
  `),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
})

function LocationMarker({ onLocationFound }: { onLocationFound?: (latlng: [number, number]) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const map = useMap()

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 })

    map.on('locationfound', (e) => {
      const latlng: [number, number] = [e.latlng.lat, e.latlng.lng]
      setPosition(latlng)
      if (onLocationFound) {
        onLocationFound(latlng)
      }
    })

    map.on('locationerror', () => {
      // Default to Jakarta if location not found
      const defaultPos: [number, number] = [-6.2088, 106.8456]
      setPosition(defaultPos)
      map.setView(defaultPos, 13)
      if (onLocationFound) {
        onLocationFound(defaultPos)
      }
    })
  }, [map, onLocationFound])

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <p className="font-semibold text-blue-600">📍 Lokasi Anda</p>
          <p className="text-xs text-gray-600 mt-1">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  )
}

export default function MapComponent({ shops = [], center, zoom = 13, onShopClick }: MapComponentProps) {
  const [userLocation, setUserLocation] = useState<[number, number]>(center || [-6.2088, 106.8456])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat peta...</p>
        </div>
      </div>
    )
  }

  return (
    <MapContainer
      center={userLocation}
      zoom={zoom}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationFound={setUserLocation} />

      {shops.map((shop) => (
        <Marker
          key={shop.id}
          position={[shop.latitude, shop.longitude]}
          icon={shopIcon}
          eventHandlers={{
            click: () => {
              if (onShopClick) {
                onShopClick(shop)
              }
            },
          }}
        >
          {!onShopClick && (
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-lg text-orange-600 mb-1">{shop.shop_name}</h3>
                <p className="text-sm text-gray-500 mb-2">{shop.category}</p>
                <p className="text-sm text-gray-700 mb-3">{shop.marketing_desc}</p>
                {shop.phone_number && (
                  <a
                    href={`tel:${shop.phone_number}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    📞 {shop.phone_number}
                  </a>
                )}
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  )
}
