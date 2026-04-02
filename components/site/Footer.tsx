import FooterColumns from '@/components/ui/FooterColumns'
import { fetchFooterGroups, fetchLegalLinks, fetchSiteSettings } from '@/lib/server/settings'
import Badge from '@/components/ui/Badge'
import { getServerSupabase } from '@/supabase/server'

export default async function Footer() {
  const [groups, legal, settings] = await Promise.all([
    fetchFooterGroups(),
    fetchLegalLinks(),
    fetchSiteSettings(),
  ])
  const footerGroups = groups.map((g) => ({ title: g.title, items: (g.items as any[]) || [] }))
  if (legal.length) footerGroups.push({ title: 'Legal', items: legal })
  const brand = settings?.brand_name || 'Tropigo'
  const supabase = getServerSupabase()
  const { data: siteBadges } = await supabase.from('badges').select('label').eq('published', true).eq('context', 'sitewide').order('position', { ascending: true })
  return (
    <footer className="bg-primary text-white mt-16">
      {siteBadges && siteBadges.length > 0 && (
        <div className="px-6 md:px-12 pt-12">
          <div className="flex flex-wrap items-center gap-3 opacity-90">
            {siteBadges.map((b:any, i:number)=> <Badge key={i} tone="secondary" className="!bg-white/10 !text-white">{b.label}</Badge>)}
          </div>
        </div>
      )}
      <div className="px-6 md:px-12 py-16">
        <FooterColumns groups={footerGroups} />
      </div>
      <div className="px-6 md:px-12 pb-10 text-center text-[10px] text-white/60 uppercase tracking-widest">
        © {new Date().getFullYear()} {brand}. Curated Tropical Excellence.
      </div>
    </footer>
  )
}
