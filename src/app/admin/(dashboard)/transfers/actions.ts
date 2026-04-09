"use server"

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

const TransferSchema = z.object({
  pricing_model: z.enum(['fixed','zone_based','distance_based']).default('fixed'),
  vehicle_type: z.enum(['sedan','minivan','bus','luxury']).default('sedan'),
  max_passengers: z.preprocess((v)=> Number(v || 0) || 4, z.number().int().min(1)).default(4),
  max_luggage: z.preprocess((v)=> (v===''? null : Number(v)), z.number().int().nullable()),
  includes_meet_greet: z.boolean().default(false),
  includes_flight_tracking: z.boolean().default(false),
  base_fare: z.preprocess((v)=> (v===''? null : Number(v)), z.number().nonnegative().nullable()),
  per_km_rate: z.preprocess((v)=> (v===''? null : Number(v)), z.number().nonnegative().nullable()),
  waiting_fee_per_hour: z.preprocess((v)=> (v===''? null : Number(v)), z.number().nonnegative().nullable()),
  notes: z.string().optional().nullable(),
})

export type ProductInput = z.infer<typeof ProductSchema>
export type TransferInput = z.infer<typeof TransferSchema>

export async function listTransfers(q?: string) {
  const supabase = createAdminClient()
  let query = supabase
    .from('products')
    .select('id, slug, title, status, base_currency, base_price, featured, position')
    .eq('product_type','airport_transfer')
    .order('position', { ascending: true })
  if (q) query = query.ilike('title', `%${q}%`)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getTransferProduct(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(`*, airport_transfers(*), product_media(*), product_pricing(*), transfer_zone_prices(*, from_zone:transfer_zones!from_zone_id(id,name), to_zone:transfer_zones!to_zone_id(id,name))`)
    .eq('id', id)
    .eq('product_type','airport_transfer')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function listZonesOptions() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('transfer_zones')
    .select('id, name')
    .order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createTransfer(productInput: ProductInput, transferInput: TransferInput) {
  const supabase = createAdminClient()
  const p = ProductSchema.parse(productInput)
  const t = TransferSchema.parse(transferInput)

  const { data: product, error: pErr } = await supabase
    .from('products')
    .insert({
      product_type: 'airport_transfer',
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
  if (pErr || !product) throw new Error(pErr?.message || 'Create transfer product failed')

  const { error: tErr } = await supabase
    .from('airport_transfers')
    .insert({
      product_id: product.id,
      pricing_model: t.pricing_model,
      vehicle_type: t.vehicle_type,
      max_passengers: t.max_passengers,
      max_luggage: t.max_luggage ?? null,
      includes_meet_greet: t.includes_meet_greet,
      includes_flight_tracking: t.includes_flight_tracking,
      base_fare: t.base_fare ?? null,
      per_km_rate: t.per_km_rate ?? null,
      waiting_fee_per_hour: t.waiting_fee_per_hour ?? null,
      notes: t.notes ?? null,
    })
  if (tErr) throw new Error(tErr.message)

  revalidatePath('/admin/transfers')
  redirect('/admin/transfers?toast=success&toast_title=Transfer+saved')
}

export async function updateTransfer(id: string, productInput: ProductInput, transferInput: TransferInput) {
  const supabase = createAdminClient()
  const p = ProductSchema.parse(productInput)
  const t = TransferSchema.parse(transferInput)

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

  const { error: tErr } = await supabase
    .from('airport_transfers')
    .update({
      pricing_model: t.pricing_model,
      vehicle_type: t.vehicle_type,
      max_passengers: t.max_passengers,
      max_luggage: t.max_luggage ?? null,
      includes_meet_greet: t.includes_meet_greet,
      includes_flight_tracking: t.includes_flight_tracking,
      base_fare: t.base_fare ?? null,
      per_km_rate: t.per_km_rate ?? null,
      waiting_fee_per_hour: t.waiting_fee_per_hour ?? null,
      notes: t.notes ?? null,
    })
    .eq('product_id', id)
  if (tErr) throw new Error(tErr.message)

  revalidatePath('/admin/transfers')
  revalidatePath(`/admin/transfers/${id}`)
  redirect('/admin/transfers?toast=success&toast_title=Transfer+saved')
}

export async function deleteTransfer(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/transfers')
  redirect('/admin/transfers?toast=success&toast_title=Transfer+deleted')
}

// -------------------- Zone price matrix -----------------------

const ZonePriceSchema = z.object({
  transfer_id: z.string().uuid(),
  from_zone_id: z.string().uuid(),
  to_zone_id: z.string().uuid(),
  vehicle_type: z.enum(['sedan','minivan','bus','luxury']).optional().nullable(),
  price: z.preprocess((v)=> Number(v || 0), z.number().nonnegative()),
})

export type ZonePriceInput = z.infer<typeof ZonePriceSchema>

export async function upsertZonePrice(input: ZonePriceInput) {
  const supabase = createAdminClient()
  const parsed = ZonePriceSchema.parse(input)
  // Try to find existing row by unique key
  const { data: existing } = await supabase
    .from('transfer_zone_prices')
    .select('id')
    .eq('transfer_id', parsed.transfer_id)
    .eq('from_zone_id', parsed.from_zone_id)
    .eq('to_zone_id', parsed.to_zone_id)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('transfer_zone_prices')
      .update({ vehicle_type: parsed.vehicle_type ?? null, price: parsed.price })
      .eq('id', existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('transfer_zone_prices')
      .insert({
        transfer_id: parsed.transfer_id,
        from_zone_id: parsed.from_zone_id,
        to_zone_id: parsed.to_zone_id,
        vehicle_type: parsed.vehicle_type ?? null,
        price: parsed.price,
      })
    if (error) throw new Error(error.message)
  }

  revalidatePath(`/admin/transfers/${parsed.transfer_id}`)
}

export async function deleteZonePrice(id: string, transferId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('transfer_zone_prices').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/transfers/${transferId}`)
}

// ------------------------- MEDIA ------------------------------

export async function uploadTransferImage(productId: string, file: File) {
  const supabase = createAdminClient()
  const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `products/${productId}/${Date.now()}_${fileName}`
  const { error: upErr } = await supabase.storage.from('assets').upload(path, file, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  })
  if (upErr) throw new Error(upErr.message)

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${path}`
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
  revalidatePath(`/admin/transfers/${productId}`)
  return data
}

export async function setTransferCoverImage(productId: string, mediaId: string) {
  const supabase = createAdminClient()
  await supabase.from('product_media').update({ is_cover: false }).eq('product_id', productId)
  await supabase.from('product_media').update({ is_cover: true }).eq('id', mediaId)
  revalidatePath(`/admin/transfers/${productId}`)
}

export async function deleteTransferMedia(productId: string, mediaId: string) {
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
  revalidatePath(`/admin/transfers/${productId}`)
}

export async function moveTransferMedia(productId: string, mediaId: string, direction: 'up'|'down') {
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
  revalidatePath(`/admin/transfers/${productId}`)
}

export async function updateTransferMediaAlt(productId: string, mediaId: string, alt: string) {
  const supabase = createAdminClient()
  await supabase.from('product_media').update({ alt }).eq('id', mediaId)
  revalidatePath(`/admin/transfers/${productId}`)
}

export async function reorderTransferMedia(productId: string, orderedIds: string[]) {
  const supabase = createAdminClient()
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase.from('product_media').update({ sort_order: i }).eq('id', orderedIds[i])
  }
  revalidatePath(`/admin/transfers/${productId}`)
}

// ------------------- Pricing Overrides ------------------------

export async function addTransferPriceOverride(productId: string, currency: string, price: number) {
  const supabase = createAdminClient()
  await supabase
    .from('product_pricing')
    .upsert({ product_id: productId, currency, price }, { onConflict: 'product_id,currency' })
  revalidatePath(`/admin/transfers/${productId}`)
}

export async function deleteTransferPriceOverride(overrideId: string, productId: string) {
  const supabase = createAdminClient()
  await supabase.from('product_pricing').delete().eq('id', overrideId)
  revalidatePath(`/admin/transfers/${productId}`)
}
