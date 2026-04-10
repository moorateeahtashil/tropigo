import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET — fetch current user's customer profile
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data } = await admin
    .from('customers')
    .select('id, first_name, last_name, email, phone, country, created_at')
    .eq('supabase_user_id', user.id)
    .single()

  return NextResponse.json({ profile: data ?? null })
}

// PATCH — update current user's customer profile
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const admin = createAdminClient()

  // Upsert: create customer row if it doesn't exist yet
  const { data, error } = await admin
    .from('customers')
    .upsert(
      {
        supabase_user_id: user.id,
        email: user.email!,
        first_name: body.first_name ?? '',
        last_name: body.last_name ?? '',
        phone: body.phone ?? null,
        country: body.country ?? null,
      },
      { onConflict: 'supabase_user_id' },
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Also update auth metadata so full_name stays in sync
  await supabase.auth.updateUser({
    data: { full_name: `${body.first_name} ${body.last_name}`.trim() },
  })

  return NextResponse.json({ profile: data })
}
