import ProductGrid from "@/components/product-grid"
import { products } from "@/data/mock"

export default function DealsPage() {
  const deals = products.filter(p => (p.discountPercent || 0) > 0)
  return (
    <main className="bg-white">
      <ProductGrid title="Top Deals" products={deals} />
    </main>
  )
}