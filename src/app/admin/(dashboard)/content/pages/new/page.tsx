import { createPage } from '../actions'

export default function NewPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">New Page</h1>
      <form action={createAction} className="space-y-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <label className="block text-sm"><span className="mb-1 block">Title</span><input name="title" required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <label className="block text-sm"><span className="mb-1 block">Slug</span><input name="slug" required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <label className="block text-sm"><span className="mb-1 block">Content (Markdown)</span><textarea name="content" rows={10} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" className="h-4 w-4 rounded border-sand-300" /> Published</label>
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Create</button>
      </form>
    </div>
  )
}

async function createAction(formData: FormData) {
  'use server'
  await createPage({
    title: String(formData.get('title')||''),
    slug: String(formData.get('slug')||''),
    content: String(formData.get('content')||''),
    published: formData.get('published') === 'on',
  })
}

