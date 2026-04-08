"use server"

import { createAdminClient } from '@/lib/supabase/admin'

export async function listBookings() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('id, ref, status, total_amount, currency, created_at, customers(first_name,last_name,email)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getBooking(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*, customers(*), booking_items(*), booking_travellers(*), payments(*)')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

