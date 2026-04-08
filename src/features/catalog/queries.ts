import { createClient } from '@/lib/supabase/server'
import type { ProductRow, ActivityRow, AirportTransferRow, PackageRow, ProductMediaRow, DestinationRow } from '@/types/database'

// ---------------------------------------------------------------
// Joined product type with extension data
// ---------------------------------------------------------------

export type ProductWithMedia = ProductRow & {
  cover_image_url: string | null
}

export type ActivityProduct = ProductRow & {
  activities: ActivityRow
  cover_image_url: string | null
  destination: Pick<DestinationRow, 'id' | 'slug' | 'name' | 'region'> | null
}

export type TransferProduct = ProductRow & {
  airport_transfers: AirportTransferRow
  cover_image_url: string | null
}

export type PackageProduct = ProductRow & {
  packages: PackageRow
  cover_image_url: string | null
  item_count: number
}

// ---------------------------------------------------------------
// Activities
// ---------------------------------------------------------------

export async function getPublishedActivities(options?: {
  destinationSlug?: string
  featured?: boolean
  limit?: number
}): Promise<ActivityProduct[]> {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      activities!inner(
        product_id, duration_minutes, tour_type, transportation,
        pickup_location, pickup_time, min_participants, max_participants,
        difficulty_level, included_items, excluded_items, highlights,
        important_notes, destination_id
      ),
      product_media(url, is_cover, sort_order),
      product_destinations(destination_id,
        destinations(id, slug, name, region)
      )
    `)
    .eq('status', 'published')
    .eq('product_type', 'activity')
    .order('position', { ascending: true })

  if (options?.featured) query = query.eq('featured', true)
  if (options?.limit) query = query.limit(options.limit)
  if (options?.destinationSlug) {
    query = query.eq('product_destinations.destinations.slug', options.destinationSlug)
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to fetch activities: ${error.message}`)

  return (data ?? []).map(row => {
    const coverMedia = (row.product_media as ProductMediaRow[]).find(m => m.is_cover)
      ?? (row.product_media as ProductMediaRow[])[0]

    const firstDestination = (row.product_destinations as Array<{
      destination_id: string
      destinations: Pick<DestinationRow, 'id' | 'slug' | 'name' | 'region'>
    }>)[0]?.destinations ?? null

    return {
      ...row,
      activities: row.activities as unknown as ActivityRow,
      cover_image_url: coverMedia?.url ?? null,
      destination: firstDestination,
    }
  }) as ActivityProduct[]
}

export async function getActivityBySlug(slug: string): Promise<ActivityProduct | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      activities!inner(*),
      product_media(*, url, alt, is_cover, sort_order, media_type),
      product_destinations(
        destinations(id, slug, name, region, summary, hero_image_url)
      ),
      reviews(id, rating, author_name, title, body, created_at, verified_booking)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('product_type', 'activity')
    .single()

  if (error || !data) return null

  const coverMedia = (data.product_media as ProductMediaRow[]).find(m => m.is_cover)
    ?? (data.product_media as ProductMediaRow[])[0]

  const firstDestination = (data.product_destinations as Array<{
    destinations: Pick<DestinationRow, 'id' | 'slug' | 'name' | 'region' | 'summary' | 'hero_image_url'>
  }>)[0]?.destinations ?? null

  return {
    ...data,
    activities: data.activities as unknown as ActivityRow,
    cover_image_url: coverMedia?.url ?? null,
    destination: firstDestination,
  } as ActivityProduct
}

// ---------------------------------------------------------------
// Transfers
// ---------------------------------------------------------------

export async function getPublishedTransfers(options?: {
  limit?: number
}): Promise<TransferProduct[]> {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      airport_transfers!inner(*),
      product_media(url, is_cover, sort_order)
    `)
    .eq('status', 'published')
    .eq('product_type', 'airport_transfer')
    .order('position', { ascending: true })

  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch transfers: ${error.message}`)

  return (data ?? []).map(row => {
    const coverMedia = (row.product_media as ProductMediaRow[]).find(m => m.is_cover)
      ?? (row.product_media as ProductMediaRow[])[0]
    return {
      ...row,
      airport_transfers: row.airport_transfers as unknown as AirportTransferRow,
      cover_image_url: coverMedia?.url ?? null,
    }
  }) as TransferProduct[]
}

