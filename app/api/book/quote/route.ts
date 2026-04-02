import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { tourId, slotId, quantity, pickupId, couponCode } = body || {}
  if (!tourId || !slotId || !quantity) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  const supabase = getServerSupabase()
  const { data, error } = await supabase.rpc('book_quote', {
    p_tour_id: tourId,
    p_slot_id: slotId,
    p_quantity: quantity,
    p_pickup_id: pickupId || null,
    p_coupon_code: couponCode || null,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ quote: data })
}

