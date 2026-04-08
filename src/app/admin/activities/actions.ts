"use server"

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(['draft','published','archived']).default('draft'),
  base_currency: z.string().length(3).default('EUR'),
  base_price: z.preprocess((v)=> (v === '' || v === null ? null : Number(v)), z.number().nonnegative().nullable()),
  featured: z.boolean().default(false),
  position: z.number().int().min(0).default(0),
  destination_id: z.string().uuid().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

const ActivitySchema = z.object({
  duration_minutes: z.preprocess((v)=> v===''? null : Number(v), z.number().int().positive().nullable()).optional(),
  tour_type: z.enum(['private','group','shared']).optional().nullable(),
  transportation: z.string().optional().nullable(),
  pickup_location: z.string().optional().nullable(),
  pickup_time: z.string().optional().nullable(),
  min_participants: z.preprocess((v)=> v===''? 1 : Number(v), z.number().int().min(1)).default(1),
  max_participants: z.preprocess((v)=> v===''? null : Number(v), z.number().int().nullable()),
  difficulty_level: z.enum(['easy','moderate','challenging']).optional().nullable(),
  included_items: z.array(z.string()).default([]),
  excluded_items: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  important_notes: z.string().optional().nullable(),
})

export type ProductInput = z.infer<typeof ProductSchema>
export type ActivityInput = z.infer<typeof ActivitySchema>

export async function listActivities(q?: string) {
  const supabase = createAdminClient()
  let query = supabase
    .from('products')
    .select('id, slug, title, status, base_currency, base_price, featured, position')
    .eq('product_type','activity')
    .order('position', { ascending: true })
  if (q) query = query.ilike('title', `%${q}%`)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getActivityProduct(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(`*, activities(*), product_media(*), product_destinations(destination_id), product_pricing(*), availability_rules(*)`) 
    .eq('id', id)
    .eq('product_type','activity')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function listDestinationsOptions() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('destinations')
    .select('id, name, region, published')
    .order('name', { ascending: true })
  return data ?? []
}

export async function createActivity(productInput: ProductInput, activityInput: ActivityInput) {
  const supabase = createAdminClient()
  const p = ProductSchema.parse(productInput)
  const a = ActivitySchema.parse(activityInput)

  // Create product
  const { data: product, error: pErr } = await supabase
    .from('products')
    .insert({
      product_type: 'activity',
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle ?? null,
      summary: p.summary ?? null,
      description: p.description ?? null,
      status: p.status,
      base_currency: p.base_currency,
      base_price: p.base_price,
      featured: p.featured,
      position: p.position,
      seo_title: p.seo_title ?? null,
      seo_description: p.seo_description ?? null,
    })
    .select()
    .single()
  if (pErr || !product) throw new Error(pErr?.message || 'Create product failed')

  // Create activities extension
  const { error: aErr } = await supabase
    .from('activities')
    .insert({
      product_id: product.id,
      duration_minutes: a.duration_minutes ?? null,
      tour_type: a.tour_type ?? null,
      transportation: a.transportation ?? null,
      pickup_location: a.pickup_location ?? null,
      pickup_time: a.pickup_time ?? null,
      min_participants: a.min_participants ?? 1,
      max_participants: a.max_participants ?? null,
      difficulty_level: a.difficulty_level ?? null,
      included_items: a.included_items,
      excluded_items: a.excluded_items,
      highlights: a.highlights,
      important_notes: a.important_notes ?? null,
      destination_id: p.destination_id ?? null,
    })
  if (aErr) throw new Error(aErr.message)

  // Link destination in product_destinations (optional single mapping)
  if (p.destination_id) {
    await supabase.from('product_destinations').insert({ product_id: product.id, destination_id: p.destination_id })
  }

  revalidatePath('/admin/activities')
  return product
}

export async function updateActivity(id: string, productInput: ProductInput, activityInput: ActivityInput) {
  const supabase = createAdminClient()
  const p = ProductSchema.parse(productInput)
  const a = ActivitySchema.parse(activityInput)

  const { error: pErr } = await supabase
    .from('products')
    .update({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle ?? null,
      summary: p.summary ?? null,
      description: p.description ?? null,
      status: p.status,
      base_currency: p.base_currency,
      base_price: p.base_price,
      featured: p.featured,
      position: p.position,
      seo_title: p.seo_title ?? null,
      seo_description: p.seo_description ?? null,
    })
    .eq('id', id)
  if (pErr) throw new Error(pErr.message)

  const { error: aErr } = await supabase
    .from('activities')
    .update({
      duration_minutes: a.duration_minutes ?? null,
      tour_type: a.tour_type ?? null,
      transportation: a.transportation ?? null,
      pickup_location: a.pickup_location ?? null,
      pickup_time: a.pickup_time ?? null,
      min_participants: a.min_participants ?? 1,
      max_participants: a.max_participants ?? null,
      difficulty_level: a.difficulty_level ?? null,
      included_items: a.included_items,
      excluded_items: a.excluded_items,
      highlights: a.highlights,
      important_notes: a.important_notes ?? null,
      destination_id: p.destination_id ?? null,
    })
    .eq('product_id', id)
  if (aErr) throw new Error(aErr.message)

  // Sync product_destinations (single mapping)
  await supabase.from('product_destinations').delete().eq('product_id', id)
  if (p.destination_id) {
    await supabase.from('product_destinations').insert({ product_id: id, destination_id: p.destination_id })
  }

  revalidatePath('/admin/activities')
  revalidatePath(`/admin/activities/${id}`)
}

export async function deleteActivity(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/activities')
}

// ------------------------- MEDIA ------------------------------

export async function uploadActivityImage(productId: string, file: File) {
  const supabase = createAdminClient()
  const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `products/${productId}/${Date.now()}_${fileName}`
  const { error: upErr } = await supabase.storage.from('assets').upload(path, file, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  })
  if (upErr) throw new Error(upErr.message)

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${path}`
  // Determine next sort order
  const { data: existing } = await supabase
    .from('product_media')
    .select('sort_order')
    .eq('product_id', productId)
    .order('sort_order', { ascending: false })
    .limit(1)
  const nextSort = existing?.[0]?.sort_order ? existing[0].sort_order + 1 : 0

  const { data, error } = await supabase
    .from('product_media')
    .insert({ product_id: productId, url: publicUrl, alt: null, media_type: 'image', is_cover: false, sort_order: nextSort })
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/activities/${productId}`)
  return data
}

