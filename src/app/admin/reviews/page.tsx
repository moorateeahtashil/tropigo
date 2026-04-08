import { listReviews, setReviewStatus } from './actions'

export const dynamic = 'force-dynamic'

export default async function ReviewsPage({ searchParams }: { searchParams: { status?: string } }) {
  const rows = await listReviews((searchParams.status as any) || undefined)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Reviews</h1>
        <form>
          <select name="status" defaultValue={searchParams.status || ''} className="rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="ml-2 rounded-lg border border-sand-300 px-3 py-2 text-sm">Filter</button>
        </form>
      </div>
      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Rating</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r:any)=> (
              <tr key={r.id} className="border-t border-sand-100">
                <td className="px-4 py-2">
                  <div className="font-medium text-ink">{r.products?.title}</div>
                  <div className="text-xs text-ink-muted">{r.products?.product_type} • {r.products?.slug}</div>
                </td>
                <td className="px-4 py-2">{r.author_name}</td>
                <td className="px-4 py-2">{r.rating}/5</td>
                <td className="px-4 py-2">{r.status}</td>
                <td className="px-4 py-2 text-right">
                  <form action={approveAction} className="inline">
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-emerald-700 hover:underline">Approve</button>
                  </form>
                  <form action={rejectAction} className="inline ml-3">
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-red-600 hover:underline">Reject</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

async function approveAction(formData: FormData) {
  'use server'
  await setReviewStatus(String(formData.get('id')), 'approved')
}
async function rejectAction(formData: FormData) {
  'use server'
  await setReviewStatus(String(formData.get('id')), 'rejected')
}

