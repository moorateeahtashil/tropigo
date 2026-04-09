import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = createAdminClient()
  const driverId = resolvedParams.id

  const { data, error } = await supabase
    .from('driver_availability')
    .select(`
      *,
      products(title)
    `)
    .eq('driver_id', driverId)
    .order('available_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  // Transform data
  const slots = (data || []).map(slot => ({
    id: slot.id,
    available_date: slot.available_date,
    start_time: slot.start_time,
    end_time: slot.end_time,
    product_id: slot.product_id,
    product_title: slot.products?.title || null,
    is_available: slot.is_available,
  }))

  return NextResponse.json(slots)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = createAdminClient()
  const driverId = resolvedParams.id
  const body = await req.json()

  const { data, error } = await supabase
    .from('driver_availability')
    .insert({
      driver_id: driverId,
      available_date: body.available_date,
      start_time: body.start_time,
      end_time: body.end_time || null,
      product_id: body.product_id || null,
      is_available: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = createAdminClient()
  const driverId = resolvedParams.id
  const { searchParams } = new URL(req.url)
  const slotId = searchParams.get('id')

  if (!slotId) return NextResponse.json({ error: 'Missing slot id' }, { status: 400 })

  const { error } = await supabase
    .from('driver_availability')
    .delete()
    .eq('id', slotId)
    .eq('driver_id', driverId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
