"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { categories } from "@/data/mock"

export type Filters = {
  categories: string[]
  skinTypes: string[]
  availability: string[]
  promotions: string[]
  rating: number
  priceRange: [number, number]
}

export default function FilterSidebar({ filters, onChange, onClear }: {
  filters: Filters
  onChange: (next: Partial<Filters>) => void
  onClear: () => void
}) {
  return (
    <aside className="w-full md:w-64 lg:w-72">
      <div className="text-sm text-neutral-500">Filter Options</div>
      <div className="mt-4 space-y-6">
        <section>
          <div className="font-medium mb-2">By Categories</div>
          <div className="space-y-2">
            {categories.map(c => (
              <div key={c.id} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${c.id}`}
                  checked={filters.categories.includes(c.id)}
                  onCheckedChange={(v) => {
                    const set = new Set(filters.categories)
                    if (v) set.add(c.id)
                    else set.delete(c.id)
                    onChange({ categories: Array.from(set) })
                  }}
                />
                <Label htmlFor={`cat-${c.id}`}>{c.name}</Label>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="font-medium mb-2">By Skin Type</div>
          {['Normal','Oily','Dry','Combination','Sensitive'].map(s => (
            <div key={s} className="flex items-center gap-2">
              <Checkbox
                id={`skin-${s}`}
                checked={filters.skinTypes.includes(s)}
                onCheckedChange={(v) => {
                  const set = new Set(filters.skinTypes)
                  if (v) set.add(s)
                  else set.delete(s)
                  onChange({ skinTypes: Array.from(set) })
                }}
              />
              <Label htmlFor={`skin-${s}`}>{s}</Label>
            </div>
          ))}
        </section>

        <section>
          <div className="font-medium mb-2">Price</div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[filters.priceRange[0], filters.priceRange[1]]}
            onValueChange={(v) => onChange({ priceRange: [v[0], v[1]] })}
          />
          <div className="mt-2 text-sm text-neutral-600">${filters.priceRange[0].toFixed(0)}.00 - ${filters.priceRange[1].toFixed(0)}.00</div>
        </section>

        <section>
          <div className="font-medium mb-2">Review</div>
          <div className="flex items-center gap-2">
            <Slider min={0} max={5} step={1} value={[filters.rating]} onValueChange={(v)=>onChange({ rating: v[0] })} />
            <span className="text-sm">{filters.rating}+ stars</span>
          </div>
        </section>

        <section>
          <div className="font-medium mb-2">By Promotions</div>
          {['New Arrivals','Best Sellers','On Sale'].map(p => (
            <div key={p} className="flex items-center gap-2">
              <Checkbox
                id={`promo-${p}`}
                checked={filters.promotions.includes(p)}
                onCheckedChange={(v) => {
                  const set = new Set(filters.promotions)
                  if (v) set.add(p)
                  else set.delete(p)
                  onChange({ promotions: Array.from(set) })
                }}
              />
              <Label htmlFor={`promo-${p}`}>{p}</Label>
            </div>
          ))}
        </section>

        <section>
          <div className="font-medium mb-2">Availability</div>
          {['In Stock','Out of Stocks'].map(a => (
            <div key={a} className="flex items-center gap-2">
              <Checkbox
                id={`avail-${a}`}
                checked={filters.availability.includes(a)}
                onCheckedChange={(v) => {
                  const set = new Set(filters.availability)
                  if (v) set.add(a)
                  else set.delete(a)
                  onChange({ availability: Array.from(set) })
                }}
              />
              <Label htmlFor={`avail-${a}`}>{a}</Label>
            </div>
          ))}
        </section>

        <Button variant="outline" className="mt-4" onClick={onClear}>Clear All</Button>
      </div>
    </aside>
  )
}