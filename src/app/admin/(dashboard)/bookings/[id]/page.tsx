import { getBooking } from '../actions'
import { resendBookingEmail } from '../resend'

export default async function BookingDetail({ params }: { params: { id: string } }) {
  const b = await getBooking(params.id)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Booking {b.ref}</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-ink-muted">Status: {b.status}</div>
          <form action={resendAction}>
            <input type="hidden" name="id" value={b.id} />
            <button className="rounded-lg border border-sand-300 px-3 py-2 text-sm">Resend Confirmation</button>
          </form>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-sand-200 bg-white p-4 shadow-card lg:col-span-2">
          <h2 className="mb-2 font-semibold">Items</h2>
          <ul className="divide-y divide-sand-200">
            {(b.booking_items || []).map((i:any)=> (
              <li key={i.id} className="py-2 text-sm">
                <div className="font-medium text-ink">{i.product_title}</div>
                <div className="text-ink-secondary">Qty {i.quantity} • {i.currency} {Number(i.total_price).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-sand-200 bg-white p-4 shadow-card">
          <h2 className="mb-2 font-semibold">Summary</h2>
          <div className="text-sm text-ink">Total: {b.currency} {Number(b.total_amount).toFixed(2)}</div>
          <h3 className="mt-4 font-medium">Customer</h3>
          <div className="text-sm text-ink-secondary">{b.customers?.first_name} {b.customers?.last_name}</div>
          <div className="text-sm text-ink-secondary">{b.customers?.email}</div>
          <h3 className="mt-4 font-medium">Payments</h3>
          <ul className="text-sm">
            {(b.payments || []).map((p:any)=> (
              <li key={p.id}>{p.provider} • {p.status} • {p.currency} {Number(p.amount).toFixed(2)}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

async function resendAction(formData: FormData) {
  'use server'
  await resendBookingEmail(String(formData.get('id')))
}