export async function setCoverImage(productId: string, mediaId: string) {
  const supabase = createAdminClient()
  await supabase.from('product_media').update({ is_cover: false }).eq('product_id', productId)
  await supabase.from('product_media').update({ is_cover: true }).eq('id', mediaId)
  revalidatePath(`/admin/activities/${productId}`)
}

export async function deleteMedia(productId: string, mediaId: string) {
  const supabase = createAdminClient()
  const { data: media } = await supabase
    .from('product_media')
    .select('url')
    .eq('id', mediaId)
    .single()

  if (media?.url) {
    const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/`
    if (media.url.startsWith(prefix)) {
      const path = media.url.substring(prefix.length)
      await supabase.storage.from('assets').remove([path]).catch(() => {})
    }
  }

  await supabase.from('product_media').delete().eq('id', mediaId)
  revalidatePath(`/admin/activities/${productId}`)
}

export async function moveMedia(productId: string, mediaId: string, direction: 'up'|'down') {
  const supabase = createAdminClient()
  const { data: mediaList } = await supabase
    .from('product_media')
    .select('id, sort_order')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true })
  if (!mediaList) return
  const idx = mediaList.findIndex(m => m.id === mediaId)
  const swapWith = direction === 'up' ? idx - 1 : idx + 1
  if (idx < 0 || swapWith < 0 || swapWith >= mediaList.length) return
  const a = mediaList[idx]
  const b = mediaList[swapWith]
  await supabase.from('product_media').update({ sort_order: b.sort_order }).eq('id', a.id)
  await supabase.from('product_media').update({ sort_order: a.sort_order }).eq('id', b.id)
  revalidatePath(`/admin/activities/${productId}`)
}

export async function updateMediaAlt(productId: string, mediaId: string, alt: string) {
  const supabase = createAdminClient()
  await supabase.from('product_media').update({ alt }).eq('id', mediaId)
  revalidatePath(`/admin/activities/${productId}`)
}

export async function reorderMedia(productId: string, orderedIds: string[]) {
  const supabase = createAdminClient()
  const updates = orderedIds.map((id, idx) => ({ id, sort_order: idx }))
  for (const u of updates) {
    await supabase.from('product_media').update({ sort_order: u.sort_order }).eq('id', u.id)
  }
  revalidatePath(`/admin/activities/${productId}`)
}

// ------------------- Pricing Overrides ------------------------

export async function addPriceOverride(productId: string, currency: string, price: number) {
  const supabase = createAdminClient()
  await supabase
    .from('product_pricing')
    .upsert({ product_id: productId, currency, price }, { onConflict: 'product_id,currency' })
  revalidatePath(`/admin/activities/${productId}`)
}

export async function deletePriceOverride(overrideId: string, productId: string) {
  const supabase = createAdminClient()
  await supabase.from('product_pricing').delete().eq('id', overrideId)
  revalidatePath(`/admin/activities/${productId}`)
}

// ------------------- Availability Rules -----------------------

export async function addAvailabilityRule(input: {
  product_id: string
  rule_type: 'blackout' | 'schedule' | 'cutoff'
  start_date?: string | null
  end_date?: string | null
  days_of_week?: number[]
  min_advance_hours?: number
  max_advance_days?: number | null
  notes?: string | null
}) {
  const supabase = createAdminClient()
  await supabase.from('availability_rules').insert({
    product_id: input.product_id,
    rule_type: input.rule_type,
    start_date: input.start_date ?? null,
    end_date: input.end_date ?? null,
    days_of_week: input.days_of_week ?? [],
    min_advance_hours: input.min_advance_hours ?? 24,
    max_advance_days: input.max_advance_days ?? null,
    notes: input.notes ?? null,
  })
  revalidatePath(`/admin/activities/${input.product_id}`)
}

export async function deleteAvailabilityRule(ruleId: string, productId: string) {
  const supabase = createAdminClient()
  await supabase.from('availability_rules').delete().eq('id', ruleId)
  revalidatePath(`/admin/activities/${productId}`)
}
