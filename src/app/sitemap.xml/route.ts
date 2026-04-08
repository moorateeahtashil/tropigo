import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = createAdminClient()
  const [products, destinations, legals] = await Promise.all([
    supabase.from('products').select('slug, product_type').eq('status','published'),
    supabase.from('destinations').select('slug').eq('published', true),
    supabase.from('legal_pages').select('slug').eq('published', true),
  ])

  const urls: string[] = []
  for (const p of products.data || []) {
    const base = p.product_type === 'activity' ? 'activities' : p.product_type === 'airport_transfer' ? 'transfers' : 'packages'
    urls.push(`https://tropigo.mu/${base}/${p.slug}`)
  }
  for (const d of destinations.data || []) urls.push(`https://tropigo.mu/destinations/${d.slug}`)
  for (const l of legals.data || []) urls.push(`https://tropigo.mu/legal/${l.slug}`)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `<url><loc>${u}</loc></url>`).join('\n') +
    `\n</urlset>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}

