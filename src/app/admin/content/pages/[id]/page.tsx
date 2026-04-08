import { getPage, updatePage } from '../actions'

export default async function EditPage({ params }: { params: { id: string } }) {
  const row = await getPage(params.id)
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Edit Page</h1>
      <form action={saveAction} className="space-y-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <input type="hidden" name="id" defaultValue={row.id} />
        <label className="block text-sm"><span className="mb-1 block">Title</span><input name="title" defaultValue={row.title} required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <label className="block text-sm"><span className="mb-1 block">Slug</span><input name="slug" defaultValue={row.slug} required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <label className="block text-sm"><span className="mb-1 block">Content (Markdown)</span><textarea name="content" defaultValue={row.content || ''} rows={10} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={row.published} className="h-4 w-4 rounded border-sand-300" /> Published</label>
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Save</button>
      </form>
    </div>
  )
}

async function saveAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  await updatePage(id, {
    title: String(formData.get('title')||''),
    slug: String(formData.get('slug')||''),
    content: String(formData.get('content')||''),
    published: formData.get('published') === 'on',
  })
}

