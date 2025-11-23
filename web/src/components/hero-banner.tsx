import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { hero } from "@/data/mock"
import { proxiedImage } from "@/lib/images"

export default function HeroBanner() {
  return (
    <section className="relative">
      <div className="absolute inset-0">
        <Image src={proxiedImage(hero.imageUrl)} alt="Hero" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/40 to-transparent" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="max-w-xl">
          <p className="text-sm text-[#555D63]">Full 15% Discount</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-semibold leading-tight font-serif text-[#1C1C1C]">{hero.title}</h1>
          <p className="mt-3 text-[#555D63] max-w-md">{hero.copy}</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-medium text-[#1C1C1C]">{hero.priceLabel}</span>
            <Button asChild className="bg-[#4D6B57] text-white hover:bg-[#3F5447] rounded-md">
              <Link href={hero.cta.href}>{hero.cta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}