import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { featured } from "@/data/mock"
import { proxiedImage } from "@/lib/images"

export default function FeaturedStory() {
  return (
    <section className="bg-[#E7EFEA]">
      <div className="mx-auto max-w-7xl px-4 py-[60px] grid md:grid-cols-2 gap-8">
        <div className="relative h-64 md:h-80">
          <Image src={proxiedImage(featured.imageUrl)} alt="Featured" fill className="object-cover rounded" />
        </div>
        <div className="flex flex-col justify-center gap-4">
          <h3 className="text-2xl md:text-3xl font-semibold font-serif text-[#1C1C1C]">{featured.title}</h3>
          <p className="text-[#555D63]">{featured.copy}</p>
          <Button asChild className="bg-[#4D6B57] text-white hover:bg-[#3F5447] rounded-md">
            <Link href={featured.cta.href}>{featured.cta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}