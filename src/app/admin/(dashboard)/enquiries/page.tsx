import { listEnquiries, updateEnquiryStatus } from './actions'

export const dynamic = 'force-dynamic'

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const resolvedSearchParams = await searchParams
  const rows = await listEnquiries(resolvedSearchParams.status)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Enquiries</h1>
        <form>
          <select name="status" defaultValue={resolvedSearchParams.status || ''} className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="">All</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
          <button className="ml-2 rounded-lg border border-sand-300 px-3 py-2 text-sm">Filter</button>
        </form>
      </div>
      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r:any)=> (
              <tr key={r.id} className="border-t border-sand-100">
                <td className="px-4 py-2 font-medium text-ink">{r.name}</td>
                <td className="px-4 py-2 text-ink-secondary">{r.email}</td>
                <td className="px-4 py-2 text-ink-secondary">{r.subject || '—'}</td>
                <td className="px-4 py-2">{r.status}</td>
                <td className="px-4 py-2 text-right">
                  <form action={setStatusAction} className="inline">
                    <input type="hidden" name="id" value={r.id} />
                    <select name="status" defaultValue={r.status} className="rounded-lg border-sand-300 text-xs shadow-sm">
                      <option value="new">new</option>
                      <option value="in_progress">in_progress</option>
                      <option value="resolved">resolved</option>
                      <option value="archived">archived</option>
                    </select>
                    <button className="ml-2 rounded-lg border border-sand-300 px-2 py-1 text-xs">Save</button>
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

async function setStatusAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const status = String(formData.get('status')) as any
  await updateEnquiryStatus(id, status)
}

