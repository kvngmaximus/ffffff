"use client"

import Image from "next/image"
import { proxiedImage } from "@/lib/images"
import { Product } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Link from "next/link"

export default function ShopProductCard({ product }: { product: Product }) {
  const discount = product.discountPercent || 0
  const original = discount > 0 ? Math.round(product.price / (1 - discount / 100)) : undefined
  const rating = product.rating || 0
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)
  return (
    <div className="relative rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 overflow-hidden">
      {discount > 0 && (
        <Badge className="absolute left-3 top-3 bg-emerald-700 text-white rounded-full px-2 py-1 text-xs">{discount}% off</Badge>
      )}
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative h-40 w-full">
          <Image src={proxiedImage(product.imageUrl)} alt={product.name} fill className="object-cover" />
        </div>
        <div className="p-3">
          <div className="text-xs text-neutral-600">{product.categoryName}</div>
          <div className="mt-1 text-sm font-medium text-neutral-900">{product.name}</div>
          <div className="mt-1 flex items-center gap-1">
            {stars.map(s => (
              <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "text-amber-500" : "text-neutral-300"}`} fill="currentColor" />
            ))}
            <span className="text-xs text-neutral-500 ml-1">{rating.toFixed(1)}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[0.95rem] font-semibold text-neutral-900">${product.price.toFixed(2)}</span>
            {original && <span className="text-sm text-neutral-400 line-through">${original.toFixed(2)}</span>}
          </div>
        </div>
      </Link>
    </div>
  )
}