"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function listFaqs() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('faqs').select('*').order('position', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getFaq(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('faqs').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function createFaq(input: { category: string; question: string; answer: string; position?: number; related_product_id?: string | null; published?: boolean }) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('faqs').insert({ ...input, published: !!input.published }).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/faqs')
  return data
}

export async function updateFaq(id: string, input: Partial<{ category: string; question: string; answer: string; position?: number; related_product_id?: string | null; published?: boolean }>) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('faqs').update(input).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/faqs')
  revalidatePath(`/admin/content/faqs/${id}`)
  return data
}

export async function deleteFaq(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('faqs').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/faqs')
}

