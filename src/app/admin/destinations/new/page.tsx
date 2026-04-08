import { createDestination } from '../actions'

export default function NewDestination() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">New Destination</h1>
      <DestinationForm />
    </div>
  )
}

function DestinationForm() {
  return (
    <form action={createAction} className="space-y-4">
      <Row label="Name"><input name="name" required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Row>
      <Row label="Slug"><input name="slug" required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Row>
      <Row label="Region"><input name="region" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Row>
      <Row label="Summary"><textarea name="summary" rows={2} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Row>
      <Row label="Description"><textarea name="description" rows={6} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Row>
      <Row label="Hero Image URL"><input name="hero_image_url" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Row>
      <div className="grid grid-cols-3 gap-3">
        <Row label="Position"><input type="number" name="position" defaultValue={0} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Row>
        <Row label="Featured"><input type="checkbox" name="featured" className="h-4 w-4 rounded border-sand-300" /></Row>
        <Row label="Published"><input type="checkbox" name="published" className="h-4 w-4 rounded border-sand-300" /></Row>
      </div>
      <Row label="SEO Title"><input name="seo_title" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Row>
      <Row label="SEO Description"><textarea name="seo_description" rows={2} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Row>
      <div className="flex gap-2">
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Create</button>
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

async function createAction(formData: FormData) {
  'use server'
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
  await createDestination(input)
}

function nullable(value: FormDataEntryValue | null): string | null {
  const str = value == null ? '' : String(value)
  return str.trim().length ? str : null
}

