"use client"
import { useEffect, useState } from "react"
import { useWishlist } from "@/context/wishlist"
import { supabase } from "@/lib/supabaseClient"
import ShopProductCard from "@/components/shop/ShopProductCard"
import type { Product } from "@/lib/types"

export default function WishlistPage() {
  const { items } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const load = async () => {
      if (!items.length) { setProducts([]); return }
      const ids = items.map(i => i.productId)
      const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url, category_id, rating, stock_status, discount_percent")
        .in("id", ids)
      const mapped = (data || []).map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        imageUrl: p.image_url || "/images/collection.png",
        categoryId: p.category_id,
        rating: p.rating || 0,
        stockStatus: p.stock_status || undefined,
        discountPercent: p.discount_percent || 0,
      }))
      setProducts(mapped)
    }
    load()
  }, [items])

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Wishlist</h1>
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map(p => <ShopProductCard key={p.id} product={p} />)}
      </div>
    </main>
  )
}