import ProductGrid from "@/components/product-grid"
import { products } from "@/data/mock"

export default function NewPage() {
  const newArrivals = products.slice(0, 12)
  return (
    <main className="bg-white">
      <ProductGrid title="New Arrivals" products={newArrivals} />
    </main>
  )
}