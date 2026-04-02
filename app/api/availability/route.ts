import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tourId = searchParams.get('tourId') || ''
  const date = searchParams.get('date') || ''
  if (!tourId || !date) return NextResponse.json({ error: 'Missing tourId/date' }, { status: 400 })
  const supabase = getServerSupabase()
  const start = new Date(date)
  const end = new Date(date)
  end.setDate(end.getDate() + 1)
  const { data, error } = await supabase
    .from('availability_slots')
    .select('id, starts_at, ends_at, capacity, reserved, price, currency')
    .eq('tour_id', tourId)
    .eq('is_active', true)
    .gte('starts_at', start.toISOString())
    .lt('starts_at', end.toISOString())
    .order('starts_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const slots = (data || []).map(s => ({
    id: s.id,
    starts_at: s.starts_at,
    ends_at: s.ends_at,
    capacity_left: Math.max(0, (s.capacity || 0) - (s.reserved || 0)),
    price: s.price,
    currency: s.currency,
  }))
  return NextResponse.json({ slots })
}

