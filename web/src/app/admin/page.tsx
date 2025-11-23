"use client"
import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/context/auth"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"

type AdminStats = {
  users: number
  products: number
  revenue: number
}

type EditableProduct = {
  id: string
  name: string
  price: number
  stock_status?: string
}

type Coupon = {
  id: string
  code: string
  description?: string
  discount_type: string
  amount: number
  active: boolean
}

export default function AdminPage() {
  const { user, profile } = useAuth()
  const authorized = !!user && profile?.user_type === "admin"
  const [stats, setStats] = useState<AdminStats>({ users: 0, products: 0, revenue: 0 })
  const [products, setProducts] = useState<EditableProduct[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [newProduct, setNewProduct] = useState({ name: "", price: 0 })
  const [newCoupon, setNewCoupon] = useState({ code: "", amount: 10, discount_type: "percent" })

  useEffect(() => {
    const load = async () => {
      if (!authorized) return
      const { count: usersCount } = await supabase.from("profiles").select("id", { count: "exact", head: true })
      const { count: productsCount } = await supabase.from("products").select("id", { count: "exact", head: true })
      const { data: payments } = await supabase.from("payments").select("amount, status")
      const revenue = (payments || []).filter(p => p.status === "successful").reduce((sum, p) => sum + Number(p.amount || 0), 0)
      setStats({ users: usersCount || 0, products: productsCount || 0, revenue })

      const { data: prods } = await supabase.from("products").select("id, name, price, stock_status").order("updated_at", { ascending: false })
      setProducts((prods || []).map(p => ({ id: p.id, name: p.name, price: Number(p.price), stock_status: p.stock_status || undefined })))

      const { data: cps } = await supabase.from("coupons").select("id, code, description, discount_type, amount, active").order("created_at", { ascending: false })
      setCoupons((cps || []) as Coupon[])
    }
    load()
  }, [authorized])

  const saveProduct = async (p: EditableProduct) => {
    await supabase.from("products").update({ name: p.name, price: p.price, stock_status: p.stock_status }).eq("id", p.id)
  }

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const addProduct = async () => {
    const { data } = await supabase.from("products").insert({ name: newProduct.name, price: newProduct.price, category_id: (await supabase.from("categories").select("id").limit(1)).data?.[0]?.id }).select("id, name, price, stock_status").maybeSingle()
    if (data) setProducts(prev => [{ id: data.id, name: data.name, price: Number(data.price), stock_status: data.stock_status || undefined }, ...prev])
    setNewProduct({ name: "", price: 0 })
  }

  const addCoupon = async () => {
    const { data } = await supabase.from("coupons").insert({ code: newCoupon.code, amount: newCoupon.amount, discount_type: newCoupon.discount_type }).select("id, code, description, discount_type, amount, active").maybeSingle()
    if (data) setCoupons(prev => [data as Coupon, ...prev])
    setNewCoupon({ code: "", amount: 10, discount_type: "percent" })
  }

  const toggleCoupon = async (id: string, active: boolean) => {
    const { data } = await supabase.from("coupons").update({ active }).eq("id", id).select("id, code, description, discount_type, amount, active").maybeSingle()
    if (data) setCoupons(prev => prev.map(c => c.id === id ? (data as Coupon) : c))
  }

  if (!authorized) {
    return <main className="mx-auto max-w-4xl px-4 py-10"><h1 className="text-2xl font-semibold">Admin Dashboard</h1><p className="mt-2 text-sm text-neutral-600">Sign in as an admin to access this page.</p></main>
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4"><div className="text-sm text-neutral-600">Users</div><div className="mt-1 text-2xl font-semibold">{stats.users}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-neutral-600">Products</div><div className="mt-1 text-2xl font-semibold">{stats.products}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-neutral-600">Revenue</div><div className="mt-1 text-2xl font-semibold">${stats.revenue.toFixed(2)}</div></div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="mt-3 flex items-center gap-2">
          <input placeholder="Name" value={newProduct.name} onChange={e=>setNewProduct(p=>({ ...p, name: e.target.value }))} className="border rounded px-3 py-2" />
          <input type="number" placeholder="Price" value={newProduct.price} onChange={e=>setNewProduct(p=>({ ...p, price: Number(e.target.value) }))} className="border rounded px-3 py-2 w-28" />
          <Button onClick={addProduct} className="bg-[#4D6B57]">Add Product</Button>
        </div>
        <div className="mt-4 grid gap-3">
          {products.map(p => (
            <div key={p.id} className="flex items-center gap-3 border rounded px-3 py-2">
              <input value={p.name} onChange={e=>setProducts(prev=>prev.map(x=>x.id===p.id?{...x,name:e.target.value}:x))} className="border rounded px-2 py-1 flex-1" />
              <input type="number" value={p.price} onChange={e=>setProducts(prev=>prev.map(x=>x.id===p.id?{...x,price:Number(e.target.value)}:x))} className="border rounded px-2 py-1 w-24" />
              <select value={p.stock_status || "in_stock"} onChange={e=>setProducts(prev=>prev.map(x=>x.id===p.id?{...x,stock_status:e.target.value}:x))} className="border rounded px-2 py-1">
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
              <Button variant="outline" onClick={()=>saveProduct(p)}>Save</Button>
              <Button variant="destructive" onClick={()=>deleteProduct(p.id)}>Delete</Button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Coupons</h2>
        <div className="mt-3 flex items-center gap-2">
          <input placeholder="Code" value={newCoupon.code} onChange={e=>setNewCoupon(c=>({ ...c, code: e.target.value }))} className="border rounded px-3 py-2" />
          <input type="number" placeholder="Amount" value={newCoupon.amount} onChange={e=>setNewCoupon(c=>({ ...c, amount: Number(e.target.value) }))} className="border rounded px-3 py-2 w-28" />
          <select value={newCoupon.discount_type} onChange={e=>setNewCoupon(c=>({ ...c, discount_type: e.target.value }))} className="border rounded px-3 py-2">
            <option value="percent">Percent</option>
            <option value="fixed">Fixed</option>
          </select>
          <Button onClick={addCoupon} className="bg-[#4D6B57]">Create Coupon</Button>
        </div>
        <div className="mt-4 grid gap-2">
          {coupons.map(c => (
            <div key={c.id} className="flex items-center gap-3 border rounded px-3 py-2">
              <div className="flex-1">
                <div className="text-sm font-medium">{c.code}</div>
                <div className="text-xs text-neutral-600">{c.discount_type} — {c.amount}</div>
              </div>
              <select value={c.active ? "true" : "false"} onChange={e=>toggleCoupon(c.id, e.target.value === "true")} className="border rounded px-2 py-1">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}