import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Supabase env not set: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
  }
  client = createClient(url || '', anonKey || '')
  return client
}