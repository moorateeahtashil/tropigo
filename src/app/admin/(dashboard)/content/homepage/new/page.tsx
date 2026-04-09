import { createSection } from '../actions'

export default function NewSection() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">New Homepage Section</h1>
      <form action={createAction} className="space-y-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <label className="block text-sm"><span className="mb-1 block">Section Type</span>
          <select name="section_type" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            {['hero','transfers_cta','featured_activities','featured_packages','destinations','testimonials','promo','faqs','stats','custom'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm"><span className="mb-1 block">Title</span><input name="title" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        <label className="block text-sm"><span className="mb-1 block">Subtitle</span><input name="subtitle" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
        <label className="block text-sm"><span className="mb-1 block">Data (JSON)</span><textarea name="data" rows={6} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" defaultValue="{}" /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Position</span><input name="position" type="number" defaultValue={0} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" className="h-4 w-4 rounded border-gray-300" /> Published</label>
        </div>
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Create</button>
      </form>
    </div>
  )
}

async function createAction(formData: FormData) {
  'use server'
  const dataRaw = String(formData.get('data') || '{}')
  await createSection({
    section_type: String(formData.get('section_type')||'custom'),
    title: String(formData.get('title')||'') || null,
    subtitle: String(formData.get('subtitle')||'') || null,
    data: JSON.parse(dataRaw || '{}'),
    position: Number(formData.get('position')||0),
    published: formData.get('published') === 'on',
  })
}

