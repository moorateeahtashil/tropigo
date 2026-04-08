"use server"

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

const DestinationSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  hero_image_url: z.string().url().optional().nullable(),
  position: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

export type DestinationInput = z.infer<typeof DestinationSchema>

export async function listDestinations(q?: string) {
  const supabase = createAdminClient()
  let query = supabase.from('destinations').select('*').order('position', { ascending: true })
  if (q) query = query.ilike('name', `%${q}%`)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getDestination(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('destinations').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function createDestination(input: DestinationInput) {
  const supabase = createAdminClient()
  const parse = DestinationSchema.safeParse(input)
  if (!parse.success) throw new Error(parse.error.errors.map(e => e.message).join(', '))
  const { data, error } = await supabase.from('destinations').insert(parse.data).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/destinations')
  return data
}

export async function updateDestination(id: string, input: DestinationInput) {
  const supabase = createAdminClient()
  const parse = DestinationSchema.safeParse({ ...input, id })
  if (!parse.success) throw new Error(parse.error.errors.map(e => e.message).join(', '))
  const { data, error } = await supabase.from('destinations').update(parse.data).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/destinations')
  revalidatePath(`/admin/destinations/${id}`)
  return data
}

export async function deleteDestination(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('destinations').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/destinations')
}

