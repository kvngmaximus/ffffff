import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error('Supabase environment variables are missing')
    }
    client = createClient(url, key)
  }
  return client
}

type ClientProp = keyof SupabaseClient
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: ClientProp) {
    const c = getClient()
    return c[prop]
  }
})