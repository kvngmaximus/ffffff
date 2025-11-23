import HeroBanner from "@/components/hero-banner"
import CategoryCarousel from "@/components/category-carousel"
import FeaturedStory from "@/components/featured-story"
import ProductGrid from "@/components/product-grid"
import MarketingTiles from "@/components/marketing-tiles"
import PersonalizedCTA from "@/components/personalized-cta"
import { products } from "@/data/mock"

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <CategoryCarousel />
      <FeaturedStory />
      <ProductGrid title="Popular On The Beautify Store." products={products.slice(0, 5)} />
      <MarketingTiles />
      <ProductGrid title="Best Deals On The Beautify Store." products={products} />
      <PersonalizedCTA />
    </main>
  )
}
