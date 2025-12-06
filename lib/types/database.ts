export interface Shop {
  id: string
  user_id: string
  shop_name: string
  phone_number?: string
  address_clue?: string
  category: string
  marketing_desc: string
  latitude: number
  longitude: number
  banner_image_url?: string
  product_images_urls?: string[]
  created_at: string
  updated_at: string
}

export interface ShopAnalysisResult {
  shopName: string
  phoneNumber?: string
  address_clue?: string
  category: string
  marketing_desc: string
}
