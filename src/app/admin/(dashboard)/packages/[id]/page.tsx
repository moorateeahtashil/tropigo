import { getPackageProduct, updatePackage, listCatalogProducts, addPackageItem, updatePackageItem, movePackageItem, deletePackageItem, uploadPackageImage, setPackageCoverImage, deletePackageMedia, movePackageMedia, reorderPackageMedia, updatePackageMediaAlt, addPackagePriceOverride, deletePackagePriceOverride } from '../actions'

export default async function EditPackage({ params }: { params: { id: string } }) {
  const [row, catalog] = await Promise.all([
    getPackageProduct(params.id),
    listCatalogProducts(),
  ])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Edit Package</h1>
      <PackageForm row={row} />
      <GalleryManager row={row} />
      <PricingOverrides row={row} />
      <Composer packageId={row.id} items={row.package_items || []} catalog={catalog} baseCurrency={row.base_currency} />
    </div>
  )
}

function PackageForm({ row }: { row: any }) {
  const p = row.packages
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
          <Field label="Base Price (optional)"><input name="base_price" type="number" step="0.01" defaultValue={row.base_price ?? ''} min="0" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
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
        <h2 className="mb-3 text-lg font-semibold text-ink">Package Settings</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Pricing Mode">
            <select name="pricing_mode" defaultValue={p?.pricing_mode ?? 'computed'} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="fixed">Fixed</option>
              <option value="computed">Computed</option>
              <option value="computed_with_discount">Computed with Discount</option>
            </select>
          </Field>
          <Field label="Discount %"><input name="discount_percent" type="number" min="0" max="100" defaultValue={p?.discount_percent ?? 0} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Duration (days)"><input name="duration_days" type="number" min="1" defaultValue={p?.duration_days ?? ''} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Highlights (comma-separated)" full><input name="highlights" defaultValue={(p?.highlights || []).join(', ')} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
          <Field label="Important Notes" full><textarea name="important_notes" defaultValue={p?.important_notes || ''} rows={2} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></Field>
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
  await updatePackage(id, product as any, pkg as any)
}

function maybe(v: FormDataEntryValue | null): string | null { const s = v==null? '' : String(v); return s.trim()? s : null }
function splitCSV(v: FormDataEntryValue | null): string[] { const s = v==null? '' : String(v); return s.split(',').map(t=>t.trim()).filter(Boolean) }

