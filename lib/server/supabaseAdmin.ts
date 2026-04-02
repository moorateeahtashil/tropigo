import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/server/db-types'

export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !service) return null
  return createClient<Database>(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

