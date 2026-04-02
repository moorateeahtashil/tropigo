import { getServerSupabase } from '@/supabase/server'

export type HeroData = {
  eyebrow?: string
  title?: string
  body?: string
  background_image_url?: string
  primary_cta_label?: string
  primary_cta_url?: string
  secondary_cta_label?: string
  secondary_cta_url?: string
}

export async function fetchHomepageData() {
  const supabase = getServerSupabase()

  const [sectionsRes, badgesRes, toursRes, destRes, catsRes, testiRes, promosRes] = await Promise.all([
    supabase
      .from('homepage_sections')
      .select('id, section_type, title, subtitle, data, position')
      .order('position', { ascending: true }),
    supabase
      .from('badges')
      .select('id, label, description, icon_url, context, position')
      .order('position', { ascending: true }),
    supabase
      .from('tours')
      .select('id, name, slug, summary, price_from, currency, hero_image_url, featured, position')
      .eq('featured', true)
      .order('position', { ascending: true })
      .limit(8),
    supabase
      .from('destinations')
      .select('id, name, slug, summary, hero_image_url, featured, position')
      .eq('featured', true)
      .order('position', { ascending: true })
      .limit(8),
    supabase
      .from('activity_categories')
      .select('id, name, slug, image_url, position')
      .order('position', { ascending: true })
      .limit(8),
    supabase
      .from('testimonials')
      .select('id, author_name, author_location, quote, rating, position')
      .order('position', { ascending: true })
      .limit(6),
    supabase
      .from('promo_banners')
      .select('id, title, body, cta_label, cta_url, placement, priority')
      .order('priority', { ascending: true }),
  ])

  const sections = sectionsRes.data || []

  const hero = sections.find((s) => s.section_type === 'hero')?.data as HeroData | undefined
  const stats = sections.find((s) => s.section_type === 'custom' && s.title === 'stats')?.data as any[] | undefined
  const partners = sections.find((s) => s.section_type === 'custom' && s.title === 'partners')?.data as any[] | undefined
  const newsletter = sections.find((s) => s.section_type === 'custom' && s.title === 'newsletter')?.data as any | undefined

  const trustBadges = (badgesRes.data || []).filter((b) => b)
  const featuredTours = toursRes.data || []
  const featuredDestinations = destRes.data || []
  const categories = catsRes.data || []
  const testimonials = testiRes.data || []
  const promos = promosRes.data || []

  return {
    sections,
    hero,
    stats,
    partners,
    newsletter,
    trustBadges,
    featuredTours,
    featuredDestinations,
    categories,
    testimonials,
    promos,
  }
}

