"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useParams, notFound } from "next/navigation"
import { products as mockProducts } from "@/data/mock"
import type { Product } from "@/lib/types"
import { proxiedImage } from "@/lib/images"
import { Star, Heart, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import ShopProductCard from "@/components/shop/ShopProductCard"
import { useCart } from "@/context/cart"
import { useWishlist } from "@/context/wishlist"
import { useAuth } from "@/context/auth"
import AuthPrompt from "@/components/ui/auth-prompt"
import { supabase } from "@/lib/supabaseClient"

export default function ProductDetailPage() {
  const params = useParams() as { id?: string }
  const id = params?.id
  const [product, setProduct] = useState<Product | null>(null)
  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        const json = await res.json()
        if (res.ok && json && !json.error) {
          const mapped: Product = {
            id: json.id,
            name: json.name,
            price: Number(json.price),
            imageUrl: json.image_url || "/images/collection.png",
            categoryId: json.category_id,
            categoryName: json.categories?.name,
            rating: json.rating ?? undefined,
            reviewCount: json.review_count ?? undefined,
            stockStatus: json.stock_status ?? undefined,
            discountPercent: json.discount_percent ?? undefined,
            description: json.description ?? undefined,
            sizes: json.sizes ?? [],
            sku: json.sku ?? undefined,
            tags: json.tags ?? [],
            images: (json.images || []).map((i: { url: string }) => i.url),
          }
          setProduct(mapped)
          return
        }
      } catch {}

      const { data } = await supabase
        .from("products")
        .select("id, sku, name, description, price, discount_percent, stock_status, rating, review_count, image_url, category_id, categories:category_id(name, slug)")
        .eq("id", id)
        .maybeSingle()
      if (data) {
        const { data: images } = await supabase
          .from("product_images")
          .select("url, position")
          .eq("product_id", id)
          .order("position", { ascending: true })
        type CatRel = { name?: string | null } | null
        const rel = (data.categories as CatRel) || null
        let catName: string | undefined = rel?.name || undefined
        if (!catName && data.category_id) {
          const { data: cat } = await supabase
            .from("categories")
            .select("name")
            .eq("id", data.category_id)
            .maybeSingle()
          catName = cat?.name
        }
        const mapped: Product = {
          id: data.id,
          name: data.name,
          price: Number(data.price),
          imageUrl: data.image_url || "/images/collection.png",
          categoryId: data.category_id,
          categoryName: catName,
          rating: data.rating ?? undefined,
          reviewCount: data.review_count ?? undefined,
          stockStatus: (data.stock_status as 'in_stock' | 'low_stock' | 'out_of_stock' | undefined) ?? undefined,
          discountPercent: data.discount_percent ?? undefined,
          description: data.description ?? undefined,
          sizes: [],
          sku: data.sku ?? undefined,
          tags: [],
          images: (images || []).map(i => i.url),
        }
        setProduct(mapped)
        return
      }

      const fallback = mockProducts.find(p => p.id === id) || null
      const placeholder: Product = {
        id: id || "unknown",
        name: "Product",
        price: 0,
        imageUrl: "/images/collection.png",
        categoryId: "",
        categoryName: undefined,
        rating: 0,
        stockStatus: "in_stock",
        discountPercent: 0,
        description: "",
        sizes: [],
        sku: undefined,
        tags: [],
        images: [],
      }
      setProduct(fallback || placeholder)
    }
    load()
  }, [id])
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState("")
  const [qty, setQty] = useState(1)
  const { add } = useCart()
  const { toggle, items } = useWishlist()
  const { user } = useAuth()
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const related = useMemo(() => {
    if (!product) return []
    return mockProducts.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 5)
  }, [product])
  if (!product) {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-[60px]">
          <h1 className="text-center text-3xl font-serif text-[#1C1C1C]">Shop</h1>
          <div className="mt-2 text-center text-sm text-neutral-600">Loading product...</div>
        </div>
      </main>
    )
  }

  const wished = items.some(i => i.productId === product.id)

  const discount = product.discountPercent || 0
  const original = discount > 0 ? Math.round(product.price / (1 - discount / 100)) : undefined
  const rating = product.rating || 0
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-[60px]">
        <h1 className="text-center text-3xl font-serif text-[#1C1C1C]">Shop</h1>
        <div className="mt-2 text-center text-sm text-neutral-600">Home / Shop / Product Details</div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden ring-1 ring-neutral-200">
              {discount > 0 && (
                <Badge className="absolute left-3 top-3 bg-emerald-700 text-white rounded-full px-2 py-1 text-xs">{discount}% off</Badge>
              )}
              <Image src={proxiedImage((product.images && product.images[activeImage]) || product.imageUrl)} alt={product.name} fill className="object-cover" />
              <button aria-label="Add to Wishlist" onClick={()=>{ if(!user){ setShowAuthPrompt(true); return } toggle(product.id) }} className="absolute right-3 top-3 bg-white/80 backdrop-blur rounded-full p-2 ring-1 ring-neutral-200">
                <Heart className={wished ? "text-emerald-700" : "text-neutral-700"} />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-3">
              {(product.images?.length ? product.images : [product.imageUrl]).slice(0,5).map((src: string, idx: number) => (
                <button key={idx} className={`relative h-20 rounded-xl overflow-hidden ring-1 ${activeImage===idx?"ring-emerald-700":"ring-neutral-200"}`} onClick={()=>setActiveImage(idx)}>
                  <Image src={proxiedImage(src)} alt={`thumb-${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-neutral-600">{product.categoryName}</div>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-[#1C1C1C]">{product.name}</h2>
              {product.stockStatus !== "out_of_stock" && <Badge className="bg-emerald-100 text-emerald-700">In Stock</Badge>}
            </div>
            <div className="mt-2 flex items-center gap-1">
              {stars.map(s => (
                <Star key={s} className={`h-4 w-4 ${s <= Math.round(rating) ? "text-amber-500" : "text-neutral-300"}`} fill="currentColor" />
              ))}
              <span className="text-sm text-neutral-600 ml-1">{(product.reviewCount || 0)} Review</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-2xl font-bold text-[#1C1C1C]">${product.price.toFixed(2)}</span>
              {original && <span className="text-xl text-neutral-400 line-through">${original.toFixed(2)}</span>}
            </div>
            <p className="mt-3 text-sm text-[#555D63] max-w-prose">{product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium">Size/Volume</div>
                <RadioGroup value={size} onValueChange={setSize} className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <RadioGroupItem id={`size-${s}`} value={s} />
                      <label htmlFor={`size-${s}`} className="text-sm">{s}</label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={()=>setQty(q=>Math.max(1,q-1))}>-</Button>
                <span className="min-w-6 text-center">{qty}</span>
                <Button variant="outline" onClick={()=>setQty(q=>q+1)}>+</Button>
              </div>
              <Button onClick={()=>{ if(!user){ setShowAuthPrompt(true); return } for(let i=0;i<qty;i++) add(product.id) }} className="bg-[#4D6B57] hover:bg-[#3f5b49]">Add To Cart</Button>
              <Button variant="outline">Buy Now</Button>
            </div>

            <div className="mt-4 text-sm text-neutral-600">SKU : {product.sku || "N/A"}</div>
            {product.tags && (
              <div className="mt-2 text-sm text-neutral-600">Tags : {product.tags.join(", ")}</div>
            )}
            <div className="mt-2 flex items-center gap-2 text-neutral-700">
              <span>Share :</span>
              <Share2 className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center gap-6 border-b">
            <button className="py-2 text-sm text-neutral-700">Description</button>
            <button className="py-2 border-b-2 border-[#4D6B57] text-sm text-neutral-900">Additional Information</button>
            <button className="py-2 text-sm text-neutral-700">Review</button>
          </div>
          <div className="rounded-2xl ring-1 ring-neutral-200 mt-4 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#4D6B57] text-white">
                <tr>
                  <th className="text-left px-4 py-2">Attribute</th>
                  <th className="text-left px-4 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">Skin Type</td>
                  <td className="px-4 py-2">Normal, Oily, Dry, Combination, Sensitive skin</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Size/Volume</td>
                  <td className="px-4 py-2">{product.sizes?.join(", ")}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Shelf Life</td>
                  <td className="px-4 py-2">24 months</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Application Time</td>
                  <td className="px-4 py-2">Morning and Evening</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Packaging</td>
                  <td className="px-4 py-2">Recyclable Glass Bottle</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <section className="mt-12">
          <h3 className="text-center text-2xl"><span className="text-neutral-700">Explore</span> <span className="text-[#CC9A44]">Related Products</span></h3>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {related.map(p => (
              <ShopProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
      <AuthPrompt open={showAuthPrompt} onOpenChange={setShowAuthPrompt} />
    </main>
  )
}
