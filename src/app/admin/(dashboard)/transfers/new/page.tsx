import { createTransfer } from '../actions'

export default function NewTransfer() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">New Airport Transfer</h1>
      <TransferForm />
    </div>
  )
}

function TransferForm() {
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
          <Field label="From Price (optional)"><input name="base_price" type="number" step="0.01" min="0" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
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
        <h2 className="mb-3 text-lg font-semibold text-ink">Transfer Configuration</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Pricing Model">
            <select name="pricing_model" defaultValue="fixed" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="fixed">Fixed</option>
              <option value="zone_based">Zone-based</option>
              <option value="distance_based">Distance-based</option>
            </select>
          </Field>
          <Field label="Vehicle Type">
            <select name="vehicle_type" defaultValue="sedan" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="sedan">Sedan</option>
              <option value="minivan">Minivan</option>
              <option value="bus">Bus</option>
              <option value="luxury">Luxury</option>
            </select>
          </Field>
          <Field label="Max Passengers"><input name="max_passengers" type="number" defaultValue={4} min={1} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Max Luggage"><input name="max_luggage" type="number" min={0} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Includes Meet & Greet"><input name="includes_meet_greet" type="checkbox" className="h-4 w-4 rounded border-sand-300" /></Field>
          <Field label="Includes Flight Tracking"><input name="includes_flight_tracking" type="checkbox" className="h-4 w-4 rounded border-sand-300" /></Field>
          <Field label="Base Fare"><input name="base_fare" type="number" step="0.01" min="0" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Per KM Rate"><input name="per_km_rate" type="number" step="0.0001" min="0" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Waiting Fee / Hour"><input name="waiting_fee_per_hour" type="number" step="0.01" min="0" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Notes" full><textarea name="notes" rows={2} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
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
    <label className={"text-sm " + (full ? 'sm:col-span-3' : '')}>
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
  const transfer = {
    pricing_model: String(formData.get('pricing_model') || 'fixed') as any,
    vehicle_type: String(formData.get('vehicle_type') || 'sedan') as any,
    max_passengers: Number(formData.get('max_passengers') || 4) || 4,
    max_luggage: Number(formData.get('max_luggage') || 0) || null,
    includes_meet_greet: formData.get('includes_meet_greet') === 'on',
    includes_flight_tracking: formData.get('includes_flight_tracking') === 'on',
    base_fare: Number(formData.get('base_fare') || 0) || null,
    per_km_rate: Number(formData.get('per_km_rate') || 0) || null,
    waiting_fee_per_hour: Number(formData.get('waiting_fee_per_hour') || 0) || null,
    notes: maybe(formData.get('notes')),
  }
  await createTransfer(product as any, transfer as any)
}

function maybe(v: FormDataEntryValue | null): string | null { const s = v==null? '' : String(v); return s.trim()? s : null }

