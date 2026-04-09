import { getSection, updateSection } from '../actions'

export default async function EditSection({ params }: { params: { id: string } }) {
  const row = await getSection(params.id)
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Edit Section</h1>
      <form action={saveAction} className="space-y-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <input type="hidden" name="id" defaultValue={row.id} />
        <label className="block text-sm"><span className="mb-1 block">Section Type</span>
          <select name="section_type" defaultValue={row.section_type} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
            {['hero','transfers_cta','featured_activities','featured_packages','destinations','testimonials','promo','faqs','stats','custom'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm"><span className="mb-1 block">Title</span><input name="title" defaultValue={row.title || ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <label className="block text-sm"><span className="mb-1 block">Subtitle</span><input name="subtitle" defaultValue={row.subtitle || ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <label className="block text-sm"><span className="mb-1 block">Data (JSON)</span><textarea name="data" defaultValue={JSON.stringify(row.data ?? {}, null, 2)} rows={10} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Position</span><input name="position" type="number" defaultValue={row.position || 0} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={row.published} className="h-4 w-4 rounded border-sand-300" /> Published</label>
        </div>
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Save</button>
      </form>
    </div>
  )
}

async function saveAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const dataRaw = String(formData.get('data') || '{}')
  await updateSection(id, {
    section_type: String(formData.get('section_type')||'custom'),
    title: String(formData.get('title')||'') || null,
    subtitle: String(formData.get('subtitle')||'') || null,
    data: JSON.parse(dataRaw || '{}'),
    position: Number(formData.get('position')||0),
    published: formData.get('published') === 'on',
  })
}

