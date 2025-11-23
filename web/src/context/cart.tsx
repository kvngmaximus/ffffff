"use client"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { CartItem } from "@/lib/types"
import { useAuth } from "@/context/auth"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

type CartContextValue = {
  items: CartItem[]
  add: (productId: string) => void
  remove: (productId: string) => void
  count: number
  clear: () => void
  cartId: string | null
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [cartId, setCartId] = useState<string | null>(null)

  useEffect(() => {
    const ensureCart = async () => {
      if (!user) { setItems([]); setCartId(null); return }
      const { data: existing } = await supabase
        .from("carts")
        .select("id, status")
        .eq("status", "active")
        .eq("user_id", user.id)
        .limit(1)
      let id = existing?.[0]?.id
      if (!id) {
        const { data: created } = await supabase.from("carts").insert({ user_id: user.id, status: "active" }).select("id").maybeSingle()
        id = created?.id || null
      }
      setCartId(id || null)
      if (id) {
        const { data: rows } = await supabase
          .from("cart_items")
          .select("id, product_id, quantity, created_at")
          .eq("cart_id", id)
        setItems((rows || []).map(r => ({ id: r.id, productId: r.product_id, quantity: r.quantity, createdAt: r.created_at })))
      }
    }
    ensureCart()
  }, [user])

  const add = async (productId: string) => {
    if (!user) { router.push("/auth"); return }
    if (!cartId) return
    const existing = items.find(i => i.productId === productId)
    if (existing) {
      const { data } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + 1 })
        .eq("cart_id", cartId)
        .eq("product_id", productId)
        .select("id, product_id, quantity, created_at")
        .maybeSingle()
      if (data) setItems(prev => prev.map(i => i.productId === productId ? { id: data.id, productId: data.product_id, quantity: data.quantity, createdAt: data.created_at } : i))
    } else {
      const { data } = await supabase
        .from("cart_items")
        .insert({ cart_id: cartId, product_id: productId, quantity: 1 })
        .select("id, product_id, quantity, created_at")
        .maybeSingle()
      if (data) setItems(prev => [{ id: data.id, productId: data.product_id, quantity: data.quantity, createdAt: data.created_at }, ...prev])
    }
  }

  const remove = async (productId: string) => {
    if (!user) { router.push("/auth"); return }
    if (!cartId) return
    await supabase.from("cart_items").delete().eq("cart_id", cartId).eq("product_id", productId)
    setItems(prev => prev.filter(i => i.productId !== productId))
  }

  const clear = async () => {
    if (!user) { router.push("/auth"); return }
    if (!cartId) return
    await supabase.from("cart_items").delete().eq("cart_id", cartId)
    await supabase.from("carts").update({ status: "completed" }).eq("id", cartId)
    setItems([])
    const { data: created } = await supabase.from("carts").insert({ user_id: user.id, status: "active" }).select("id").maybeSingle()
    setCartId(created?.id || null)
  }

  const value = useMemo(() => ({ items, add, remove, clear, cartId, count: items.reduce((a, b) => a + b.quantity, 0) }), [items, add, remove, clear, cartId])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("CartProvider missing")
  return ctx
}