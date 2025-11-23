"use client"
import { useState } from "react"
import { useAuth } from "@/context/auth"

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"signin"|"signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setLoading(true); setError(null)
    const fn = mode === "signin" ? signIn : signUp
    const res = await fn(email, password)
    if (res.error) setError(res.error)
    setLoading(false)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-[60px]">
      <h1 className="text-center text-3xl font-serif text-[#1C1C1C]">{mode === "signin" ? "Sign In" : "Create Account"}</h1>
      <div className="mx-auto max-w-md mt-8 rounded-2xl bg-white ring-1 ring-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-center gap-4">
          <button className={`px-3 py-1 rounded ${mode==='signin'?'bg-[#4D6B57] text-white':'border'}`} onClick={()=>setMode("signin")}>Sign In</button>
          <button className={`px-3 py-1 rounded ${mode==='signup'?'bg-[#4D6B57] text-white':'border'}`} onClick={()=>setMode("signup")}>Sign Up</button>
        </div>
        <div className="mt-6 grid gap-3">
          <label className="text-sm">Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="border rounded px-3 py-2" />
          <label className="text-sm mt-3">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border rounded px-3 py-2" />
        </div>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        <button onClick={submit} disabled={loading} className="mt-6 w-full bg-[#4D6B57] text-white rounded-md px-3 py-2">{loading ? "Please wait..." : (mode === "signin" ? "Sign In" : "Create Account")}</button>
      </div>
    </main>
  )
}