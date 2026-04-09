import { getLegal, updateLegal } from '../actions'

export default async function EditLegal({ params }: { params: { id: string } }) {
  const row = await getLegal(params.id)
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Edit Legal Page</h1>
      <form action={saveAction} className="space-y-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <input type="hidden" name="id" defaultValue={row.id} />
        <label className="block text-sm"><span className="mb-1 block">Title</span><input name="title" defaultValue={row.title} required className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        <label className="block text-sm"><span className="mb-1 block">Slug</span><input name="slug" defaultValue={row.slug} required className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Version</span><input name="version" defaultValue={row.version || ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
          <label className="block text-sm"><span className="mb-1 block">Effective Date</span><input type="date" name="effective_date" defaultValue={row.effective_date || ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        </div>
        <label className="block text-sm"><span className="mb-1 block">Content (Markdown)</span><textarea name="content" defaultValue={row.content || ''} rows={10} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={row.published} className="h-4 w-4 rounded border-gray-300" /> Published</label>
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Save</button>
      </form>
    </div>
  )
}

async function saveAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  await updateLegal(id, {
    title: String(formData.get('title')||''),
    slug: String(formData.get('slug')||''),
    version: String(formData.get('version')||'') || null,
    effective_date: String(formData.get('effective_date')||'') || null,
    content: String(formData.get('content')||''),
    published: formData.get('published') === 'on',
  })
}

