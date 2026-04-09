import { createTrip, listDestinationsOptions } from '../actions'
import { redirect } from 'next/navigation'

export default async function NewTrip() {
  const destinations = await listDestinationsOptions()
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">New Trip</h1>
      <TripForm destinations={destinations} />
    </div>
  )
}

function TripForm({ destinations }: { destinations: Array<{ id: string; name: string; region: string | null }> }) {
  return (
    <form action={createAction} className="space-y-6">
      {/* Basic Info */}
      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title"><input name="title" required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Slug"><input name="slug" required placeholder="south-island-tour" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Subtitle"><input name="subtitle" placeholder="Explore the South of Mauritius" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Region / Destination">
            <select name="destination_id" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="">—</option>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name}{d.region ? ` — ${d.region}` : ''}</option>
              ))}
            </select>
          </Field>
          <Field label="Summary" full><textarea name="summary" rows={2} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Description" full><textarea name="description" rows={6} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
        </div>
      </section>

      {/* Pricing & Status */}
      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Pricing & Status</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Base Currency">
            <select name="base_currency" defaultValue="EUR" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              {['EUR','USD','GBP','MUR'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Base Price">
            <input name="base_price" type="number" step="0.01" min="0" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          </Field>
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

      {/* Trip Details */}
      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Trip Details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Trip Mode">
            <select name="trip_mode" defaultValue="guided_tour" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="guided_tour">Guided Tour (multi-stop itinerary)</option>
              <option value="single_dropoff">Single Drop-off (transport to one venue)</option>
            </select>
          </Field>
          <Field label="Trip Type">
            <select name="trip_type" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="">—</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
              <option value="island">Island</option>
              <option value="cultural">Cultural</option>
              <option value="adventure">Adventure</option>
              <option value="custom">Custom</option>
            </select>
          </Field>
          <Field label="Duration (minutes)"><input name="duration_minutes" type="number" min="0" placeholder="480" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Vehicle Type">
            <select name="vehicle_type" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="">—</option>
              <option value="sedan">Sedan</option>
              <option value="minivan">Minivan</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
            </select>
          </Field>
          <Field label="Max Passengers"><input name="max_passengers" type="number" defaultValue={6} min={1} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Difficulty">
            <select name="difficulty_level" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="">—</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
          </Field>
        </div>
      </section>

      {/* Pickup & Dropoff */}
      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Pickup & Dropoff</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Pickup Included"><input name="pickup_included" type="checkbox" defaultChecked className="h-4 w-4 rounded border-sand-300" /></Field>
          <Field label="Dropoff Included"><input name="dropoff_included" type="checkbox" defaultChecked className="h-4 w-4 rounded border-sand-300" /></Field>
          <Field label="Pickup Location"><input name="pickup_location" placeholder="Hotel lobby, any hotel in the region" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Pickup Time"><input name="pickup_time" placeholder="08:00" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Dropoff Location" full><input name="dropoff_location" placeholder="Same as pickup" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 mt-3">
          <Field label="Min Participants"><input name="min_participants" type="number" defaultValue={1} min={1} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Max Participants"><input name="max_participants" type="number" min={1} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
        </div>
      </section>

      {/* Included / Excluded / Highlights */}
      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Included, Excluded & Highlights</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Included (comma-separated)" full><input name="included_items" placeholder="Hotel pickup, Guide, Lunch, Entrance fees" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"/></Field>
          <Field label="Excluded (comma-separated)" full><input name="excluded_items" placeholder="Drinks, Souvenirs, Optional activities" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"/></Field>
          <Field label="Highlights (comma-separated)" full><input name="highlights" placeholder="Grand Bassin, Chamarel Waterfall, Seven Colored Earths" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"/></Field>
        </div>
      </section>

      {/* Itinerary */}
      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Itinerary (JSON) — <span className="text-ink-secondary font-normal">Required for Guided Tour, optional for Single Drop-off</span></h2>
        <p className="mb-2 text-sm text-ink-secondary">Enter itinerary as JSON array of objects. Each object: {"{ time, title, description, photo_url, duration_minutes }"}</p>
        <Field label="" full>
          <textarea
            name="itinerary"
            rows={8}
            defaultValue={JSON.stringify([
              { time: '08:00', title: 'Hotel Pickup', description: 'Pickup from your hotel lobby' },
              { time: '09:00', title: 'Grand Bassin', description: 'Visit the sacred lake and Ganga Talao temple' },
              { time: '11:00', title: 'Chamarel Waterfall', description: 'View the stunning 100m waterfall' },
              { time: '13:00', title: 'Lunch Break', description: 'Lunch at a local restaurant (included)' },
              { time: '14:30', title: 'Seven Colored Earths', description: 'Explore the unique geological formation' },
              { time: '16:30', title: 'Return to Hotel', description: 'Dropoff at your hotel' },
            ], null, 2)}
            className="w-full rounded-lg border-sand-300 font-mono text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
          />
        </Field>
      </section>

      {/* Important Notes */}
      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Important Notes</h2>
        <Field label="" full><textarea name="important_notes" rows={3} placeholder="Please wear comfortable walking shoes. Bring sunscreen and a camera." className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
      </section>

      <div className="flex gap-2">
        <button className="rounded-xl bg-brand-700 px-6 py-2.5 font-medium text-white shadow-sm hover:bg-brand-800">Create Trip</button>
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
    destination_id: maybe(formData.get('destination_id')),
    seo_title: null,
    seo_description: null,
  }

  // Parse itinerary JSON
  let itinerary = []
  try {
    const raw = formData.get('itinerary')
    if (raw) itinerary = JSON.parse(String(raw))
  } catch {
    itinerary = []
  }

  const trip = {
    trip_mode: (formData.get('trip_mode') as string) === 'single_dropoff' ? 'single_dropoff' : 'guided_tour',
    trip_type: maybe(formData.get('trip_type')),
    duration_minutes: Number(formData.get('duration_minutes') || 0) || null,
    vehicle_type: maybe(formData.get('vehicle_type')),
    max_passengers: Number(formData.get('max_passengers') || 6),
    pickup_included: formData.get('pickup_included') === 'on',
    pickup_location: maybe(formData.get('pickup_location')),
    pickup_time: maybe(formData.get('pickup_time')),
    dropoff_location: maybe(formData.get('dropoff_location')),
    dropoff_included: formData.get('dropoff_included') === 'on',
    min_participants: Number(formData.get('min_participants') || 1) || 1,
    max_participants: Number(formData.get('max_participants') || 0) || null,
    difficulty_level: maybe(formData.get('difficulty_level')),
    included_items: splitCSV(formData.get('included_items')),
    excluded_items: splitCSV(formData.get('excluded_items')),
    highlights: splitCSV(formData.get('highlights')),
    itinerary,
    important_notes: maybe(formData.get('important_notes')),
  }
  await createTrip(product as any, trip as any)
}

function maybe(v: FormDataEntryValue | null): string | null { const s = v==null? '' : String(v); return s.trim()? s : null }
function splitCSV(v: FormDataEntryValue | null): string[] { const s = v==null? '' : String(v); return s.split(',').map(t=>t.trim()).filter(Boolean) }
