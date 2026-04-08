import Link from 'next/link'
import { listLegalPages, deleteLegal } from './actions'

export const dynamic = 'force-dynamic'

export default async function LegalList() {
  const rows = await listLegalPages()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Legal Pages</h1>
          <p className="text-ink-secondary">Terms, Privacy, etc.</p>
        </div>
        <Link href="/admin/content/legal/new" className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-800">New Legal Page</Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Published</th>
              <th className="px-4 py-2">Version</th>
              <th className="px-4 py-2">Effective</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r:any)=> (
              <tr key={r.id} className="border-t border-sand-100">
                <td className="px-4 py-2 font-medium text-ink">{r.title}</td>
                <td className="px-4 py-2 text-ink-secondary">{r.slug}</td>
                <td className="px-4 py-2">{r.published ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">{r.version || '—'}</td>
                <td className="px-4 py-2">{r.effective_date || '—'}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/content/legal/${r.id}`} className="text-brand-700 hover:underline">Edit</Link>
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
  await deleteLegal(String(formData.get('id')))
}

