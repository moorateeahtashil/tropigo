import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ref = searchParams.get('ref')

  if (!ref) {
    return NextResponse.json({ error: 'Missing ref parameter' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('ref', ref)
    .single()

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Fetch booking items
  const { data: items } = await supabase
    .from('booking_items')
    .select('product_title, product_type, booking_date, quantity')
    .eq('booking_id', booking.id)

  return NextResponse.json({
    booking: {
      ...booking,
      items: items || [],
    },
  })
}
