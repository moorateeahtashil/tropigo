"use server"

import { createAdminClient } from '@/lib/supabase/admin'

export async function listCustomers(q?: string) {
  const supabase = createAdminClient()
  let query = supabase
    .from('customers')
    .select('*, bookings(count)')
    .order('created_at', { ascending: false })
  if (q) query = query.ilike('email', `%${q}%`)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

