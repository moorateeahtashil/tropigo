import { bookingConfirmationHtml } from '@/templates/email/bookingConfirmation'
import { getServiceSupabase } from '@/lib/server/supabaseAdmin'

export async function sendBookingConfirmation(bookingId: string) {
  const supabase = getServiceSupabase()
  if (!supabase) {
    console.warn('Service key not set; cannot send confirmation email.')
    return { ok: false, reason: 'no_service_key' }
  }
  // Fetch booking and item
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, booking_ref, customer_email, customer_name, currency, total_amount')
    .eq('id', bookingId)
    .maybeSingle()
  if (!booking) return { ok: false, reason: 'not_found' }

  const { data: item } = await supabase
    .from('booking_items')
    .select('title, starts_at, quantity, subtotal')
    .eq('booking_id', bookingId)
    .limit(1)
    .maybeSingle()

  const { data: settings } = await supabase
    .from('site_settings')
    .select('brand_name, contact_email')
    .limit(1)
    .maybeSingle()

  const brand = settings?.brand_name || 'Tropigo'
  const supportEmail = settings?.contact_email || 'support@example.com'

  const html = bookingConfirmationHtml({
    brand,
    bookingRef: booking.booking_ref,
    tourName: item?.title || 'Your Tour',
    date: item?.starts_at ? new Date(item.starts_at as any).toLocaleString() : '',
    quantity: (item?.quantity as any) || 1,
    total: booking.total_amount || 0,
    currency: booking.currency || 'MUR',
    supportEmail,
  })

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || `no-reply@${(process.env.NEXT_PUBLIC_BASE_URL || 'example.com').replace(/^https?:\/\//,'')}`
  const to = booking.customer_email
  const subject = `${brand} Booking Confirmed — ${booking.booking_ref}`

  if (!apiKey) {
    console.log('Email (mock):', { to, subject })
    return { ok: true, mocked: true }
  }

  // Send via Resend API directly to avoid adding deps
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  })
  if (!resp.ok) {
    const txt = await resp.text().catch(()=> '')
    console.error('Resend error', resp.status, txt)
    return { ok: false, status: resp.status }
  }
  return { ok: true }
}