function Composer({ packageId, items, catalog, baseCurrency }: { packageId: string; items: any[]; catalog: any[]; baseCurrency: string }) {
  return (
    <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
      <h2 className="mb-3 text-lg font-semibold text-ink">Package Items</h2>
      <form action={addItemAction.bind(null, packageId)} className="grid gap-3 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label className="mb-1 block text-sm font-medium text-ink">Product</label>
          <select name="product_id" className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required>
            {catalog.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.product_type})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Qty</label>
          <input name="quantity" type="number" min={1} defaultValue={1} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Price Override ({baseCurrency})</label>
          <input name="price_override" type="number" step="0.01" min={0} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
        </div>
        <div className="flex items-end gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_optional" className="h-4 w-4 rounded border-gray-300" /> Optional</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_default_selected" defaultChecked className="h-4 w-4 rounded border-gray-300" /> Default</label>
        </div>
        <div className="flex items-end">
          <button className="rounded-lg border border-sand-300 px-3 py-2 text-sm">Add Item</button>
        </div>
      </form>

      <div className="mt-4 overflow-hidden rounded-2xl border border-sand-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Override</th>
              <th className="px-4 py-2">Flags</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.sort((a:any,b:any)=>a.sort_order-b.sort_order).map((i: any) => (
              <tr key={i.id} className="border-t border-sand-100">
                <td className="px-4 py-2">
                  <div className="font-medium text-ink">{i.product?.title}</div>
                  <div className="text-xs text-ink-muted">{i.product?.product_type} • {i.product?.base_currency} {i.product?.base_price ?? '—'}</div>
                </td>
                <td className="px-4 py-2">
                  <form action={updateItemAction}>
                    <input type="hidden" name="item_id" value={i.id} />
                    <input type="hidden" name="package_id" value={packageId} />
                    <input name="quantity" type="number" min={1} defaultValue={i.quantity} className="w-20 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    <button className="ml-2 rounded-lg border border-sand-300 px-2 py-1 text-xs">Save</button>
                  </form>
                </td>
                <td className="px-4 py-2">
                  <form action={updateItemAction}>
                    <input type="hidden" name="item_id" value={i.id} />
                    <input type="hidden" name="package_id" value={packageId} />
                    <input name="price_override" type="number" step="0.01" min={0} defaultValue={i.price_override ?? ''} className="w-28 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    <button className="ml-2 rounded-lg border border-sand-300 px-2 py-1 text-xs">Save</button>
                  </form>
                </td>
                <td className="px-4 py-2">
                  <form action={updateItemAction} className="flex items-center gap-3">
                    <input type="hidden" name="item_id" value={i.id} />
                    <input type="hidden" name="package_id" value={packageId} />
                    <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="is_optional" defaultChecked={i.is_optional} className="h-4 w-4 rounded border-gray-300" /> Optional</label>
                    <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="is_default_selected" defaultChecked={i.is_default_selected} className="h-4 w-4 rounded border-gray-300" /> Default</label>
                    <button className="rounded-lg border border-sand-300 px-2 py-1 text-xs">Save</button>
                  </form>
                </td>
                <td className="px-4 py-2 text-right">
                  <form action={moveItemAction} className="inline">
                    <input type="hidden" name="package_id" value={packageId} />
                    <input type="hidden" name="item_id" value={i.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button title="Move up">↑</button>
                  </form>
                  <form action={moveItemAction} className="inline ml-2">
                    <input type="hidden" name="package_id" value={packageId} />
                    <input type="hidden" name="item_id" value={i.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button title="Move down">↓</button>
                  </form>
                  <form action={deleteItemAction} className="inline ml-3">
                    <input type="hidden" name="package_id" value={packageId} />
                    <input type="hidden" name="item_id" value={i.id} />
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

async function addItemAction(packageId: string, formData: FormData) {
  'use server'
  await addPackageItem({
    package_id: packageId,
    product_id: String(formData.get('product_id')),
    quantity: Number(formData.get('quantity') || 1) || 1,
    price_override: (formData.get('price_override') ? Number(formData.get('price_override')) : null) as any,
    is_optional: formData.get('is_optional') === 'on',
    is_default_selected: formData.get('is_default_selected') === 'on',
    notes: null,
  })
}

async function updateItemAction(formData: FormData) {
  'use server'
  const itemId = String(formData.get('item_id'))
  const packageId = String(formData.get('package_id'))
  const patch: any = {}
  if (formData.has('quantity')) patch.quantity = Number(formData.get('quantity') || 1) || 1
  if (formData.has('price_override')) patch.price_override = (formData.get('price_override') ? Number(formData.get('price_override')) : null)
  if (formData.has('is_optional')) patch.is_optional = formData.get('is_optional') === 'on'
  if (formData.has('is_default_selected')) patch.is_default_selected = formData.get('is_default_selected') === 'on'
  await updatePackageItem(itemId, patch)
  // revalidate path handled in actions where appropriate (move, delete), but not for generic update; it's fine to rely on navigation re-render for now
}

async function moveItemAction(formData: FormData) {
  'use server'
  const packageId = String(formData.get('package_id'))
  const itemId = String(formData.get('item_id'))
  const direction = String(formData.get('direction')) as 'up'|'down'
  await movePackageItem(packageId, itemId, direction)
}

async function deleteItemAction(formData: FormData) {
  'use server'
  const packageId = String(formData.get('package_id'))
  const itemId = String(formData.get('item_id'))
  await deletePackageItem(itemId, packageId)
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

function ReorderHint() {
  return (
    <p className="mb-3 text-xs text-ink-muted">Tip: drag images to reorder, then click “Save order”.</p>
  )
}

async function uploadAction(productId: string, formData: FormData) {
  'use server'
  const file = formData.get('image') as File | null
  if (!file) return
  await uploadPackageImage(productId, file)
}

async function setCoverAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  await setPackageCoverImage(productId, mediaId)
}

async function deleteMediaAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  await deletePackageMedia(productId, mediaId)
}

async function moveMediaAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  const direction = String(formData.get('direction')) as 'up'|'down'
  await movePackageMedia(productId, mediaId, direction)
}

async function reorderAction(productId: string, formData: FormData) {
  'use server'
  const ordered = String(formData.get('ordered_ids') || '').split(',').filter(Boolean)
  if (ordered.length) await reorderPackageMedia(productId, ordered)
}

async function saveAltAction(formData: FormData) {
  'use server'
  const productId = String(formData.get('product_id'))
  const mediaId = String(formData.get('media_id'))
  const alt = String(formData.get('alt') || '')
  await updatePackageMediaAlt(productId, mediaId, alt)
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
  await addPackagePriceOverride(productId, currency, price)
}

async function deleteOverrideAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const productId = String(formData.get('product_id'))
  await deletePackagePriceOverride(id, productId)
}
