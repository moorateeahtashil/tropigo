import { getDestination, updateDestination } from '../actions'

export default async function EditDestination({ params }: { params: { id: string } }) {
  const row = await getDestination(params.id)
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Edit Destination</h1>
      <DestinationForm row={row} />
    </div>
  )
}

function DestinationForm({ row }: { row: any }) {
  return (
    <form action={updateAction} className="space-y-4">
      <input type="hidden" name="id" defaultValue={row.id} />
      <Row label="Name"><input name="name" defaultValue={row.name} required className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Row>
      <Row label="Slug"><input name="slug" defaultValue={row.slug} required className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Row>
      <Row label="Region"><input name="region" defaultValue={row.region || ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Row>
      <Row label="Summary"><textarea name="summary" defaultValue={row.summary || ''} rows={2} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Row>
      <Row label="Description"><textarea name="description" defaultValue={row.description || ''} rows={6} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Row>
      <Row label="Hero Image URL"><input name="hero_image_url" defaultValue={row.hero_image_url || ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Row>
      <div className="grid grid-cols-3 gap-3">
        <Row label="Position"><input type="number" name="position" defaultValue={row.position || 0} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Row>
        <Row label="Featured"><input type="checkbox" name="featured" defaultChecked={row.featured} className="h-4 w-4 rounded border-gray-300" /></Row>
        <Row label="Published"><input type="checkbox" name="published" defaultChecked={row.published} className="h-4 w-4 rounded border-gray-300" /></Row>
      </div>
      <Row label="SEO Title"><input name="seo_title" defaultValue={row.seo_title || ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Row>
      <Row label="SEO Description"><textarea name="seo_description" defaultValue={row.seo_description || ''} rows={2} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Row>
      <div className="flex gap-2">
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Save</button>
      </div>
    </form>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      {children}
    </label>
  )
}

async function updateAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const input = {
    name: String(formData.get('name') || ''),
    slug: String(formData.get('slug') || ''),
    region: nullable(formData.get('region')),
    summary: nullable(formData.get('summary')),
    description: nullable(formData.get('description')),
    hero_image_url: nullable(formData.get('hero_image_url')),
    position: Number(formData.get('position') || 0),
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
    seo_title: nullable(formData.get('seo_title')),
    seo_description: nullable(formData.get('seo_description')),
  }
  await updateDestination(id, input)
}

function nullable(value: FormDataEntryValue | null): string | null {
  const str = value == null ? '' : String(value)
  return str.trim().length ? str : null
}

