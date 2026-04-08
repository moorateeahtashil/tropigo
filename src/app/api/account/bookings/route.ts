import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Find customer by email
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', email)
    .single()

  if (!customer) {
    return NextResponse.json({ bookings: [] })
  }

  // Fetch bookings for this customer
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, ref, status, total_amount, currency, created_at')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Fetch items for each booking
  const bookingsWithItems = await Promise.all(
    (bookings || []).map(async (booking) => {
      const { data: items } = await supabase
        .from('booking_items')
        .select('product_title, product_type, booking_date, quantity')
        .eq('booking_id', booking.id)

      return {
        ...booking,
        items: items || [],
      }
    }),
  )

  return NextResponse.json({ bookings: bookingsWithItems })
}
