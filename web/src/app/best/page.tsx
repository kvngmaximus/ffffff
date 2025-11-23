import ProductGrid from "@/components/product-grid"
import { products } from "@/data/mock"

export default function BestPage() {
  const best = products.filter(p => p.bestSeller)
  return (
    <main className="bg-white">
      <ProductGrid title="Best Sellers" products={best} />
    </main>
  )
}