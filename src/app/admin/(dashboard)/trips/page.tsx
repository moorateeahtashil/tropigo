import Link from 'next/link'
import { listTrips, deleteTrip } from './actions'

export const dynamic = 'force-dynamic'

export default async function TripsList({ searchParams }: { searchParams: { q?: string; toast?: string } }) {
  const q = searchParams.q || ''
  const rows = await listTrips(q)
  const toastType = searchParams.toast

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Trips</h1>
          <p className="text-ink-secondary">Manage guided driving tours in the catalog.</p>
        </div>
        <Link href="/admin/trips/new" className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-800">New Trip</Link>
      </div>

      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search by title" className="w-72 rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        <button className="rounded-lg border border-sand-300 px-3 py-2 text-sm">Search</button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Featured</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t border-sand-100">
                <td className="px-4 py-2 font-medium text-ink">{r.title}</td>
                <td className="px-4 py-2 text-ink-secondary">{r.slug}</td>
                <td className="px-4 py-2">{badgeForStatus(r.status)}</td>
                <td className="px-4 py-2 text-ink">{r.base_currency} {r.base_price?.toFixed?.(2) ?? '—'}</td>
                <td className="px-4 py-2">{r.featured ? <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs text-gold-700">Yes</span> : <span className="text-ink-muted">No</span>}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/trips/${r.id}`} className="text-brand-700 hover:underline">Edit</Link>
                  <form action={deleteTripAction} className="ml-3 inline">
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-red-600 hover:underline" aria-label={`Delete ${r.title}`}>Delete</button>
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

function badgeForStatus(status: string) {
  switch (status) {
    case 'published':
      return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Published</span>
    case 'draft':
      return <span className="rounded-full bg-sand-100 px-2 py-0.5 text-xs text-ink-muted">Draft</span>
    case 'archived':
      return <span className="rounded-full bg-ink-faint px-2 py-0.5 text-xs text-ink-muted">Archived</span>
    default:
      return status
  }
}

async function deleteTripAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  await deleteTrip(id)
}
