"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function listPages() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('pages').select('*').order('title', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getPage(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('pages').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function createPage(input: { title: string; slug: string; content?: string | null; published?: boolean }) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('pages').insert({ title: input.title, slug: input.slug, content: input.content ?? null, published: !!input.published }).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/pages')
  redirect('/admin/content/pages?toast=success&toast_title=Page+created')
}

export async function updatePage(id: string, input: Partial<{ title: string; slug: string; content?: string | null; published?: boolean }>) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('pages').update(input).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${id}`)
  redirect('/admin/content/pages?toast=success&toast_title=Page+updated')
}

export async function deletePage(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('pages').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/pages')
  redirect('/admin/content/pages?toast=success&toast_title=Page+deleted')
}

