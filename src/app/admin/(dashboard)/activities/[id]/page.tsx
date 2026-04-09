import { getActivityProduct, listDestinationsOptions, updateActivity, uploadActivityImage, setCoverImage, deleteMedia, moveMedia, updateMediaAlt, reorderMedia, addPriceOverride, deletePriceOverride, addAvailabilityRule, deleteAvailabilityRule } from '../actions'

export default async function EditActivity({ params }: { params: { id: string } }) {
  const [row, destinations] = await Promise.all([
    getActivityProduct(params.id),
    listDestinationsOptions(),
  ])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Edit Activity</h1>
      <ActivityForm row={row} destinations={destinations} />
      <GalleryManager row={row} />
      <PricingOverrides row={row} />
      <AvailabilityEditor row={row} />
    </div>
  )
}

function ActivityForm({ row, destinations }: { row: any; destinations: Array<{ id: string; name: string; region: string | null }> }) {
  const a = row.activities
  const destination_id: string | undefined = (row.product_destinations?.[0]?.destination_id) || a?.destination_id || undefined

  return (
    <form action={saveAction} className="space-y-6">
      <input type="hidden" name="id" defaultValue={row.id} />
      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title"><input name="title" defaultValue={row.title} required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Slug"><input name="slug" defaultValue={row.slug} required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Subtitle"><input name="subtitle" defaultValue={row.subtitle || ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Region / Destination">
            <select name="destination_id" defaultValue={destination_id || ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="">—</option>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name}{d.region ? ` — ${d.region}` : ''}</option>
              ))}
            </select>
          </Field>
          <Field label="Summary" full><textarea name="summary" defaultValue={row.summary || ''} rows={2} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Description" full><textarea name="description" defaultValue={row.description || ''} rows={6} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
        </div>
      </section>

      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Pricing & Status</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Base Currency">
            <select name="base_currency" defaultValue={row.base_currency} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              {['EUR','USD','GBP','MUR'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Base Price"><input name="base_price" type="number" step="0.01" defaultValue={row.base_price ?? ''} min="0" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Status">
            <select name="status" defaultValue={row.status} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mt-3">
          <Field label="Position"><input name="position" type="number" defaultValue={row.position || 0} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Featured"><input name="featured" type="checkbox" defaultChecked={row.featured} className="h-4 w-4 rounded border-sand-300" /></Field>
        </div>
      </section>

      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Activity Details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Duration (minutes)"><input name="duration_minutes" type="number" defaultValue={a?.duration_minutes ?? ''} min="0" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Tour Type">
            <select name="tour_type" defaultValue={a?.tour_type ?? ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="">—</option>
              <option value="private">Private</option>
              <option value="group">Group</option>
              <option value="shared">Shared</option>
            </select>
          </Field>
          <Field label="Difficulty">
            <select name="difficulty_level" defaultValue={a?.difficulty_level ?? ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="">—</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
          </Field>
          <Field label="Transportation"><input name="transportation" defaultValue={a?.transportation ?? ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Pickup Location"><input name="pickup_location" defaultValue={a?.pickup_location ?? ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Pickup Time"><input name="pickup_time" defaultValue={a?.pickup_time ?? ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Min Participants"><input name="min_participants" type="number" defaultValue={a?.min_participants ?? 1} min={1} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Max Participants"><input name="max_participants" type="number" defaultValue={a?.max_participants ?? ''} min={1} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
          <Field label="Important Notes" full><textarea name="important_notes" defaultValue={a?.important_notes ?? ''} rows={2} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 mt-3">
          <Field label="Included (comma-separated)"><input name="included_items" defaultValue={(a?.included_items || []).join(', ')} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"/></Field>
          <Field label="Excluded (comma-separated)"><input name="excluded_items" defaultValue={(a?.excluded_items || []).join(', ')} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"/></Field>
          <Field label="Highlights (comma-separated)" full><input name="highlights" defaultValue={(a?.highlights || []).join(', ')} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"/></Field>
        </div>
      </section>

      <div className="flex gap-2">
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Save</button>
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

async function saveAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
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
  const activity = {
    duration_minutes: Number(formData.get('duration_minutes') || 0) || null,
    tour_type: maybe(formData.get('tour_type')),
    transportation: maybe(formData.get('transportation')),
    pickup_location: maybe(formData.get('pickup_location')),
    pickup_time: maybe(formData.get('pickup_time')),
    min_participants: Number(formData.get('min_participants') || 1) || 1,
    max_participants: Number(formData.get('max_participants') || 0) || null,
    difficulty_level: maybe(formData.get('difficulty_level')),
    included_items: splitCSV(formData.get('included_items')),
    excluded_items: splitCSV(formData.get('excluded_items')),
    highlights: splitCSV(formData.get('highlights')),
    important_notes: maybe(formData.get('important_notes')),
  }
  await updateActivity(id, product as any, activity as any)
}

function maybe(v: FormDataEntryValue | null): string | null { const s = v==null? '' : String(v); return s.trim()? s : null }
function splitCSV(v: FormDataEntryValue | null): string[] { const s = v==null? '' : String(v); return s.split(',').map(t=>t.trim()).filter(Boolean) }

function GalleryManager({ row }: { row: any }) {
  return (
    <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
      <h2 className="mb-3 text-lg font-semibold text-ink">Gallery</h2>
      <ReorderHint />
      <form action={uploadAction.bind(null, row.id)} className="flex items-center gap-3">
        <input type="file" name="image" accept="image/*" required className="text-sm" />
        <button className="rounded-lg border border-sand-300 px-3 py-2 text-sm">Upload</button>
      </form>
      <form action={reorderAction.bind(null, row.id)}>
      <div className="mt-4 grid gap-3 sm:grid-cols-3" data-sortable>
        {(row.product_media || []).sort((a:any,b:any)=>a.sort_order-b.sort_order).map((m: any) => (
          <div key={m.id} className="overflow-hidden rounded-xl border border-sand-200" draggable onDragStart={(e)=>e.dataTransfer.setData('text/plain', m.id)} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{
              e.preventDefault();
              const fromId = e.dataTransfer.getData('text/plain');
              const container = (e.currentTarget.parentElement as HTMLElement)
              if (!container) return
              const order = Array.from(container.children).map((el:any)=> el.getAttribute('data-id'))
              const fromIdx = order.indexOf(fromId); const toIdx = order.indexOf(m.id)
              if (fromIdx<0 || toIdx<0) return
              order.splice(toIdx, 0, order.splice(fromIdx,1)[0])
              ;(document.getElementById('media-order') as HTMLInputElement).value = order.join(',')
              ;(document.getElementById('save-order') as HTMLButtonElement).disabled = false
            }} data-id={m.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.alt || ''} className="h-40 w-full object-cover" />
            <div className="flex items-center justify-between p-2 text-xs">
              <div className="flex items-center gap-2">
                {m.is_cover ? (
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">Cover</span>
                ) : (
                  <form action={setCoverAction}>
                    <input type="hidden" name="product_id" value={row.id} />
                    <input type="hidden" name="media_id" value={m.id} />
                    <button className="text-brand-700 hover:underline">Set cover</button>
                  </form>
                )}
              </div>
              <div className="flex items-center gap-2">
                <form action={moveMediaAction}>
                  <input type="hidden" name="product_id" value={row.id} />
                  <input type="hidden" name="media_id" value={m.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button title="Move up">↑</button>
                </form>
                <form action={moveMediaAction}>
                  <input type="hidden" name="product_id" value={row.id} />
                  <input type="hidden" name="media_id" value={m.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button title="Move down">↓</button>
                </form>
                <form action={deleteMediaAction}>
                  <input type="hidden" name="product_id" value={row.id} />
                  <input type="hidden" name="media_id" value={m.id} />
                  <button className="text-red-600 hover:underline">Delete</button>
                </form>
              </div>
            </div>
            <form action={saveAltAction} className="flex items-center gap-2 border-t border-sand-200 p-2">
              <input type="hidden" name="product_id" value={row.id} />
              <input type="hidden" name="media_id" value={m.id} />
              <input name="alt" defaultValue={m.alt || ''} placeholder="Alt text" className="flex-1 rounded-lg border-sand-300 text-xs shadow-sm focus:border-brand-500 focus:ring-brand-500" />
              <button className="rounded-lg border border-sand-300 px-2 py-1 text-xs">Save</button>
            </form>
          </div>
        ))}
      </div>
      <input type="hidden" id="media-order" name="ordered_ids" />
      <div className="mt-3">
        <button id="save-order" disabled className="rounded-lg border border-sand-300 px-3 py-2 text-sm disabled:opacity-50">Save order</button>
      </div>
      </form>
    </section>
  )
}

async function uploadAction(productId: string, formData: FormData) {
  'use server'
  const file = formData.get('image') as File | null
  if (!file) return
  await uploadActivityImage(productId, file)
}

async function setCoverAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  await setCoverImage(productId, mediaId)
}

async function deleteMediaAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  await deleteMedia(productId, mediaId)
}

async function moveMediaAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  const direction = String(formData.get('direction')) as 'up'|'down'
  await moveMedia(productId, mediaId, direction)
}

async function saveAltAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  const alt = String(formData.get('alt') || '')
  await updateMediaAlt(productId, mediaId, alt)
}

async function reorderAction(productId: string, formData: FormData) {
  'use server'
  const ordered = String(formData.get('ordered_ids') || '').split(',').filter(Boolean)
  if (ordered.length) await reorderMedia(productId, ordered)
}

function ReorderHint() {
  return (
    <p className="mb-3 text-xs text-ink-muted">Tip: drag images to reorder, then click “Save order”.</p>
  )
}

function PricingOverrides({ row }: { row: any }) {
  return (
    <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
      <h2 className="mb-3 text-lg font-semibold text-ink">Pricing Overrides</h2>
      <form action={addOverrideAction.bind(null, row.id)} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Currency</label>
          <select name="currency" className="rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
            {['EUR','USD','GBP','MUR'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Price</label>
          <input name="price" type="number" step="0.01" min="0" className="rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <button className="rounded-lg border border-sand-300 px-3 py-2 text-sm">Add / Update</button>
      </form>
      <div className="mt-3 overflow-hidden rounded-xl border border-sand-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Currency</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(row.product_pricing || []).map((p: any) => (
              <tr key={p.id} className="border-t border-sand-100">
                <td className="px-4 py-2">{p.currency}</td>
                <td className="px-4 py-2">{p.price.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">
                  <form action={deleteOverrideAction} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="product_id" value={row.id} />
                    <button className="text-red-600 hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

async function addOverrideAction(productId: string, formData: FormData) {
  'use server'
  const currency = String(formData.get('currency'))
  const price = Number(formData.get('price') || 0)
  await addPriceOverride(productId, currency, price)
}

async function deleteOverrideAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const productId = String(formData.get('product_id'))
  await deletePriceOverride(id, productId)
}

function AvailabilityEditor({ row }: { row: any }) {
  const rules = (row.availability_rules || []).sort((a:any,b:any)=> (a.start_date||'').localeCompare(b.start_date||''))
  return (
    <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
      <h2 className="mb-3 text-lg font-semibold text-ink">Availability Rules</h2>
      <form action={addRuleAction.bind(null, row.id)} className="grid gap-3 sm:grid-cols-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Type</label>
          <select name="rule_type" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
            <option value="blackout">Blackout</option>
            <option value="schedule">Schedule</option>
            <option value="cutoff">Cutoff</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Start Date</label>
          <input type="date" name="start_date" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">End Date</label>
          <input type="date" name="end_date" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink">Days of Week (comma e.g. 1,2,3)</label>
          <input name="days_of_week" placeholder="1=Mon … 7=Sun" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink">Min Advance Hours</label>
          <input name="min_advance_hours" type="number" defaultValue={24} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink">Max Advance Days</label>
          <input name="max_advance_days" type="number" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink">Notes</label>
          <input name="notes" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div className="flex items-end">
          <button className="rounded-lg border border-sand-300 px-3 py-2 text-sm">Add Rule</button>
        </div>
      </form>
      <div className="mt-4 overflow-hidden rounded-xl border border-sand-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Dates</th>
              <th className="px-4 py-2">DOW</th>
              <th className="px-4 py-2">Cutoffs</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r:any)=> (
              <tr key={r.id} className="border-t border-sand-100">
                <td className="px-4 py-2">{r.rule_type}</td>
                <td className="px-4 py-2">{r.start_date || '—'} → {r.end_date || '—'}</td>
                <td className="px-4 py-2">{(r.days_of_week||[]).join(', ')}</td>
                <td className="px-4 py-2">min {r.min_advance_hours}h {r.max_advance_days ? ` / max ${r.max_advance_days}d` : ''}</td>
                <td className="px-4 py-2">{r.notes || '—'}</td>
                <td className="px-4 py-2 text-right">
                  <form action={deleteRuleAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="product_id" value={row.id} />
                    <button className="text-red-600 hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

async function addRuleAction(productId: string, formData: FormData) {
  'use server'
  const rule_type = String(formData.get('rule_type')) as 'blackout'|'schedule'|'cutoff'
  const start_date = String(formData.get('start_date') || '') || null
  const end_date = String(formData.get('end_date') || '') || null
  const days_of_week = String(formData.get('days_of_week') || '').split(',').map(s=>Number(s.trim())).filter(n=>!Number.isNaN(n))
  const min_advance_hours = Number(formData.get('min_advance_hours') || 24)
  const max_advance_days = String(formData.get('max_advance_days') || '') ? Number(formData.get('max_advance_days')) : null
  const notes = String(formData.get('notes') || '') || null
  await addAvailabilityRule({ product_id: productId, rule_type, start_date, end_date, days_of_week, min_advance_hours, max_advance_days, notes })
}

async function deleteRuleAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const productId = String(formData.get('product_id'))
  await deleteAvailabilityRule(id, productId)
}
