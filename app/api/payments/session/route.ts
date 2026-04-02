import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/supabase/server'

function randomToken(len = 24) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export async function POST(req: NextRequest) {
  const { bookingId } = await req.json().catch(() => ({}))
  if (!bookingId) return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
  const supabase = getServerSupabase()
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('id, booking_ref, status, payment_status, payment_meta')
    .eq('id', bookingId)
    .maybeSingle()
  if (error || !booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  if (booking.payment_status === 'paid') return NextResponse.json({ error: 'Already paid' }, { status: 400 })
  // Create a mock session token and persist
  const token = randomToken()
  const payment_meta = { ...(booking.payment_meta || {}), mock_session_token: token }
  await supabase.from('bookings').update({ payment_provider: 'mock', payment_meta }).eq('id', bookingId)
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/pay/mock?bookingId=${bookingId}&ref=${encodeURIComponent(booking.booking_ref)}&token=${token}`
  return NextResponse.json({ provider: 'mock', url })
}

