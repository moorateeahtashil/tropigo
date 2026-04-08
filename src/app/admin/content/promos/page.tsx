import Link from 'next/link'
import { listPromos, deletePromo } from './actions'

export const dynamic = 'force-dynamic'

export default async function PromosList() {
  const rows = await listPromos()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Promo Banners</h1>
          <p className="text-ink-secondary">Sitewide and page-specific promos</p>
        </div>
        <Link href="/admin/content/promos/new" className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-800">New Promo</Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Placement</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2">Window</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r:any)=> (
              <tr key={r.id} className="border-t border-sand-100">
                <td className="px-4 py-2 font-medium text-ink">{r.title}</td>
                <td className="px-4 py-2 text-ink-secondary">{r.placement}</td>
                <td className="px-4 py-2">{r.active ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">{(r.start_at||'—')} → {(r.end_at||'—')}</td>
                <td className="px-4 py-2">{r.priority}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/content/promos/${r.id}`} className="text-brand-700 hover:underline">Edit</Link>
                  <form action={deleteAction} className="ml-3 inline">
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-red-600 hover:underline">Delete</button>
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

async function deleteAction(formData: FormData) {
  'use server'
  await deletePromo(String(formData.get('id')))
}

