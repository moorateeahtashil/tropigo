import { NextRequest, NextResponse } from 'next/server'
import { capturePaypalOrder, recordPaypalCapture } from '@/features/payment/paypal'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  try {
    const order = await capturePaypalOrder(token)
    await recordPaypalCapture(order)
    const supabase = createAdminClient()
    // Lookup booking by order reference
    const pu = order.purchase_units?.[0]
    const bookingId = pu?.custom_id || pu?.reference_id
    const { data: booking } = await supabase.from('bookings').select('ref').eq('id', bookingId).single()
    const ref = booking?.ref || '—'
    return NextResponse.redirect(new URL(`/checkout/success?ref=${encodeURIComponent(ref)}`, request.url))
  } catch {
    return NextResponse.redirect(new URL(`/checkout/failed`, request.url))
  }
}

