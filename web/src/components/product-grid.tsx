import ProductCard from "@/components/product-card"
import { Product } from "@/lib/types"

export default function ProductGrid({ title, products }: { title: string, products: Product[] }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-[60px]">
        <h2 className="text-center font-medium mb-6 text-[#1C1C1C]">{title}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}