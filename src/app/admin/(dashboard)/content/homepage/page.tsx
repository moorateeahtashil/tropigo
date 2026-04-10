import Link from 'next/link'
import { listSections, deleteSection, reorderSections } from './actions'

export const dynamic = 'force-dynamic'

export default async function HomepageSections() {
  const rows = await listSections()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Homepage Sections</h1>
          <p className="text-ink-secondary">Manage homepage layout blocks</p>
        </div>
        <Link href="/admin/content/homepage/new" className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-800">New Section</Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm" data-sortable>
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Published</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="rows">
            {rows.map((r:any)=> (
              <tr key={r.id} data-id={r.id} className="border-t border-sand-100">
                <td className="px-4 py-2">{r.section_type}</td>
                <td className="px-4 py-2">{r.title || '—'}</td>
                <td className="px-4 py-2">{r.position}</td>
                <td className="px-4 py-2">{r.published ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/content/homepage/${r.id}`} className="text-brand-700 hover:underline">Edit</Link>
                  <form action={deleteAction} className="ml-3 inline">
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-red-600 hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form action={reorderAction} className="p-3">
          <input type="hidden" id="ordered_ids" name="ordered_ids" />
          <button id="save-order" disabled className="rounded-lg border border-sand-300 px-3 py-2 text-sm disabled:opacity-50">Save order</button>
        </form>
      </div>
    </div>
  )
}

async function deleteAction(formData: FormData) {
  'use server'
  await deleteSection(String(formData.get('id')))
}

async function reorderAction(formData: FormData) {
  'use server'
  const ids = String(formData.get('ordered_ids') || '').split(',').filter(Boolean)
  if (ids.length) await reorderSections(ids)
}
