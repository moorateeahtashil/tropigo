"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function listSections() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('homepage_sections').select('*').order('position', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getSection(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('homepage_sections').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function createSection(input: any) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('homepage_sections').insert(input).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/homepage')
  redirect('/admin/content/homepage?toast=success&toast_title=Homepage+section+created')
}

export async function updateSection(id: string, input: any) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('homepage_sections').update(input).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/homepage')
  revalidatePath(`/admin/content/homepage/${id}`)
  redirect('/admin/content/homepage?toast=success&toast_title=Homepage+section+updated')
}

export async function deleteSection(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('homepage_sections').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/homepage')
  redirect('/admin/content/homepage?toast=success&toast_title=Homepage+section+deleted')
}

export async function reorderSections(orderedIds: string[]) {
  const supabase = createAdminClient()
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase.from('homepage_sections').update({ position: i }).eq('id', orderedIds[i])
  }
  revalidatePath('/admin/content/homepage')
}
