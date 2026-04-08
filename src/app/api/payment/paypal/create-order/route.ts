import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createPaypalOrder, recordPaypalPaymentOnCreate } from '@/features/payment/paypal'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const { booking_id } = await request.json()
  if (!booking_id) return NextResponse.json({ error: 'Missing booking_id' }, { status: 400 })
  const supabase = createAdminClient()
  const { data: booking } = await supabase.from('bookings').select('*').eq('id', booking_id).single()
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  const origin = request.headers.get('origin') || request.nextUrl.origin
  const returnUrl = `${origin}/api/payment/paypal/capture`
  const cancelUrl = `${origin}/checkout/failed?ref=${encodeURIComponent(booking.ref)}`

  const order = await createPaypalOrder({
    bookingId: booking.id,
    bookingRef: booking.ref,
    amount: booking.total_amount,
    currency: booking.currency,
    returnUrl,
    cancelUrl,
  })

  await recordPaypalPaymentOnCreate(booking.id, order.id, booking.total_amount, booking.currency)

  const approvalLink = order.links?.find((l:any)=> l.rel === 'approve')?.href
  if (!approvalLink) return NextResponse.json({ error: 'No approval link' }, { status: 500 })
  return NextResponse.json({ approval_url: approvalLink })
}

