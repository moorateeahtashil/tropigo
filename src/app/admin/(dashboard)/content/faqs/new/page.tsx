import { createFaq } from '../actions'

export default function NewFaq() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">New FAQ</h1>
      <form action={createAction} className="space-y-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Category</span><input name="category" defaultValue="general" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
          <label className="block text-sm"><span className="mb-1 block">Position</span><input name="position" type="number" defaultValue={0} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        </div>
        <label className="block text-sm"><span className="mb-1 block">Question</span><input name="question" required className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        <label className="block text-sm"><span className="mb-1 block">Answer</span><textarea name="answer" rows={6} required className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked className="h-4 w-4 rounded border-gray-300" /> Published</label>
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Create</button>
      </form>
    </div>
  )
}

async function createAction(formData: FormData) {
  'use server'
  await createFaq({
    category: String(formData.get('category')||'general'),
    position: Number(formData.get('position')||0),
    question: String(formData.get('question')||''),
    answer: String(formData.get('answer')||''),
    published: formData.get('published') === 'on',
  })
}

