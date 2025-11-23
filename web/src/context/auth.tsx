"use client"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type AuthUser = {
  id: string
  email?: string
}

type Profile = {
  id: string
  user_id: string
  full_name?: string
  avatar_url?: string
  user_type?: string
  status?: string
}

type AuthContextValue = {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data: sessionData } = await supabase.auth.getSession()
      const sessUser = sessionData.session?.user || null
      setUser(sessUser ? { id: sessUser.id, email: sessUser.email || undefined } : null)
      if (sessUser) {
        const { data } = await supabase.from("profiles").select("*").eq("user_id", sessUser.id).maybeSingle()
        setProfile(data as Profile || null)
      } else {
        setProfile(null)
      }
      setLoading(false)
    }
    load()
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessUser = session?.user || null
      setUser(sessUser ? { id: sessUser.id, email: sessUser.email || undefined } : null)
      if (sessUser) {
        const { data } = await supabase.from("profiles").select("*").eq("user_id", sessUser.id).maybeSingle()
        setProfile(data as Profile || null)
      } else {
        setProfile(null)
      }
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return {}
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }
    if (data.user) {
      await supabase.from("profiles").upsert({ user_id: data.user.id })
    }
    return {}
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = useMemo(() => ({ user, profile, loading, signIn, signUp, signOut }), [user, profile, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("AuthProvider missing")
  return ctx
}