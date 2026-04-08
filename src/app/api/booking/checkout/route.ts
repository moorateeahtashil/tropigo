import { NextRequest, NextResponse } from 'next/server'
import { createPendingBooking, CheckoutSchema } from '@/features/booking/checkout'
import { createStripeCheckoutSession } from '@/features/payment/stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const json = await request.json()
  const parse = CheckoutSchema.safeParse(json)
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 })
  }

  // 1) Create pending booking + items + travellers
  const booking = await createPendingBooking(parse.data)

  // 2) Fetch first booking item to name the Stripe line item
  const supabase = createAdminClient()
  const { data: items } = await supabase
    .from('booking_items')
    .select('product_title')
    .eq('booking_id', booking.id)
    .order('created_at', { ascending: true })
    .limit(1)

  const productTitle = items?.[0]?.product_title || 'Tropigo Booking'

  // 3) Create Stripe checkout session
  const origin = request.headers.get('origin') || request.nextUrl.origin
  const successUrl = `${origin}/checkout/success?ref=${encodeURIComponent(booking.ref)}`
  const cancelUrl = `${origin}/checkout/failed?ref=${encodeURIComponent(booking.ref)}`

  const stripeSession = await createStripeCheckoutSession({
    bookingId: booking.id,
    bookingRef: booking.ref,
    amount: booking.total_amount,
    currency: booking.currency,
    customerEmail: parse.data.lead_email,
    productTitle,
    successUrl,
    cancelUrl,
  })

  return NextResponse.json({ url: stripeSession.url, booking_ref: booking.ref })
}

