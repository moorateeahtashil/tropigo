import Link from 'next/link'
import { listBookings } from './actions'

export const dynamic = 'force-dynamic'

export default async function BookingsPage() {
  const rows = await listBookings()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Bookings</h1>
      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Ref</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b:any)=> (
              <tr key={b.id} className="border-t border-sand-100">
                <td className="px-4 py-2 font-mono text-sm text-ink">{b.ref}</td>
                <td className="px-4 py-2 text-ink-secondary">{b.customers?.first_name} {b.customers?.last_name} • {b.customers?.email}</td>
                <td className="px-4 py-2">{b.status}</td>
                <td className="px-4 py-2">{b.currency} {Number(b.total_amount).toFixed(2)}</td>
                <td className="px-4 py-2">{new Date(b.created_at).toLocaleString()}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/bookings/${b.id}`} className="text-brand-700 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

