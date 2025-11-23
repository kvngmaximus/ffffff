"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import FilterSidebar, { Filters } from "@/components/shop/FilterSidebar"
import ShopProductCard from "@/components/shop/ShopProductCard"
import Pagination from "@/components/shop/Pagination"
import { categories } from "@/data/mock"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Product, SupabaseProductRow } from "@/lib/types"

type SortKey = "default" | "price_asc" | "price_desc" | "rating_desc" | "name_asc"

export default function ShopClient() {
  const search = useSearchParams()
  const initialCats = useMemo(() => {
    const raw = search.get("category")
    if (!raw) return [] as string[]
    const parts = raw.split(",")
    return parts.map(p => {
      const byId = categories.find(c => c.id === p)?.id
      if (byId) return byId
      const bySlug = categories.find(c => c.slug === p)?.id
      return bySlug || ""
    }).filter(Boolean)
  }, [search])
  const [filters, setFilters] = useState<Filters>({
    categories: initialCats,
    skinTypes: [],
    availability: ["In Stock"],
    promotions: [],
    rating: 0,
    priceRange: [0, 100],
  })
  const searchKey = search.toString()
  const [sort, setSort] = useState<SortKey>("default")
  const [page, setPage] = useState(1)
  const pageSize = 12

  const [allProducts, setAllProducts] = useState<SupabaseProductRow[]>([])
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.categories.length) {
      const slugs = filters.categories.map(id => categories.find(c => c.id === id)?.slug).filter(Boolean)
      if (slugs.length) params.set("category", slugs.join(","))
    }
    fetch(`/api/products?${params.toString()}`)
      .then(r => r.json())
      .then(res => setAllProducts((res.items || []) as SupabaseProductRow[]))
      .catch(() => setAllProducts([]))
  }, [filters.categories])

  const filtered = useMemo<Product[]>(() => {
    let list: Product[] = allProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.image_url || "/images/collection.png",
      categoryId: p.category_id,
      categoryName: p.categories?.name,
      rating: p.rating ?? undefined,
      stockStatus: p.stock_status ?? undefined,
      discountPercent: p.discount_percent ?? undefined,
      description: p.description ?? undefined,
    }))
    if (filters.categories.length) {
      const allowed = new Set(filters.categories)
      list = list.filter(p => allowed.has(p.categoryId))
    }
    if (filters.skinTypes.length) {
      const allowed = new Set(filters.skinTypes)
      list = list.filter(p => p.skinType && allowed.has(p.skinType))
    }
    if (filters.availability.length) {
      const inStock = filters.availability.includes("In Stock")
      const outStock = filters.availability.includes("Out of Stocks")
      list = list.filter(p => (inStock && p.stockStatus !== "out_of_stock") || (outStock && p.stockStatus === "out_of_stock"))
    }
    if (filters.promotions.length) {
      list = list.filter(p => {
        const onSale = filters.promotions.includes("On Sale") ? (p.discountPercent || 0) > 0 : true
        const best = filters.promotions.includes("Best Sellers") ? !!p.bestSeller : true
        const newArrivals = filters.promotions.includes("New Arrivals") ? p.id.startsWith("n") : true
        return onSale && best && newArrivals
      })
    }
    if (filters.rating > 0) {
      list = list.filter(p => (p.rating || 0) >= filters.rating)
    }
    list = list.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])

    switch (sort) {
      case "price_asc":
        list = [...list].sort((a,b)=>a.price-b.price)
        break
      case "price_desc":
        list = [...list].sort((a,b)=>b.price-a.price)
        break
      case "rating_desc":
        list = [...list].sort((a,b)=>(b.rating||0)-(a.rating||0))
        break
      case "name_asc":
        list = [...list].sort((a,b)=>a.name.localeCompare(b.name))
        break
      default:
        break
    }
    return list
  }, [allProducts, filters, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page-1)*pageSize, page*pageSize)

  const activeChips = [] as string[]
  if (filters.categories.length) activeChips.push(...filters.categories.map(id=>categories.find(c=>c.id===id)?.name || ""))
  if (filters.promotions.length) activeChips.push(...filters.promotions)
  if (filters.skinTypes.length) activeChips.push(...filters.skinTypes)
  if (filters.rating>0) activeChips.push(`${filters.rating}+ stars`)
  activeChips.push(`Price: $${filters.priceRange[0]} - $${filters.priceRange[1]}`)

  const onClearAll = () => {
    setFilters({ categories: [], skinTypes: [], availability: ["In Stock"], promotions: [], rating: 0, priceRange: [0,100] })
    setPage(1)
  }

  return (
    <div key={searchKey} className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-center text-3xl font-semibold text-neutral-900">Shop</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8">
        <div className="hidden md:block">
          <FilterSidebar filters={filters} onChange={(next)=>setFilters(prev=>({...prev,...next}))} onClear={onClearAll} />
        </div>
        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-neutral-600">Showing {pageItems.length} of {filtered.length} results</div>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">Filters</Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-[400px]">
                  <FilterSidebar filters={filters} onChange={(next)=>setFilters(prev=>({...prev,...next}))} onClear={onClearAll} />
                </SheetContent>
              </Sheet>
              <Select value={sort} onValueChange={(v)=>setSort(v as SortKey)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Default Sorting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Sorting</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating_desc">Rating</SelectItem>
                  <SelectItem value="name_asc">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3 flex items-center flex-wrap gap-2">
            <span className="text-sm text-neutral-600">Active Filter</span>
            {activeChips.map((c,i)=> (
              <Badge key={`${c}-${i}`} variant="outline" className="rounded-full">{c}</Badge>
            ))}
            <Button variant="link" className="text-neutral-700" onClick={onClearAll}>Clear All</Button>
          </div>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pageItems.map(p => (
              <ShopProductCard key={p.id} product={p} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </div>
    </div>
  )
}