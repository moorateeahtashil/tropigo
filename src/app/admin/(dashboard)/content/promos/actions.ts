"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function listPromos() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('promo_banners').select('*').order('priority', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getPromo(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('promo_banners').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function createPromo(input: any) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('promo_banners').insert(input).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/promos')
  redirect('/admin/content/promos?toast=success&toast_title=Promo+created')
}

export async function updatePromo(id: string, input: any) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('promo_banners').update(input).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/promos')
  revalidatePath(`/admin/content/promos/${id}`)
  redirect('/admin/content/promos?toast=success&toast_title=Promo+updated')
}

export async function deletePromo(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('promo_banners').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/promos')
  redirect('/admin/content/promos?toast=success&toast_title=Promo+deleted')
}

