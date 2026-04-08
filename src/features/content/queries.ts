import { createClient } from '@/lib/supabase/server'
import type {
  SettingsRow,
  FaqRow,
  TestimonialRow,
  NavigationMenuRow,
  NavigationItemRow,
  HomepageSectionRow,
  PromoBannerRow,
  LegalPageRow,
  PageRow,
} from '@/types/database'

// ---------------------------------------------------------------
// Settings (singleton)
// ---------------------------------------------------------------

export async function getSettings(): Promise<SettingsRow | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('settings')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single()

  return data as SettingsRow | null
}

// ---------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------

export async function getNavigation(menuKey: string): Promise<NavigationItemRow[]> {
  const supabase = await createClient()

  const { data: menu } = await supabase
    .from('navigation_menus')
    .select('id')
    .eq('key', menuKey)
    .single()

  if (!menu) return []

  const { data } = await supabase
    .from('navigation_items')
    .select('*')
    .eq('menu_id', menu.id)
    .eq('visible', true)
    .order('position', { ascending: true })

  return (data ?? []) as NavigationItemRow[]
}

export async function getMainNavigation() {
  return getNavigation('main')
}

export async function getFooterNavigation() {
  return getNavigation('footer')
}

// ---------------------------------------------------------------
// Homepage sections
// ---------------------------------------------------------------

export async function getPublishedHomepageSections(): Promise<HomepageSectionRow[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('homepage_sections')
    .select('*')
    .eq('published', true)
    .order('position', { ascending: true })

  return (data ?? []) as HomepageSectionRow[]
}

// ---------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------

export async function getFaqs(options?: {
  category?: string
  productId?: string
  limit?: number
}): Promise<FaqRow[]> {
  const supabase = await createClient()

  let query = supabase
    .from('faqs')
    .select('*')
    .eq('published', true)
    .order('position', { ascending: true })

  if (options?.category) query = query.eq('category', options.category)
  if (options?.productId) query = query.eq('related_product_id', options.productId)
  if (options?.limit) query = query.limit(options.limit)

  const { data } = await query
  return (data ?? []) as FaqRow[]
}

export async function getFaqCategories(): Promise<string[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('faqs')
    .select('category')
    .eq('published', true)

  const unique = [...new Set((data ?? []).map(f => f.category))]
  return unique
}

// ---------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------

export async function getTestimonials(options?: {
  limit?: number
  productId?: string
}): Promise<TestimonialRow[]> {
  const supabase = await createClient()

  let query = supabase
    .from('testimonials')
    .select('*')
    .eq('published', true)
    .order('position', { ascending: true })

  if (options?.productId) query = query.eq('related_product_id', options.productId)
  if (options?.limit) query = query.limit(options.limit)

  const { data } = await query
  return (data ?? []) as TestimonialRow[]
}

// ---------------------------------------------------------------
// Promo banners
// ---------------------------------------------------------------

export async function getActivePromoBanners(
  placement?: PromoBannerRow['placement'],
): Promise<PromoBannerRow[]> {
  const supabase = await createClient()

  let query = supabase
    .from('promo_banners')
    .select('*')
    .eq('active', true)
    .order('priority', { ascending: false })

  if (placement) query = query.eq('placement', placement)

  const { data } = await query
  return (data ?? []) as PromoBannerRow[]
}

// ---------------------------------------------------------------
// Legal pages
// ---------------------------------------------------------------

export async function getLegalPageBySlug(slug: string): Promise<LegalPageRow | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('legal_pages')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  return (data as LegalPageRow | null)
}

export async function getAllLegalPages(): Promise<LegalPageRow[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('legal_pages')
    .select('id, slug, title, effective_date, published')
    .eq('published', true)
    .order('title', { ascending: true })

  return (data ?? []) as LegalPageRow[]
}

// ---------------------------------------------------------------
// Static pages
// ---------------------------------------------------------------

export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  return (data as PageRow | null)
}
