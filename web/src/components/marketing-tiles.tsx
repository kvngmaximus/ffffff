import Image from "next/image"
import { proxiedImage } from "@/lib/images"

const tiles = [
  { title: "Chosen By Influencers", imageUrl: "/images/m1.png" },
  { title: "Carefully Crafted", imageUrl: "/images/m3.png" },
  { title: "15% Off Only This Week", imageUrl: "/images/m4.png" },
  { title: "Prevent Dry, Flaky Skin", imageUrl: "/images/m2.png" }
]

export default function MarketingTiles() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid md:grid-cols-4 gap-4">
          {tiles.map((t, i) => (
            <div key={i} className="relative h-40 md:h-52 rounded overflow-hidden">
              <Image src={proxiedImage(t.imageUrl)} alt={t.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-3 left-3 text-white font-medium">{t.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}