import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'
import { getServiceSupabase } from '@/lib/server/supabaseAdmin'

export default async function Success({ searchParams }: { searchParams: { ref?: string } }) {
  const ref = searchParams.ref || '—'
  let booking: any = null
  let item: any = null
  const admin = getServiceSupabase()
  if (admin && ref && ref !== '—') {
    const { data: b } = await admin.from('bookings').select('id, booking_ref, currency, total_amount').eq('booking_ref', ref).maybeSingle()
    if (b) {
      booking = b
      const { data: it } = await admin.from('booking_items').select('title, starts_at, quantity, subtotal').eq('booking_id', b.id).maybeSingle()
      item = it
    }
  }
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-2xl mx-auto py-16">
            <h1 className="font-headline text-3xl text-primary mb-2 text-center">Payment Successful</h1>
            <p className="text-on-surface-variant text-center mb-6">Your booking reference is <span className="font-semibold">{ref}</span>.</p>
            {booking && item ? (
              <div className="bg-white rounded-2xl border border-outline-variant/10 p-6 space-y-2">
                <div className="flex items-center justify-between"><span className="text-outline">Tour</span><span className="font-semibold text-primary">{item.title}</span></div>
                <div className="flex items-center justify-between"><span className="text-outline">Date</span><span>{item.starts_at ? new Date(item.starts_at).toLocaleString() : ''}</span></div>
                <div className="flex items-center justify-between"><span className="text-outline">Guests</span><span>{item.quantity}</span></div>
                <div className="flex items-center justify-between text-lg font-bold"><span>Total Paid</span><span>{booking.currency || 'MUR'} {Number(booking.total_amount || 0).toLocaleString()}</span></div>
                <div className="pt-4 text-sm text-on-surface-variant">We’ve sent a confirmation email with your booking details. For support, reply to that email or visit our contact page.</div>
              </div>
            ) : (
              <div className="text-center text-on-surface-variant">We’ve received your payment. A confirmation email will follow.</div>
            )}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
