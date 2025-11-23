"use client"
import { useEffect, useMemo, useState } from "react"
import { useCart } from "@/context/cart"
import { useAuth } from "@/context/auth"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import AuthPrompt from "@/components/ui/auth-prompt"
import { toast } from "sonner"

type CartRow = { id: string; name: string; price: number; quantity: number; product_id: string }

export default function CartPage() {
  const { items, remove, clear, cartId } = useCart()
  const { user } = useAuth()
  const [rows, setRows] = useState<CartRow[]>([])
  const [loadingPay, setLoadingPay] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const hasKey = !!process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY

  useEffect(() => {
    const load = async () => {
      if (!items.length) { setRows([]); return }
      const ids = items.map(i => i.productId)
      const { data } = await supabase
        .from("products")
        .select("id, name, price")
        .in("id", ids)
      const mapPrice = new Map<string, number>((data || []).map(p => [p.id, Number(p.price)]))
      const mapName = new Map<string, string>((data || []).map(p => [p.id, p.name]))
      setRows(items.map(i => ({ id: i.id, product_id: i.productId, name: mapName.get(i.productId) || "Product", price: mapPrice.get(i.productId) || 0, quantity: i.quantity })))
    }
    load()
  }, [items])

  const total = useMemo(() => rows.reduce((sum, r) => sum + r.price * r.quantity, 0), [rows])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.FlutterwaveCheckout) return
    const script = document.createElement("script")
    script.src = "https://checkout.flutterwave.com/v3.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  const onCheckout = async () => {
    if (!rows.length) return
    const pubKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
    if (!pubKey) { toast.error("Payment configuration missing. Set NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY in .env"); return }
    if (!user) { setShowAuthPrompt(true); return }
    const txRef = `TX-${Date.now()}`
    setLoadingPay(true)
    try {
      const { data: order } = await supabase
        .from("orders")
        .insert({ user_id: user.id, cart_id: cartId, total: Math.round(total * 100) / 100, currency: "NGN" })
        .select("id")
        .maybeSingle()
      const orderId = order?.id
      window.FlutterwaveCheckout?.({
        public_key: pubKey,
        tx_ref: txRef,
        amount: Math.round(total * 100) / 100,
        currency: "NGN",
        customer: { email: user?.email || "user@example.com" },
        callback: async (data: FlutterwaveCallback) => {
          try {
            if (orderId) {
              await supabase.from("payments").insert({ order_id: orderId, provider: "flutterwave", amount: total, status: "successful", currency: "NGN", reference: data?.transaction_id || txRef })
              await supabase.from("orders").update({ status: "paid" }).eq("id", orderId)
            }
            await clear()
          } catch (e) {
            console.error(e)
          } finally {
            setLoadingPay(false)
          }
        },
        onclose: () => {
          setLoadingPay(false)
        },
      })
    } catch (e) {
      console.error(e)
      setLoadingPay(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Cart</h1>
      <div className="mt-6 grid gap-3">
        {rows.map(r => (
          <div key={r.id} className="flex items-center justify-between border rounded px-3 py-2">
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-sm text-neutral-600">${r.price.toFixed(2)} × {r.quantity}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-semibold">${(r.price * r.quantity).toFixed(2)}</div>
              <Button variant="destructive" onClick={()=>remove(r.product_id)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-end gap-4">
        <div className="text-lg">Total: <span className="font-semibold">${total.toFixed(2)}</span></div>
        <Button className="bg-[#4D6B57]" disabled={loadingPay} onClick={onCheckout}>{loadingPay ? "Processing..." : "Checkout"}</Button>
      </div>
      <AuthPrompt open={showAuthPrompt} onOpenChange={setShowAuthPrompt} />
    </main>
  )
}
type FlutterwaveCallback = { status?: string; transaction_id?: string }
declare global {
  interface Window {
    FlutterwaveCheckout?: (opts: {
      public_key: string
      tx_ref: string
      amount: number
      currency: string
      customer: { email: string }
      callback: (data: FlutterwaveCallback) => void
      onclose?: () => void
    }) => void
  }
}