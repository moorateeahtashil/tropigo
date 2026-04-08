import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const productId = url.searchParams.get('productId')
  if (!productId) return NextResponse.json({ reviews: [] })
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('reviews')
    .select('id, author_name, rating, body, created_at')
    .eq('product_id', productId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  return NextResponse.json({ reviews: data ?? [] })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(()=>null)
  if (!body || !body.product_id || !body.author_name || !body.body || !body.rating) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { error } = await supabase.from('reviews').insert({
    product_id: body.product_id,
    author_name: body.author_name,
    author_email: body.author_email ?? null,
    rating: Math.max(1, Math.min(5, Number(body.rating))),
    title: body.title ?? null,
    body: body.body,
    status: 'pending',
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

