import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET — return weekly availability for this driver
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: driverId } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('driver_availability')
    .select('id, day_of_week, start_time, end_time, is_available')
    .eq('driver_id', driverId)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

// POST — upsert a single day slot
// Body: { day_of_week: 0-6, start_time: "HH:MM", end_time: "HH:MM"|null }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: driverId } = await params
  const body = await req.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('driver_availability')
    .insert({
      driver_id: driverId,
      day_of_week: body.day_of_week,
      start_time: body.start_time,
      end_time: body.end_time || null,
      is_available: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PUT — toggle is_available on a slot
// Body: { id: string, is_available: boolean }
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: driverId } = await params
  const body = await req.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('driver_availability')
    .update({ is_available: body.is_available })
    .eq('id', body.id)
    .eq('driver_id', driverId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE — remove a slot by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: driverId } = await params
  const { searchParams } = new URL(req.url)
  const slotId = searchParams.get('id')

  if (!slotId) return NextResponse.json({ error: 'Missing slot id' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('driver_availability')
    .delete()
    .eq('id', slotId)
    .eq('driver_id', driverId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
