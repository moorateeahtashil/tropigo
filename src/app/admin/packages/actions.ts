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
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

const PackageSchema = z.object({
  pricing_mode: z.enum(['fixed','computed','computed_with_discount']).default('computed'),
  discount_percent: z.preprocess((v)=> Number(v || 0) || 0, z.number().min(0).max(100)).default(0),
  duration_days: z.preprocess((v)=> (v===''? null : Number(v)), z.number().int().positive().nullable()),
  highlights: z.array(z.string()).default([]),
  important_notes: z.string().optional().nullable(),
})

export type ProductInput = z.infer<typeof ProductSchema>
export type PackageInput = z.infer<typeof PackageSchema>

export async function listPackages(q?: string) {
  const supabase = createAdminClient()
  let query = supabase
    .from('products')
    .select('id, slug, title, status, base_currency, base_price, featured, position')
    .eq('product_type','package')
    .order('position', { ascending: true })
  if (q) query = query.ilike('title', `%${q}%`)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getPackageProduct(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(`*, packages(*), package_items(*, product:products!product_id(id, title, slug, product_type, base_price, base_currency)), product_media(*), product_pricing(*)`)
    .eq('id', id)
    .eq('product_type','package')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function listCatalogProducts(q?: string) {
  const supabase = createAdminClient()
  let query = supabase
    .from('products')
    .select('id, title, slug, product_type, base_price, base_currency, status')
    .in('product_type', ['activity','airport_transfer'])
    .eq('status', 'published')
    .order('title', { ascending: true })
  if (q) query = query.ilike('title', `%${q}%`)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createPackage(productInput: ProductInput, packageInput: PackageInput) {
  const supabase = createAdminClient()
  const p = ProductSchema.parse(productInput)
  const pk = PackageSchema.parse(packageInput)

  const { data: product, error: pErr } = await supabase
    .from('products')
    .insert({
      product_type: 'package',
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
  if (pErr || !product) throw new Error(pErr?.message || 'Create package product failed')

  const { error: kErr } = await supabase
    .from('packages')
    .insert({
      product_id: product.id,
      pricing_mode: pk.pricing_mode,
      discount_percent: pk.discount_percent,
      duration_days: pk.duration_days ?? null,
      highlights: pk.highlights,
      important_notes: pk.important_notes ?? null,
    })
  if (kErr) throw new Error(kErr.message)

  revalidatePath('/admin/packages')
  return product
}

export async function updatePackage(id: string, productInput: ProductInput, packageInput: PackageInput) {
  const supabase = createAdminClient()
  const p = ProductSchema.parse(productInput)
  const pk = PackageSchema.parse(packageInput)

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

  const { error: kErr } = await supabase
    .from('packages')
    .update({
      pricing_mode: pk.pricing_mode,
      discount_percent: pk.discount_percent,
      duration_days: pk.duration_days ?? null,
      highlights: pk.highlights,
      important_notes: pk.important_notes ?? null,
    })
    .eq('product_id', id)
  if (kErr) throw new Error(kErr.message)

  revalidatePath('/admin/packages')
  revalidatePath(`/admin/packages/${id}`)
}

export async function deletePackage(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/packages')
}

// -------------------- Package items ----------------------------

const PackageItemSchema = z.object({
  package_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.preprocess((v)=> Number(v || 1) || 1, z.number().int().min(1)).default(1),
  is_optional: z.boolean().default(false),
  is_default_selected: z.boolean().default(true),
  price_override: z.preprocess((v)=> (v===''? null : Number(v)), z.number().nonnegative().nullable()),
  notes: z.string().optional().nullable(),
})

export type PackageItemInput = z.infer<typeof PackageItemSchema>

export async function addPackageItem(input: PackageItemInput) {
  const supabase = createAdminClient()
  const i = PackageItemSchema.parse(input)

  const { data: existing } = await supabase
    .from('package_items')
    .select('sort_order')
    .eq('package_id', i.package_id)
    .order('sort_order', { ascending: false })
    .limit(1)
  const next = existing?.[0]?.sort_order ? existing[0].sort_order + 1 : 0

  const { error } = await supabase
    .from('package_items')
    .insert({
      package_id: i.package_id,
      product_id: i.product_id,
      quantity: i.quantity,
      is_optional: i.is_optional,
      is_default_selected: i.is_default_selected,
      price_override: i.price_override ?? null,
      notes: i.notes ?? null,
      sort_order: next,
    })
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/packages/${i.package_id}`)
}

export async function updatePackageItem(itemId: string, input: Partial<PackageItemInput>) {
  const supabase = createAdminClient()
  const patch: any = {}
  if (input.quantity != null) patch.quantity = input.quantity
  if (input.is_optional != null) patch.is_optional = input.is_optional
  if (input.is_default_selected != null) patch.is_default_selected = input.is_default_selected
  if (input.price_override !== undefined) patch.price_override = input.price_override
  if (input.notes !== undefined) patch.notes = input.notes
  const { error } = await supabase.from('package_items').update(patch).eq('id', itemId)
  if (error) throw new Error(error.message)
}

export async function movePackageItem(packageId: string, itemId: string, direction: 'up'|'down') {
  const supabase = createAdminClient()
  const { data: items } = await supabase
    .from('package_items')
    .select('id, sort_order')
    .eq('package_id', packageId)
    .order('sort_order', { ascending: true })
  if (!items) return
  const idx = items.findIndex(i => i.id === itemId)
  const swapWith = direction === 'up' ? idx - 1 : idx + 1
  if (idx < 0 || swapWith < 0 || swapWith >= items.length) return
  const a = items[idx]
  const b = items[swapWith]
  await supabase.from('package_items').update({ sort_order: b.sort_order }).eq('id', a.id)
  await supabase.from('package_items').update({ sort_order: a.sort_order }).eq('id', b.id)
  revalidatePath(`/admin/packages/${packageId}`)
}

export async function deletePackageItem(itemId: string, packageId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('package_items').delete().eq('id', itemId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/packages/${packageId}`)
}

// -------------------- Media (Package) --------------------------

export async function uploadPackageImage(productId: string, file: File) {
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
  revalidatePath(`/admin/packages/${productId}`)
  return data
}

export async function setPackageCoverImage(productId: string, mediaId: string) {
  const supabase = createAdminClient()
  await supabase.from('product_media').update({ is_cover: false }).eq('product_id', productId)
  await supabase.from('product_media').update({ is_cover: true }).eq('id', mediaId)
  revalidatePath(`/admin/packages/${productId}`)
}

export async function deletePackageMedia(productId: string, mediaId: string) {
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
  revalidatePath(`/admin/packages/${productId}`)
}

export async function movePackageMedia(productId: string, mediaId: string, direction: 'up'|'down') {
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
  revalidatePath(`/admin/packages/${productId}`)
}

export async function reorderPackageMedia(productId: string, orderedIds: string[]) {
  const supabase = createAdminClient()
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase.from('product_media').update({ sort_order: i }).eq('id', orderedIds[i])
  }
  revalidatePath(`/admin/packages/${productId}`)
}

export async function updatePackageMediaAlt(productId: string, mediaId: string, alt: string) {
  const supabase = createAdminClient()
  await supabase.from('product_media').update({ alt }).eq('id', mediaId)
  revalidatePath(`/admin/packages/${productId}`)
}

// ------------------- Pricing Overrides ------------------------

export async function addPackagePriceOverride(productId: string, currency: string, price: number) {
  const supabase = createAdminClient()
  await supabase
    .from('product_pricing')
    .upsert({ product_id: productId, currency, price }, { onConflict: 'product_id,currency' })
  revalidatePath(`/admin/packages/${productId}`)
}

export async function deletePackagePriceOverride(overrideId: string, productId: string) {
  const supabase = createAdminClient()
  await supabase.from('product_pricing').delete().eq('id', overrideId)
  revalidatePath(`/admin/packages/${productId}`)
}

