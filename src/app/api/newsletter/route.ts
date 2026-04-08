import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as {
    email?: string
    first_name?: string
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Check for duplicate
  const { data: existing } = await supabase
    .from('newsletter_subscriptions')
    .select('id')
    .eq('email', body.email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 })
  }

  const { error } = await supabase.from('newsletter_subscriptions').insert({
    email: body.email,
    first_name: body.first_name || null,
    status: 'active',
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
