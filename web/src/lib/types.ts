export type Category = {
  id: string
  name: string
  slug: string
  imageUrl?: string
}

export type Product = {
  id: string
  name: string
  price: number
  imageUrl: string
  categoryId: string
  categoryName?: string
  skinType?: 'Normal' | 'Oily' | 'Dry' | 'Combination' | 'Sensitive'
  rating?: number
  reviewCount?: number
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock'
  discountPercent?: number
  bestSeller?: boolean
  onSale?: boolean
  description?: string
  sku?: string
  sizes?: string[]
  tags?: string[]
  images?: string[]
}

export type Brand = {
  id: string
  name: string
  slug: string
  imageUrl?: string
  description?: string
}

export type WishlistItem = {
  id: string
  productId: string
  createdAt: string
}

export type CartItem = {
  id: string
  productId: string
  quantity: number
  createdAt: string
}

export type SupabaseProductRow = {
  id: string
  sku?: string | null
  name: string
  description?: string | null
  price: number
  discount_percent?: number | null
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock' | null
  rating?: number | null
  review_count?: number | null
  image_url?: string | null
  category_id: string
  categories?: { name?: string; slug?: string } | null
}