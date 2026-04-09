import { notFound } from 'next/navigation'
import { deleteTrip, getTripProduct, listDestinationsOptions, updateTrip } from '../actions'
import { PhotoManager } from '@/components/admin/PhotoManager'
import { TripScheduleManager } from '@/components/admin/TripScheduleManager'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function EditTrip({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let trip: any = null
  try {
    trip = await getTripProduct(id)
  } catch (err: any) {
    // Show error instead of 404 so user knows what's wrong
    return (
      <div className="mx-auto max-w-4xl py-12">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">Failed to load trip</h2>
          <p className="mt-2 text-sm text-red-600">{err.message || 'Unknown error'}</p>
          <a href="/admin/trips" className="mt-4 inline-block text-sm text-red-700 underline hover:text-red-800">← Back to trips</a>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-amber-800">Trip not found</h2>
          <p className="mt-2 text-sm text-amber-600">The trip with ID {id} does not exist.</p>
          <a href="/admin/trips" className="mt-4 inline-block text-sm text-amber-700 underline hover:text-amber-800">← Back to trips</a>
        </div>
      </div>
    )
  }

  const destinations = await listDestinationsOptions()

  // Schedules - fail gracefully if table doesn't exist
  let schedules: any[] = []
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('trip_schedules').select('*').eq('trip_id', id)
    if (!error && data) schedules = data
  } catch { /* table may not exist yet */ }

  const productMedia = trip.product_media ?? []

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Trip</h1>
          <p className="mt-1 text-sm text-gray-500">Update trip details, photos, and schedule.</p>
        </div>
        <a href="/admin/trips" className="text-sm text-gray-500 hover:text-gray-700">← Back to list</a>
      </div>

      <TripForm
        trip={trip}
        destinations={destinations}
      />

      {/* Photos */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Photos</h2>
        <p className="mb-4 text-sm text-gray-500">Upload photos for this trip. The first image will be the cover.</p>
        <PhotoManager
          productId={trip.id}
          initialMedia={productMedia as any}
        />
      </div>

      {/* Availability Schedule */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-base font-semibold text-gray-900">Departure Schedule</h2>
        <p className="mb-4 text-sm text-gray-500">Set which days and times this trip runs. Customers can only book available slots.</p>
        <TripScheduleManager
          tripId={trip.id}
          initialSchedules={schedules as any}
        />
      </div>

      {/* Delete */}
      <form action={deleteAction.bind(null, trip.id)}>
        <button className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50">
          Delete Trip
        </button>
      </form>
    </div>
  )
}

function TripForm({
  trip,
  destinations,
}: {
  trip: any
  destinations: Array<{ id: string; name: string; region: string | null }>
}) {
  const product = trip
  const tripData = trip.trips

  return (
    <form action={updateAction.bind(null, product.id)} className="space-y-6">
      {/* Basic Info */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input name="title" required defaultValue={product.title} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Slug">
            <input name="slug" required defaultValue={product.slug} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Subtitle">
            <input name="subtitle" defaultValue={product.subtitle ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Region / Destination">
            <select name="destination_id" defaultValue={product.destination_id ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="">—</option>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name}{d.region ? ` — ${d.region}` : ''}</option>
              ))}
            </select>
          </Field>
          <Field label="Summary" full>
            <textarea name="summary" rows={2} defaultValue={product.summary ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Description" full>
            <textarea name="description" rows={6} defaultValue={product.description ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
        </div>
      </section>

      {/* Pricing & Status */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Pricing & Status</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Base Currency">
            <select name="base_currency" defaultValue={product.base_currency} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              {['EUR','USD','GBP','MUR'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Base Price">
            <input name="base_price" type="number" step="0.01" min="0" defaultValue={product.base_price ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={product.status} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mt-3">
          <Field label="Position">
            <input name="position" type="number" defaultValue={product.position} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Featured">
            <input name="featured" type="checkbox" defaultChecked={product.featured} className="h-4 w-4 rounded border-gray-300" />
          </Field>
        </div>
      </section>

      {/* Trip Details */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Trip Details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Trip Mode">
            <select name="trip_mode" defaultValue={tripData?.trip_mode ?? 'guided_tour'} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="guided_tour">Guided Tour (multi-stop itinerary)</option>
              <option value="single_dropoff">Single Drop-off (transport to one venue)</option>
            </select>
          </Field>
          <Field label="Trip Type">
            <select name="trip_type" defaultValue={tripData?.trip_type ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
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
          <Field label="Duration (minutes)">
            <input name="duration_minutes" type="number" min="0" defaultValue={tripData?.duration_minutes ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Vehicle Type">
            <select name="vehicle_type" defaultValue={tripData?.vehicle_type ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="">—</option>
              <option value="sedan">Sedan</option>
              <option value="minivan">Minivan</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
            </select>
          </Field>
          <Field label="Max Passengers">
            <input name="max_passengers" type="number" defaultValue={tripData?.max_passengers ?? 6} min={1} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Difficulty">
            <select name="difficulty_level" defaultValue={tripData?.difficulty_level ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="">—</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
          </Field>
        </div>
      </section>

      {/* Pickup & Dropoff */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Pickup & Dropoff</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Pickup Included">
            <input name="pickup_included" type="checkbox" defaultChecked={tripData?.pickup_included} className="h-4 w-4 rounded border-gray-300" />
          </Field>
          <Field label="Dropoff Included">
            <input name="dropoff_included" type="checkbox" defaultChecked={tripData?.dropoff_included} className="h-4 w-4 rounded border-gray-300" />
          </Field>
          <Field label="Pickup Location">
            <input name="pickup_location" defaultValue={tripData?.pickup_location ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Pickup Time">
            <input name="pickup_time" defaultValue={tripData?.pickup_time ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Dropoff Location" full>
            <input name="dropoff_location" defaultValue={tripData?.dropoff_location ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 mt-3">
          <Field label="Min Participants">
            <input name="min_participants" type="number" defaultValue={tripData?.min_participants ?? 1} min={1} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Max Participants">
            <input name="max_participants" type="number" defaultValue={tripData?.max_participants ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
        </div>
      </section>

      {/* Included / Excluded / Highlights */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Included, Excluded & Highlights</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Included (comma-separated)" full>
            <input name="included_items" defaultValue={(tripData?.included_items || []).join(', ')} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Excluded (comma-separated)" full>
            <input name="excluded_items" defaultValue={(tripData?.excluded_items || []).join(', ')} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
          <Field label="Highlights (comma-separated)" full>
            <input name="highlights" defaultValue={(tripData?.highlights || []).join(', ')} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </Field>
        </div>
      </section>

      {/* Itinerary */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-base font-semibold text-gray-900">Itinerary (JSON)</h2>
        <p className="mb-3 text-sm text-gray-500">JSON array of stops: {"[{ time, title, description, photo_url }]"}</p>
        <Field label="" full>
          <textarea
            name="itinerary"
            rows={6}
            defaultValue={JSON.stringify(tripData?.itinerary ?? [], null, 2)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 font-mono text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </Field>
      </section>

      {/* Important Notes */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-base font-semibold text-gray-900">Important Notes</h2>
        <Field label="" full>
          <textarea name="important_notes" rows={3} defaultValue={tripData?.important_notes ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
        </Field>
      </section>

      <div className="flex justify-end">
        <button className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">Save Changes</button>
      </div>
    </form>
  )
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={"text-sm " + (full ? 'sm:col-span-2' : '')}>
      <span className="mb-1.5 block font-medium text-gray-700">{label}</span>
      {children}
    </label>
  )
}

async function updateAction(id: string, formData: FormData) {
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
  await updateTrip(id, product as any, trip as any)
}

async function deleteAction(id: string) {
  'use server'
  await deleteTrip(id)
}

function maybe(v: FormDataEntryValue | null): string | null { const s = v==null? '' : String(v); return s.trim()? s : null }
function splitCSV(v: FormDataEntryValue | null): string[] { const s = v==null? '' : String(v); return s.split(',').map(t=>t.trim()).filter(Boolean) }
