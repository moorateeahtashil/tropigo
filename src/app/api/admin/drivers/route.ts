import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (id) {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('first_name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  const { data, error } = await supabase
    .from('drivers')
    .insert({
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone || null,
      email: body.email || null,
      vehicle_type: body.vehicle_type || 'sedan',
      license_plate: body.license_plate || null,
      is_active: body.is_active ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  const { error } = await supabase
    .from('drivers')
    .update({
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone || null,
      email: body.email || null,
      vehicle_type: body.vehicle_type || 'sedan',
      license_plate: body.license_plate || null,
      is_active: body.is_active,
    })
    .eq('id', body.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase.from('drivers').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
