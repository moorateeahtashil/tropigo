import { getSettings, updateSettings } from './actions'

export default async function SettingsPage() {
  const s = await getSettings()
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Settings</h1>
      <form action={saveAction} className="space-y-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <label className="block text-sm"><span className="mb-1 block">Brand Name</span><input name="brand_name" defaultValue={s?.brand_name || ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Contact Email</span><input name="contact_email" defaultValue={s?.contact_email || ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
          <label className="block text-sm"><span className="mb-1 block">Contact Phone</span><input name="contact_phone" defaultValue={s?.contact_phone || ''} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Supported Currencies (comma-separated)</span><input name="supported_currencies" defaultValue={(s?.supported_currencies || []).join(',')} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
          <label className="block text-sm"><span className="mb-1 block">Default Currency</span><input name="default_currency" defaultValue={s?.default_currency || 'EUR'} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        </div>
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Save</button>
      </form>
    </div>
  )
}

async function saveAction(formData: FormData) {
  'use server'
  const brand_name = String(formData.get('brand_name') || '')
  const contact_email = String(formData.get('contact_email') || '')
  const contact_phone = String(formData.get('contact_phone') || '')
  const supported_currencies = String(formData.get('supported_currencies') || '').split(',').map(s=>s.trim()).filter(Boolean)
  const default_currency = String(formData.get('default_currency') || 'EUR')
  await updateSettings({ brand_name, contact_email, contact_phone, supported_currencies, default_currency })
}

