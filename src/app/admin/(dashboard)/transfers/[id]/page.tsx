import { getTransferProduct, listZonesOptions, updateTransfer, upsertZonePrice, deleteZonePrice, uploadTransferImage, setTransferCoverImage, deleteTransferMedia, moveTransferMedia, updateTransferMediaAlt, reorderTransferMedia, addTransferPriceOverride, deleteTransferPriceOverride } from '../actions'

export default async function EditTransfer({ params }: { params: { id: string } }) {
  const [row, zones] = await Promise.all([
    getTransferProduct(params.id),
    listZonesOptions(),
  ])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Edit Transfer</h1>
      <TransferForm row={row} />
      <GalleryManager row={row} />
      <PricingOverrides row={row} />
      <ZoneMatrix transferId={row.id} zones={zones} rows={row.transfer_zone_prices || []} baseCurrency={row.base_currency} />
    </div>
  )
}

function TransferForm({ row }: { row: any }) {
  const t = row.airport_transfers
  return (
    <form action={saveAction} className="space-y-6">
      <input type="hidden" name="id" defaultValue={row.id} />
      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title"><input name="title" defaultValue={row.title} required className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Slug"><input name="slug" defaultValue={row.slug} required className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Subtitle"><input name="subtitle" defaultValue={row.subtitle || ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Summary" full><textarea name="summary" defaultValue={row.summary || ''} rows={2} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Description" full><textarea name="description" defaultValue={row.description || ''} rows={6} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
        </div>
      </section>

      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Pricing & Status</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Base Currency">
            <select name="base_currency" defaultValue={row.base_currency} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              {['EUR','USD','GBP','MUR'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="From Price (optional)"><input name="base_price" type="number" step="0.01" defaultValue={row.base_price ?? ''} min="0" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Status">
            <select name="status" defaultValue={row.status} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mt-3">
          <Field label="Position"><input name="position" type="number" defaultValue={row.position || 0} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Featured"><input name="featured" type="checkbox" defaultChecked={row.featured} className="h-4 w-4 rounded border-gray-300" /></Field>
        </div>
      </section>

      <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Transfer Configuration</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Pricing Model">
            <select name="pricing_model" defaultValue={t?.pricing_model ?? 'fixed'} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="fixed">Fixed</option>
              <option value="zone_based">Zone-based</option>
              <option value="distance_based">Distance-based</option>
            </select>
          </Field>
          <Field label="Vehicle Type">
            <select name="vehicle_type" defaultValue={t?.vehicle_type ?? 'sedan'} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="sedan">Sedan</option>
              <option value="minivan">Minivan</option>
              <option value="bus">Bus</option>
              <option value="luxury">Luxury</option>
            </select>
          </Field>
          <Field label="Max Passengers"><input name="max_passengers" type="number" defaultValue={t?.max_passengers ?? 4} min={1} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Max Luggage"><input name="max_luggage" type="number" defaultValue={t?.max_luggage ?? ''} min={0} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Includes Meet & Greet"><input name="includes_meet_greet" type="checkbox" defaultChecked={t?.includes_meet_greet} className="h-4 w-4 rounded border-gray-300" /></Field>
          <Field label="Includes Flight Tracking"><input name="includes_flight_tracking" type="checkbox" defaultChecked={t?.includes_flight_tracking} className="h-4 w-4 rounded border-gray-300" /></Field>
          <Field label="Base Fare"><input name="base_fare" type="number" step="0.01" defaultValue={t?.base_fare ?? ''} min="0" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Per KM Rate"><input name="per_km_rate" type="number" step="0.0001" defaultValue={t?.per_km_rate ?? ''} min="0" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Waiting Fee / Hour"><input name="waiting_fee_per_hour" type="number" step="0.01" defaultValue={t?.waiting_fee_per_hour ?? ''} min="0" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Notes" full><textarea name="notes" defaultValue={t?.notes ?? ''} rows={2} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
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
    <label className={"text-sm " + (full ? 'sm:col-span-3' : '')}>
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
  await updateTransfer(id, product as any, transfer as any)
}

function maybe(v: FormDataEntryValue | null): string | null { const s = v==null? '' : String(v); return s.trim()? s : null }

function ZoneMatrix({ transferId, zones, rows, baseCurrency }: { transferId: string; zones: Array<{ id: string; name: string }>; rows: any[]; baseCurrency: string }) {
  return (
    <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
      <h2 className="mb-3 text-lg font-semibold text-ink">Zone Pricing</h2>
      <form action={upsertZoneAction.bind(null, transferId)} className="grid gap-3 sm:grid-cols-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">From Zone</label>
          <select name="from_zone_id" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">To Zone</label>
          <select name="to_zone_id" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Vehicle</label>
          <select name="vehicle_type" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="">Any</option>
            <option value="sedan">Sedan</option>
            <option value="minivan">Minivan</option>
            <option value="bus">Bus</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Price ({baseCurrency})</label>
          <input type="number" name="price" step="0.01" min="0" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
        </div>
        <div className="flex items-end">
          <button className="rounded-lg border border-sand-300 px-3 py-2 text-sm">Add / Update</button>
        </div>
      </form>

      <div className="mt-4 overflow-hidden rounded-2xl border border-sand-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Vehicle</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t border-sand-100">
                <td className="px-4 py-2">{r.from_zone?.name}</td>
                <td className="px-4 py-2">{r.to_zone?.name}</td>
                <td className="px-4 py-2">{r.vehicle_type || 'Any'}</td>
                <td className="px-4 py-2">{baseCurrency} {Number(r.price).toFixed(2)}</td>
                <td className="px-4 py-2 text-right">
                  <form action={deleteZoneAction} className="inline">
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="transfer_id" value={transferId} />
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

async function upsertZoneAction(transferId: string, formData: FormData) {
  'use server'
  await upsertZonePrice({
    transfer_id: transferId,
    from_zone_id: String(formData.get('from_zone_id')),
    to_zone_id: String(formData.get('to_zone_id')),
    vehicle_type: (String(formData.get('vehicle_type')) || undefined) as any,
    price: Number(formData.get('price') || 0),
  })
}

async function deleteZoneAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const transferId = String(formData.get('transfer_id'))
  await deleteZonePrice(id, transferId)
}

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
  await uploadTransferImage(productId, file)
}

async function setCoverAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  await setTransferCoverImage(productId, mediaId)
}

async function deleteMediaAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  await deleteTransferMedia(productId, mediaId)
}

async function moveMediaAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  const direction = String(formData.get('direction')) as 'up'|'down'
  await moveTransferMedia(productId, mediaId, direction)
}

async function saveAltAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  const alt = String(formData.get('alt') || '')
  await updateTransferMediaAlt(productId, mediaId, alt)
}

async function reorderAction(productId: string, formData: FormData) {
  'use server'
  const ordered = String(formData.get('ordered_ids') || '').split(',').filter(Boolean)
  if (ordered.length) await reorderTransferMedia(productId, ordered)
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
          <select name="currency" className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            {['EUR','USD','GBP','MUR'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Price</label>
          <input name="price" type="number" step="0.01" min="0" className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
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
  await addTransferPriceOverride(productId, currency, price)
}

async function deleteOverrideAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const productId = String(formData.get('product_id'))
  await deleteTransferPriceOverride(id, productId)
}
