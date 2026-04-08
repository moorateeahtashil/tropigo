import { NextRequest, NextResponse } from 'next/server'
import { CheckoutSchema, createPendingBooking } from '@/features/booking/checkout'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const json = await request.json()
  const parse = CheckoutSchema.safeParse(json)
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 })
  }
  const booking = await createPendingBooking(parse.data)
  return NextResponse.json({ booking_id: booking.id, booking_ref: booking.ref })
}

