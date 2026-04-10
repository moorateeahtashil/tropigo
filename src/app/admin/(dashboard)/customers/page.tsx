import { listCustomers } from './actions'

export const dynamic = 'force-dynamic'

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams
  const rows = await listCustomers(resolvedSearchParams.q)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Customers</h1>
        <form>
          <input name="q" placeholder="Search email" defaultValue={resolvedSearchParams.q || ''} className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          <button className="ml-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Search</button>
        </form>
      </div>
      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Bookings</th>
              <th className="px-4 py-2">Account</th>
              <th className="px-4 py-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c:any)=> {
              const bookingCount = c.bookings?.[0]?.count ?? 0
              return (
                <tr key={c.id} className="border-t border-sand-100">
                  <td className="px-4 py-2 font-medium text-ink">{c.first_name} {c.last_name}</td>
                  <td className="px-4 py-2 text-ink-secondary">{c.email}</td>
                  <td className="px-4 py-2 text-ink-secondary">{c.phone || '—'}</td>
                  <td className="px-4 py-2 text-ink-secondary">{c.country || '—'}</td>
                  <td className="px-4 py-2">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                      {bookingCount}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {c.supabase_user_id
                      ? <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Registered</span>
                      : <span className="rounded-full bg-sand-100 px-2 py-0.5 text-xs font-medium text-ink-muted">Guest</span>}
                  </td>
                  <td className="px-4 py-2 text-ink-secondary">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

