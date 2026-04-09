import Link from 'next/link'
import { listDestinations, deleteDestination } from './actions'

export const dynamic = 'force-dynamic'

export default async function DestinationsList({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams
  const q = resolvedSearchParams.q || ''
  const rows = await listDestinations(q)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Destinations</h1>
          <p className="text-ink-secondary">Manage destination pages and featured regions.</p>
        </div>
        <Link href="/admin/destinations/new" className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-800">New Destination</Link>
      </div>

      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search by name" className="w-72 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
        <button className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Search</button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Region</th>
              <th className="px-4 py-2">Featured</th>
              <th className="px-4 py-2">Published</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t border-sand-100">
                <td className="px-4 py-2 font-medium text-ink">{r.name}</td>
                <td className="px-4 py-2 text-ink-secondary">{r.slug}</td>
                <td className="px-4 py-2 text-ink-secondary">{r.region || '—'}</td>
                <td className="px-4 py-2">{r.featured ? <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs text-gold-700">Yes</span> : <span className="text-ink-muted">No</span>}</td>
                <td className="px-4 py-2">{r.published ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Published</span> : <span className="rounded-full bg-sand-100 px-2 py-0.5 text-xs text-ink-muted">Draft</span>}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/destinations/${r.id}`} className="text-brand-700 hover:underline">Edit</Link>
                  <form action={deleteDestinationAction} className="ml-3 inline">
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-red-600 hover:underline" aria-label={`Delete ${r.name}`}>Delete</button>
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

async function deleteDestinationAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  await deleteDestination(id)
}

