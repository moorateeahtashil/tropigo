import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { createAdminClient } from '@/lib/supabase/admin'
import { cn } from '@/lib/utils/cn'
import { Car, Package, Mail, Phone, Download } from 'lucide-react'

export const revalidate = 0

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-gray-700', bg: 'bg-gray-100' },
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  processing: { label: 'Processing', color: 'text-blue-700', bg: 'bg-blue-100' },
  confirmed: { label: 'Confirmed', color: 'text-green-700', bg: 'bg-green-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100' },
  failed: { label: 'Failed', color: 'text-red-700', bg: 'bg-red-100' },
  refunded: { label: 'Refunded', color: 'text-gray-700', bg: 'bg-gray-100' },
}

const productIcons: Record<string, React.ReactNode> = {
  activity: <Package className="h-5 w-5" />,
  airport_transfer: <Car className="h-5 w-5" />,
  package: <Package className="h-5 w-5" />,
}

export default async function BookingDetailPage({ params }: { params: { ref: string } }) {
  const supabase = createAdminClient()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('ref', params.ref)
    .single()

  if (!booking) return notFound()

  // Fetch booking items
  const { data: items } = await supabase
    .from('booking_items')
    .select('*')
    .eq('booking_id', booking.id)

  // Fetch travellers
  const { data: travellers } = await supabase
    .from('booking_travellers')
    .select('*')
    .eq('booking_id', booking.id)

  // Fetch payments
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('booking_id', booking.id)
    .order('created_at', { ascending: false })

  const config = statusConfig[booking.status] || statusConfig.draft
  const leadTraveller = travellers?.find((t: any) => t.is_lead_traveller)

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        {/* Status banner */}
        <div
          className={cn(
            'rounded-2xl border p-6',
            config.bg,
            booking.status === 'confirmed' ? 'border-green-200' : 'border-sand-200',
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="heading-lg text-ink">Booking Details</h1>
              <p className="mt-1 text-ink-secondary">
                Reference: <span className="font-mono font-semibold">{booking.ref}</span>
              </p>
            </div>
            <span
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium capitalize',
                config.color,
                config.bg,
              )}
            >
              {config.label}
            </span>
          </div>

          {booking.status === 'confirmed' && (
            <p className="mt-4 text-sm text-green-700">
              Your booking is confirmed! A confirmation email has been sent to{' '}
              {leadTraveller?.email || booking.customer_email || 'your email'}.
            </p>
          )}

          {booking.status === 'pending' && (
            <p className="mt-4 text-sm text-yellow-700">
              Your booking is being processed. You will receive a confirmation email once payment is verified.
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main content */}
          <div className="space-y-6">
            {/* Booking items */}
            <section className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-ink">Booking Items</h2>
              <ul className="mt-4 space-y-4">
                {items?.map((item: any) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-sand-100 bg-sand-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                        {productIcons[item.product_type] || <Package className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-ink">{item.product_title}</h3>
                        <div className="mt-1 space-y-0.5 text-sm text-ink-secondary">
                          <span className="capitalize">{item.product_type.replace('_', ' ')}</span>
                          {item.booking_date && (
                            <>
                              {' '}
                              • <span>{item.booking_date}</span>
                            </>
                          )}
                          {item.booking_time && <span> at {item.booking_time}</span>}
                          {' '}• <span>Qty: {item.quantity}</span>
                        </div>

                        {/* Transfer details */}
                        {item.snapshot?.transfer_details && (
                          <div className="mt-2 rounded-lg bg-white p-3 text-xs text-ink-secondary">
                            {item.snapshot.transfer_details.pickup && (
                              <p>Pickup: {item.snapshot.transfer_details.pickup}</p>
                            )}
                            {item.snapshot.transfer_details.dropoff && (
                              <p>Dropoff: {item.snapshot.transfer_details.dropoff}</p>
                            )}
                            {item.snapshot.transfer_details.pickup_datetime && (
                              <p>
                                Date:{' '}
                                {new Date(
                                  item.snapshot.transfer_details.pickup_datetime,
                                ).toLocaleString()}
                              </p>
                            )}
                            {item.snapshot.transfer_details.passenger_count && (
                              <p>Passengers: {item.snapshot.transfer_details.passenger_count}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-ink">
                          {item.currency} {item.total_price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Traveller details */}
            {travellers && travellers.length > 0 && (
              <section className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
                <h2 className="text-lg font-semibold text-ink">Traveller Details</h2>
                <ul className="mt-4 space-y-3">
                  {travellers.map((traveller: any) => (
                    <li
                      key={traveller.id}
                      className="rounded-xl border border-sand-100 bg-sand-50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-ink">
                            {traveller.first_name} {traveller.last_name}
                            {traveller.is_lead_traveller && (
                              <span className="ml-2 rounded-md bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                                Lead
                              </span>
                            )}
                          </div>
                          <div className="mt-1 space-y-0.5 text-sm text-ink-secondary">
                            {traveller.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                {traveller.email}
                              </div>
                            )}
                            {traveller.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                {traveller.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Payment history */}
            {payments && payments.length > 0 && (
              <section className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
                <h2 className="text-lg font-semibold text-ink">Payment History</h2>
                <ul className="mt-4 space-y-3">
                  {payments.map((payment: any) => (
                    <li
                      key={payment.id}
                      className="flex items-center justify-between rounded-xl border border-sand-100 bg-sand-50 p-4"
                    >
                      <div>
                        <div className="font-medium text-ink capitalize">
                          {payment.provider} payment
                        </div>
                        <div className="text-sm text-ink-secondary">
                          {new Date(payment.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-ink">
                          {payment.currency} {payment.amount.toFixed(2)}
                        </div>
                        <div
                          className={cn(
                            'text-xs capitalize',
                            payment.status === 'succeeded'
                              ? 'text-green-600'
                              : payment.status === 'failed'
                              ? 'text-red-600'
                              : 'text-yellow-600',
                          )}
                        >
                          {payment.status}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Summary */}
            <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
              <h3 className="text-sm font-medium text-ink-muted">Booking Total</h3>
              <div className="mt-2 text-2xl font-bold text-ink">
                {booking.currency} {booking.total_amount.toFixed(2)}
              </div>
              {booking.special_requirements && (
                <div className="mt-3 border-t border-sand-100 pt-3">
                  <div className="text-xs font-medium text-ink-muted">Special Requirements</div>
                  <p className="mt-1 text-sm text-ink-secondary">{booking.special_requirements}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
              <h3 className="mb-3 text-sm font-medium text-ink-muted">Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <a href={`/api/booking/receipt?ref=${booking.ref}`} target="_blank">
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </a>
                </Button>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href="/account">
                    Back to My Account
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full" size="sm" asChild>
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>

            {/* Help */}
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <h3 className="text-sm font-medium text-brand-800">Need Help?</h3>
              <p className="mt-2 text-xs text-brand-700">
                If you have any questions about your booking, our team is here to help.
              </p>
              <div className="mt-3 space-y-2">
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
