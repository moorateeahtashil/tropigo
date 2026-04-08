"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function listReviews(status?: 'pending'|'approved'|'rejected') {
  const supabase = createAdminClient()
  let q = supabase.from('reviews').select('id, product_id, author_name, rating, title, body, status, created_at, products:products!inner(title, slug, product_type)')
  if (status) q = q.eq('status', status)
  const { data, error } = await q.order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function setReviewStatus(id: string, status: 'approved'|'rejected') {
  const supabase = createAdminClient()
  const { error } = await supabase.from('reviews').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/reviews')
}

