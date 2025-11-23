"use client"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { WishlistItem } from "@/lib/types"
import { useAuth } from "@/context/auth"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

type WishlistContextValue = {
  items: WishlistItem[]
  toggle: (productId: string) => void
  count: number
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    const load = async () => {
      if (!user) { setItems([]); return }
      const { data } = await supabase
        .from("wishlists")
        .select("id, product_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      setItems((data || []).map(w => ({ id: w.id, productId: w.product_id, createdAt: w.created_at })))
    }
    load()
  }, [user])

  const toggle = async (productId: string) => {
    if (!user) { router.push("/auth"); return }
    const exists = items.find(i => i.productId === productId)
    if (exists) {
      await supabase.from("wishlists").delete().eq("product_id", productId).eq("user_id", user.id)
      setItems(prev => prev.filter(i => i.productId !== productId))
    } else {
      const { data } = await supabase.from("wishlists").insert({ product_id: productId, user_id: user.id }).select("id, product_id, created_at").maybeSingle()
      if (data) setItems(prev => [{ id: data.id, productId: data.product_id, createdAt: data.created_at }, ...prev])
    }
  }

  const value = useMemo(() => ({ items, toggle, count: items.length }), [items, toggle])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("WishlistProvider missing")
  return ctx
}