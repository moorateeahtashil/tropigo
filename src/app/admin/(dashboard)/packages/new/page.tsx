import { createPackage } from '../actions'

export default function NewPackage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">New Package</h1>
      <PackageForm />
    </div>
  )
}

function PackageForm() {
  return (
    <form action={createAction} className="space-y-6">
      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title"><input name="title" required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Slug"><input name="slug" required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Subtitle"><input name="subtitle" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Summary" full><textarea name="summary" rows={2} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Description" full><textarea name="description" rows={6} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
        </div>
      </section>

      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Pricing & Status</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Base Currency">
            <select name="base_currency" defaultValue="EUR" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              {['EUR','USD','GBP','MUR'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Base Price (optional)"><input name="base_price" type="number" step="0.01" min="0" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Status">
            <select name="status" defaultValue="draft" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mt-3">
          <Field label="Position"><input name="position" type="number" defaultValue={0} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Featured"><input name="featured" type="checkbox" className="h-4 w-4 rounded border-sand-300" /></Field>
        </div>
      </section>

      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Package Settings</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Pricing Mode">
            <select name="pricing_mode" defaultValue="computed" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="fixed">Fixed</option>
              <option value="computed">Computed</option>
              <option value="computed_with_discount">Computed with Discount</option>
            </select>
          </Field>
          <Field label="Discount %"><input name="discount_percent" type="number" min="0" max="100" defaultValue={0} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Duration (days)"><input name="duration_days" type="number" min="1" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Highlights (comma-separated)" full><input name="highlights" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Important Notes" full><textarea name="important_notes" rows={2} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
        </div>
      </section>

      <div className="flex gap-2">
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Create</button>
      </div>
    </form>
  )
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={"text-sm " + (full ? 'sm:col-span-2' : '')}>
      <span className="mb-1 block font-medium text-ink">{label}</span>
      {children}
    </label>
  )
}

async function createAction(formData: FormData) {
  'use server'
  const product = {
    title: String(formData.get('title') || ''),
    slug: String(formData.get('slug') || ''),
    subtitle: maybe(formData.get('subtitle')),
    summary: maybe(formData.get('summary')),
    description: maybe(formData.get('description')),
    base_currency: String(formData.get('base_currency') || 'EUR'),
    base_price: Number(formData.get('base_price') || 0) || null,
    status: String(formData.get('status') || 'draft') as any,
    featured: formData.get('featured') === 'on',
    position: Number(formData.get('position') || 0),
    seo_title: null,
    seo_description: null,
  }
  const pkg = {
    pricing_mode: String(formData.get('pricing_mode') || 'computed') as any,
    discount_percent: Number(formData.get('discount_percent') || 0) || 0,
    duration_days: Number(formData.get('duration_days') || 0) || null,
    highlights: splitCSV(formData.get('highlights')),
    important_notes: maybe(formData.get('important_notes')),
  }
  await createPackage(product as any, pkg as any)
}

function maybe(v: FormDataEntryValue | null): string | null { const s = v==null? '' : String(v); return s.trim()? s : null }
function splitCSV(v: FormDataEntryValue | null): string[] { const s = v==null? '' : String(v); return s.split(',').map(t=>t.trim()).filter(Boolean) }

