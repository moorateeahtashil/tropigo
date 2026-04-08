import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as {
    name?: string
    email?: string
    phone?: string
    subject?: string
    message?: string
    related_product_id?: string
  }

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('enquiries').insert({
    name: body.name,
    email: body.email,
    phone: body.phone ?? null,
    subject: body.subject ?? null,
    message: body.message,
    related_product_id: body.related_product_id ?? null,
    status: 'new',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

