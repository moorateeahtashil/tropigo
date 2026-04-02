import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { tourId, slotId, quantity, pickupId, couponCode, customerEmail, customerName, customerPhone, pickupLocation } = body || {}
  if (!tourId || !slotId || !quantity || !customerEmail || !customerName) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  const supabase = getServerSupabase()
  const idempotencyKey = `${tourId}:${slotId}:${customerEmail}:${quantity}`
  const { data, error } = await supabase.rpc('book_reserve', {
    p_tour_id: tourId,
    p_slot_id: slotId,
    p_quantity: quantity,
    p_pickup_id: pickupId || null,
    p_coupon_code: couponCode || null,
    p_customer_email: customerEmail,
    p_customer_name: customerName,
    p_customer_phone: customerPhone || null,
    p_idempotency_key: idempotencyKey,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Best-effort: attach pickupLocation to booking_items metadata
  if (data?.booking_id && pickupLocation) {
    await supabase
      .from('booking_items')
      .update({ metadata: { pickup_location: pickupLocation } })
      .eq('booking_id', data.booking_id)
  }
  return NextResponse.json({ result: data })
}

