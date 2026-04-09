"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function listTestimonials() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('testimonials').select('*').order('position', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getTestimonial(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function createTestimonial(input: { author_name: string; author_location?: string | null; quote: string; rating?: number | null; position?: number; published?: boolean }) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('testimonials').insert({ ...input, published: !!input.published }).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/testimonials')
  redirect('/admin/content/testimonials?toast=success&toast_title=Testimonial+created')
}

export async function updateTestimonial(id: string, input: Partial<{ author_name: string; author_location?: string | null; quote: string; rating?: number | null; position?: number; published?: boolean }>) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('testimonials').update(input).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/testimonials')
  revalidatePath(`/admin/content/testimonials/${id}`)
  redirect('/admin/content/testimonials?toast=success&toast_title=Testimonial+updated')
}

export async function deleteTestimonial(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/testimonials')
  redirect('/admin/content/testimonials?toast=success&toast_title=Testimonial+deleted')
}

