import { getFaq, updateFaq } from '../actions'

export default async function EditFaq({ params }: { params: { id: string } }) {
  const row = await getFaq(params.id)
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Edit FAQ</h1>
      <form action={saveAction} className="space-y-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <input type="hidden" name="id" defaultValue={row.id} />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Category</span><input name="category" defaultValue={row.category} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
          <label className="block text-sm"><span className="mb-1 block">Position</span><input name="position" type="number" defaultValue={row.position || 0} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        </div>
        <label className="block text-sm"><span className="mb-1 block">Question</span><input name="question" defaultValue={row.question} required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <label className="block text-sm"><span className="mb-1 block">Answer</span><textarea name="answer" defaultValue={row.answer} rows={6} required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={row.published} className="h-4 w-4 rounded border-sand-300" /> Published</label>
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Save</button>
      </form>
    </div>
  )
}

async function saveAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  await updateFaq(id, {
    category: String(formData.get('category')||'general'),
    position: Number(formData.get('position')||0),
    question: String(formData.get('question')||''),
    answer: String(formData.get('answer')||''),
    published: formData.get('published') === 'on',
  })
}

