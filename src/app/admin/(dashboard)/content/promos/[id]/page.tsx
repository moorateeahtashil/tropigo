import { getPromo, updatePromo } from '../actions'

export default async function EditPromo({ params }: { params: { id: string } }) {
  const row = await getPromo(params.id)
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Edit Promo</h1>
      <form action={saveAction} className="space-y-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <input type="hidden" name="id" defaultValue={row.id} />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Title</span><input name="title" defaultValue={row.title} required className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
          <label className="block text-sm"><span className="mb-1 block">Placement</span>
            <select name="placement" defaultValue={row.placement} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="sitewide_top">sitewide_top</option>
              <option value="homepage_hero">homepage_hero</option>
              <option value="footer">footer</option>
              <option value="inline">inline</option>
            </select>
          </label>
        </div>
        <label className="block text-sm"><span className="mb-1 block">Body</span><textarea name="body" defaultValue={row.body || ''} rows={4} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">CTA Label</span><input name="cta_label" defaultValue={row.cta_label || ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
          <label className="block text-sm"><span className="mb-1 block">CTA URL</span><input name="cta_url" defaultValue={row.cta_url || ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Start At</span><input type="datetime-local" name="start_at" defaultValue={row.start_at || ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
          <label className="block text-sm"><span className="mb-1 block">End At</span><input type="datetime-local" name="end_at" defaultValue={row.end_at || ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Priority</span><input type="number" name="priority" defaultValue={row.priority || 0} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={row.active} className="h-4 w-4 rounded border-gray-300" /> Active</label>
        </div>
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Save</button>
      </form>
    </div>
  )
}

async function saveAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  await updatePromo(id, {
    title: String(formData.get('title')||''),
    placement: String(formData.get('placement')||'sitewide_top'),
    body: String(formData.get('body')||'') || null,
    cta_label: String(formData.get('cta_label')||'') || null,
    cta_url: String(formData.get('cta_url')||'') || null,
    start_at: String(formData.get('start_at')||'') || null,
    end_at: String(formData.get('end_at')||'') || null,
    priority: Number(formData.get('priority')||0),
    active: formData.get('active') === 'on',
  })
}

