"use server"

import { getResend, EMAIL_FROM, EMAIL_REPLY_TO } from '@/lib/resend/resend'
import { createAdminClient } from '@/lib/supabase/admin'

export async function resendBookingEmail(bookingId: string) {
  const supabase = createAdminClient()
  const { data: booking } = await supabase
    .from('bookings')
    .select('ref, total_amount, currency, customers(email, first_name, last_name)')
    .eq('id', bookingId)
    .single()
  if (!booking?.customers?.[0]?.email) return
  await getResend().emails.send({
    from: EMAIL_FROM,
    to: booking.customers[0].email,
    replyTo: EMAIL_REPLY_TO,
    subject: `Your Tropigo booking ${booking.ref}`,
    html: `<p>Here is your booking confirmation.</p><p>Reference: <strong>${booking.ref}</strong><br/>Total: <strong>${booking.currency} ${Number(booking.total_amount).toFixed(2)}</strong></p>`
  })
}

