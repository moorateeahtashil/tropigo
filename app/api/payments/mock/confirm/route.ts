import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const bookingId = searchParams.get('bookingId') || ''
  const token = searchParams.get('token') || ''
  const status = searchParams.get('status') || 'success'
  const supabase = getServerSupabase()

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, booking_ref, payment_meta')
    .eq('id', bookingId)
    .maybeSingle()

  if (!booking || booking.payment_meta?.mock_session_token !== token) {
    return NextResponse.redirect(new URL(`/checkout/failed?ref=${encodeURIComponent(booking?.booking_ref || '—')}`, req.url))
  }

  if (status === 'success') {
    await supabase.rpc('book_mark_paid', { p_booking_id: bookingId, p_provider: 'mock', p_payment_id: `mock_${Date.now()}` })
    // Attempt to send confirmation email (best-effort)
    try {
      const { sendBookingConfirmation } = await import('@/lib/server/email')
      await sendBookingConfirmation(bookingId)
    } catch (e) {
      console.warn('Email send failed', e)
    }
    return NextResponse.redirect(new URL(`/checkout/success?ref=${encodeURIComponent(booking.booking_ref)}`, req.url))
  } else {
    await supabase.rpc('book_mark_failed', { p_booking_id: bookingId, p_provider: 'mock', p_payment_id: `mock_${Date.now()}` })
    return NextResponse.redirect(new URL(`/checkout/failed?ref=${encodeURIComponent(booking.booking_ref)}`, req.url))
  }
}
