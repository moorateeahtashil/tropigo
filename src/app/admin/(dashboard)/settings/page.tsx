import { getSettings, updateSettings } from './actions'
import { Input, Textarea } from '@/components/ui/input'

export default async function SettingsPage() {
  const s = await getSettings()
  const socials = (s as any)?.socials || {}
  const address = (s as any)?.address || {}

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Configure your site-wide settings.</p>
      </div>

      <form action={saveAction} className="space-y-6">
        {/* Branding */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Branding</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Brand Name" name="brand_name" defaultValue={s?.brand_name || ''} required />
            <Input label="Tagline" name="tagline" defaultValue={(s as any)?.tagline || ''} />
            <Input label="Logo URL" name="logo_url" defaultValue={(s as any)?.logo_url || ''} placeholder="https://..." />
            <Input label="Favicon URL" name="favicon_url" defaultValue={(s as any)?.favicon_url || ''} placeholder="https://..." />
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Contact Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Contact Email" name="contact_email" type="email" defaultValue={s?.contact_email || ''} />
            <Input label="Contact Phone" name="contact_phone" defaultValue={s?.contact_phone || ''} />
            <Input label="WhatsApp Number" name="whatsapp" defaultValue={(s as any)?.whatsapp || ''} placeholder="+230..." />
            <div />
          </div>
        </div>

        {/* Address */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Business Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Street" name="address_street" defaultValue={address.street || ''} />
            <Input label="City" name="address_city" defaultValue={address.city || ''} />
            <Input label="Region / State" name="address_region" defaultValue={address.region || ''} />
            <Input label="Country" name="address_country" defaultValue={address.country || ''} />
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Social Media</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Instagram URL" name="social_instagram" defaultValue={socials.instagram || ''} placeholder="https://instagram.com/..." />
            <Input label="Facebook URL" name="social_facebook" defaultValue={socials.facebook || ''} placeholder="https://facebook.com/..." />
            <Input label="Twitter / X URL" name="social_twitter" defaultValue={socials.twitter || ''} placeholder="https://x.com/..." />
            <Input label="TripAdvisor URL" name="social_tripadvisor" defaultValue={socials.tripadvisor || ''} placeholder="https://tripadvisor.com/..." />
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">SEO Defaults</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Default SEO Title" name="default_seo_title" defaultValue={(s as any)?.default_seo_title || ''} />
            <Input label="Default SEO Description" name="default_seo_description" defaultValue={(s as any)?.default_seo_description || ''} />
            <Input label="Default OG Image URL" name="default_og_image_url" defaultValue={(s as any)?.default_og_image_url || ''} placeholder="https://..." />
            <Input label="Google Analytics (GA4) ID" name="ga4_id" defaultValue={(s as any)?.ga4_id || ''} placeholder="G-XXXXXXXXXX" />
          </div>
        </div>

        {/* Currencies */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Currencies</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Supported Currencies (comma-separated)" name="supported_currencies" defaultValue={(s?.supported_currencies || []).join(', ')} placeholder="EUR, USD, GBP, MUR" />
            <Input label="Default Currency" name="default_currency" defaultValue={s?.default_currency || 'EUR'} />
          </div>
        </div>

        {/* Maintenance */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">System</h2>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="maintenance_mode"
              defaultChecked={(s as any)?.maintenance_mode || false}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">Maintenance Mode (shows offline page to visitors)</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}

async function saveAction(formData: FormData) {
  'use server'
  const settings = {
    brand_name: String(formData.get('brand_name') || ''),
    tagline: String(formData.get('tagline') || ''),
    logo_url: String(formData.get('logo_url') || ''),
    favicon_url: String(formData.get('favicon_url') || ''),
    contact_email: String(formData.get('contact_email') || ''),
    contact_phone: String(formData.get('contact_phone') || ''),
    whatsapp: String(formData.get('whatsapp') || ''),
    address: {
      street: String(formData.get('address_street') || ''),
      city: String(formData.get('address_city') || ''),
      region: String(formData.get('address_region') || ''),
      country: String(formData.get('address_country') || ''),
    },
    socials: {
      instagram: String(formData.get('social_instagram') || ''),
      facebook: String(formData.get('social_facebook') || ''),
      twitter: String(formData.get('social_twitter') || ''),
      tripadvisor: String(formData.get('social_tripadvisor') || ''),
    },
    default_seo_title: String(formData.get('default_seo_title') || ''),
    default_seo_description: String(formData.get('default_seo_description') || ''),
    default_og_image_url: String(formData.get('default_og_image_url') || ''),
    ga4_id: String(formData.get('ga4_id') || ''),
    supported_currencies: String(formData.get('supported_currencies') || 'EUR,USD,GBP,MUR').split(',').map(s => s.trim()).filter(Boolean),
    default_currency: String(formData.get('default_currency') || 'EUR'),
    maintenance_mode: formData.get('maintenance_mode') === 'on',
  }
  await updateSettings(settings)
}
