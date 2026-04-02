import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/supabase/server'

export async function GET() {
  const supabase = getServerSupabase()
  const [tours, posts, legals, statics] = await Promise.all([
    supabase.from('tours').select('slug').eq('published', true),
    supabase.from('blog_posts').select('slug').eq('published', true),
    supabase.from('legal_pages').select('slug').eq('published', true),
    supabase.from('static_pages').select('slug').eq('published', true),
  ])
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'
  const urls: string[] = [
    '',
    '/tours',
    '/destinations',
    '/activities',
    '/blog',
    '/about',
    '/contact',
    '/faq',
    ...(tours.data || []).map((t:any)=>`/tours/${t.slug}`),
    ...(posts.data || []).map((p:any)=>`/blog/${p.slug}`),
    ...(legals.data || []).map((l:any)=>`/legal/${l.slug}`),
    ...(statics.data || []).map((s:any)=>`/${s.slug}`),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`<url><loc>${base}${u}</loc></url>`).join('\n')}\n</urlset>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}

