"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth"
import { supabase } from "@/lib/supabaseClient"

type Payment = { id: string; amount: number; status: string; reference?: string; created_at: string }
type Address = { id: string; line1: string; city: string; country: string }

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [fullName, setFullName] = useState(() => profile?.full_name || "")

  useEffect(() => {
    const load = async () => {
      if (!user) return
      const { data: pays } = await supabase.from("payments").select("id, amount, status, reference, created_at").order("created_at", { ascending: false })
      setPayments((pays || []) as Payment[])
      const { data: addrs } = await supabase.from("addresses").select("id, line1, city, country").order("created_at", { ascending: false })
      setAddresses((addrs || []) as Address[])
    }
    load()
  }, [user])

  const saveProfile = async () => {
    if (!user) return
    await supabase.from("profiles").update({ full_name: fullName }).eq("user_id", user.id)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Your Profile</h1>
      <section className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded border p-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <label className="block text-sm mt-3">Full Name</label>
          <input value={fullName} onChange={e=>setFullName(e.target.value)} className="border rounded px-3 py-2 w-full" />
          <button onClick={saveProfile} className="mt-3 bg-black text-white rounded px-3 py-2">Save</button>
        </div>
        <div className="rounded border p-4">
          <h2 className="text-lg font-semibold">Wallet</h2>
          <p className="text-sm text-neutral-600">Coming soon</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Order Tracking</h2>
        <div className="mt-3 grid gap-2">
          {payments.map(p => (
            <div key={p.id} className="flex items-center justify-between border rounded px-3 py-2">
              <div>
                <div className="font-medium">Payment {p.reference || p.id}</div>
                <div className="text-sm text-neutral-600">{new Date(p.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">${p.amount.toFixed(2)}</span>
                <span className={`text-sm ${p.status === 'successful' ? 'text-emerald-600' : 'text-neutral-600'}`}>{p.status}</span>
              </div>
            </div>
          ))}
          {!payments.length && <div className="text-sm text-neutral-600">No orders yet.</div>}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <div className="mt-3 grid gap-2">
          {addresses.map(a => (
            <div key={a.id} className="flex items-center justify-between border rounded px-3 py-2">
              <div>
                <div className="font-medium">{a.line1}</div>
                <div className="text-sm text-neutral-600">{a.city}, {a.country}</div>
              </div>
            </div>
          ))}
          {!addresses.length && <div className="text-sm text-neutral-600">No addresses added.</div>}
        </div>
      </section>
    </main>
  )
}