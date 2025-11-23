"use client"
import Image from "next/image"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import Link from "next/link"
import { Product } from "@/lib/types"
import { proxiedImage } from "@/lib/images"

export default function ProductCard({ product }: { product: Product }) {
  const description = product.description ?? "Premium skincare and cosmetics crafted for visible results."
  return (
    <BackgroundGradient glow={false} containerClassName="rounded-[22px]" className="rounded-[22px] p-4 sm:p-8 bg-white">
      <div className="relative h-44 w-full">
        <Image src={proxiedImage(product.imageUrl)} alt={product.name} fill className="object-contain" />
      </div>
      <p className="text-base sm:text-xl text-[#1C1C1C] mt-4 mb-2 font-serif">{product.name}</p>
      <p className="text-sm text-[#555D63]">{description}</p>
      <div className="mt-4 flex items-center gap-2">
        <Link href={`/product/${product.id}`} className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-[#4D6B57] text-xs font-bold">
          <span>Buy now</span>
          <span className="bg-white/20 rounded-full text-[0.7rem] px-2 py-0">${product.price.toFixed(2)}</span>
        </Link>
      </div>
    </BackgroundGradient>
  )
}