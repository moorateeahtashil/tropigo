"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function listEnquiries(status?: string) {
  const supabase = createAdminClient()
  let q = supabase.from('enquiries').select('*')
  if (status) q = q.eq('status', status)
  const { data, error } = await q.order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function updateEnquiryStatus(id: string, status: 'new'|'in_progress'|'resolved'|'archived') {
  const supabase = createAdminClient()
  const { error } = await supabase.from('enquiries').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/enquiries')
}

