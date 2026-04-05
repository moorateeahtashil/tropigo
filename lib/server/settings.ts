import { getServerSupabase } from '@/supabase/server'

export async function fetchSiteSettings() {
  const supabase = getServerSupabase()
  const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
  return data || null
}

export async function fetchNavigation(area: string = 'main') {
  const supabase = getServerSupabase()
  const { data } = await supabase
    .from('navigation_items')
    .select('id,label,href,external,position,visible,parent_id')
    .eq('area', area)
    .eq('visible', true)
    .order('position', { ascending: true })
  return data || []
}

export async function fetchFooterGroups() {
  const supabase = getServerSupabase()
  const { data } = await supabase
    .from('footer_groups')
    .select('key,title,items,position,published')
    .eq('published', true)
    .order('position', { ascending: true })
  return data || []
}

export async function fetchLegalLinks() {
  const supabase = getServerSupabase()
  const { data } = await supabase
    .from('legal_pages')
    .select('title,slug,published,position')
    .eq('published', true)
    .order('position', { ascending: true })
  return (data || []).map((p) => ({ label: p.title, href: `/legal/${p.slug}` }))
}

export async function fetchSiteBadges() {
  const supabase = getServerSupabase()
  const { data } = await supabase
    .from('badges')
    .select('label')
    .eq('published', true)
    .eq('context', 'sitewide')
    .order('position', { ascending: true })
  return data || []
}