export async function getTransferBySlug(slug: string): Promise<any> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      airport_transfers!inner(*),
      product_media(*),
      transfer_zone_prices(
        id, vehicle_type, price,
        from_zone:transfer_zones!from_zone_id(id, name),
        to_zone:transfer_zones!to_zone_id(id, name)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('product_type', 'airport_transfer')
    .single()

  if (error || !data) return null

  const coverMedia = (data.product_media as ProductMediaRow[]).find(m => m.is_cover)

  return {
    ...data,
    airport_transfers: data.airport_transfers as unknown as AirportTransferRow,
    cover_image_url: coverMedia?.url ?? null,
    zone_prices: data.transfer_zone_prices,
  }
}

// ---------------------------------------------------------------
// Packages
// ---------------------------------------------------------------

export async function getPublishedPackages(options?: {
  featured?: boolean
  limit?: number
}): Promise<PackageProduct[]> {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      packages!inner(*),
      product_media(url, is_cover, sort_order),
      package_items!package_items_package_id_fkey(id)
    `)
    .eq('status', 'published')
    .eq('product_type', 'package')
    .order('position', { ascending: true })

  if (options?.featured) query = query.eq('featured', true)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch packages: ${error.message}`)

  return (data ?? []).map(row => {
    const coverMedia = (row.product_media as ProductMediaRow[]).find(m => m.is_cover)
      ?? (row.product_media as ProductMediaRow[])[0]
    return {
      ...row,
      packages: row.packages as unknown as PackageRow,
      cover_image_url: coverMedia?.url ?? null,
      item_count: (row.package_items as Array<{ id: string }>).length,
    }
  }) as PackageProduct[]
}

export async function getPackageBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      packages!inner(*),
      product_media(*),
      package_items!package_items_package_id_fkey(
        id, sort_order, is_optional, is_default_selected, quantity, price_override, notes,
        product:products!package_items_product_id_fkey(
          id, slug, title, summary, base_price, base_currency, product_type,
          product_media(url, is_cover)
        )
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('product_type', 'package')
    .single()

  if (error || !data) return null

  const coverMedia = (data.product_media as ProductMediaRow[]).find(m => m.is_cover)

  return {
    ...data,
    packages: data.packages as unknown as PackageRow,
    cover_image_url: coverMedia?.url ?? null,
  }
}

// ---------------------------------------------------------------
// Destinations
// ---------------------------------------------------------------

export async function getPublishedDestinations(options?: {
  featured?: boolean
  limit?: number
}): Promise<DestinationRow[]> {
  const supabase = await createClient()

  let query = supabase
    .from('destinations')
    .select('*')
    .eq('published', true)
    .order('position', { ascending: true })

  if (options?.featured) query = query.eq('featured', true)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) {
    // Graceful server-side fallback: if RLS blocks anon reads, retry with service role
    // This keeps the public site resilient while we ensure policies are applied.
    if (typeof error.message === 'string' && /permission denied/i.test(error.message)) {
      try {
        const { createAdminClient } = await import('@/lib/supabase/admin')
        const admin = createAdminClient()
        let adminQuery = admin
          .from('destinations')
          .select('*')
          .eq('published', true)
          .order('position', { ascending: true })
        if (options?.featured) adminQuery = adminQuery.eq('featured', true)
        if (options?.limit) adminQuery = adminQuery.limit(options.limit)
        const { data: adminData } = await adminQuery
        return (adminData ?? []) as DestinationRow[]
      } catch (e) {
        // If admin fallback also fails, surface the original error for clarity
        throw new Error(`Failed to fetch destinations: ${error.message}`)
      }
    }
    throw new Error(`Failed to fetch destinations: ${error.message}`)
  }

  return (data ?? []) as DestinationRow[]
}

export async function getDestinationBySlug(slug: string): Promise<DestinationRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    if (typeof error.message === 'string' && /permission denied/i.test(error.message)) {
      try {
        const { createAdminClient } = await import('@/lib/supabase/admin')
        const admin = createAdminClient()
        const { data: adminData } = await admin
          .from('destinations')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single()
        return (adminData as DestinationRow) ?? null
      } catch {
        return null
      }
    }
    return null
  }
  if (!data) return null
  return data as DestinationRow
}

// ---------------------------------------------------------------
// Slugged product lookup (for sitemap, etc.)
// ---------------------------------------------------------------

export async function getAllPublishedSlugs(): Promise<Array<{ slug: string; product_type: string }>> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('slug, product_type')
    .eq('status', 'published')

  return data ?? []
}
