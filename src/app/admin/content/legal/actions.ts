"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function listLegalPages() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('legal_pages').select('*').order('title', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getLegal(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('legal_pages').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function createLegal(input: { title: string; slug: string; content: string; version?: string | null; effective_date?: string | null; published?: boolean }) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('legal_pages').insert({ ...input, published: !!input.published }).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/legal')
  return data
}

export async function updateLegal(id: string, input: Partial<{ title: string; slug: string; content: string; version?: string | null; effective_date?: string | null; published?: boolean }>) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('legal_pages').update(input).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/legal')
  revalidatePath(`/admin/content/legal/${id}`)
  return data
}

export async function deleteLegal(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('legal_pages').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/legal')
}

