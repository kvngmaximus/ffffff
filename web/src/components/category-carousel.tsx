"use client"
import Link from "next/link"
import { categories } from "@/data/mock"
import { proxiedImage } from "@/lib/images"
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover"

export default function CategoryCarousel() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-[60px]">
        <h2 className="text-center font-medium mb-6 text-neutral-900">Shop By Categories</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 place-items-center justify-center">
          {categories.map(c => (
            <Link key={c.id} href={`/shop?category=${c.slug}`} className="w-auto">
              <DirectionAwareHover
                imageUrl={proxiedImage(c.imageUrl ?? "/images/collection.png")}
                className="h-24 w-24 md:h-32 md:w-32"
                childrenClassName="text-white text-xs sm:text-sm"
                imageClassName="rounded-lg"
              >
                <p className="font-bold text-base text-white">{c.name}</p>
              </DirectionAwareHover>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}