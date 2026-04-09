import Link from 'next/link'
import { listTransfers, deleteTransfer } from './actions'

export const dynamic = 'force-dynamic'

export default async function TransfersList({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams
  const q = resolvedSearchParams.q || ''
  const rows = await listTransfers(q)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Airport Transfers</h1>
          <p className="text-ink-secondary">Manage transfer products and zone pricing.</p>
        </div>
        <Link href="/admin/transfers/new" className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-800">New Transfer</Link>
      </div>

      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search by title" className="w-72 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
        <button className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Search</button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">From Price</th>
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
                  <Link href={`/admin/transfers/${r.id}`} className="text-brand-700 hover:underline">Edit</Link>
                  <form action={deleteTransferAction} className="ml-3 inline">
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

async function deleteTransferAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  await deleteTransfer(id)
}

