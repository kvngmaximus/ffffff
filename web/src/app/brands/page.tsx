import { brands } from "@/data/mock"
import { proxiedImage } from "@/lib/images"
import Image from "next/image"

export default function BrandsPage() {
  return (
    <main className="bg-white">
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-[60px]">
          <h2 className="text-center font-medium mb-6 text-[#1C1C1C]">Brands</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map(b => (
              <div key={b.id} className="rounded-2xl bg-white ring-1 ring-neutral-200 shadow-sm overflow-hidden">
                <div className="relative h-40">
                  <Image src={proxiedImage(b.imageUrl || "/images/collection.png")} alt={b.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-lg font-semibold text-[#1C1C1C]">{b.name}</div>
                  <p className="text-sm text-[#555D63]">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}