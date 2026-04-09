import { listCurrencyRates, refreshRatesAction, getSupportedCurrencies, updateCurrencyRate } from './actions'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function PricingPage() {
  const [rates, supported] = await Promise.all([listCurrencyRates(), getSupportedCurrencies()])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Pricing & Currencies</h1>
          <p className="text-ink-secondary">Manage exchange rates and supported currencies.</p>
        </div>
        <form action={refreshRatesAction}>
          <button className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-800">Refresh Live Rates</button>
        </form>
      </div>

      {/* Supported Currencies */}
      <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Supported Currencies</h2>
        <div className="flex flex-wrap gap-2">
          {supported.map((c: string) => (
            <span key={c} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">{c}</span>
          ))}
        </div>
      </div>

      {/* Currency Rates Table */}
      <div className="rounded-2xl border border-sand-200 bg-white shadow-card">
        <div className="border-b border-sand-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-ink">Exchange Rates</h2>
          <p className="text-sm text-ink-secondary">Click any rate to edit it manually.</p>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">To</th>
              <th className="px-4 py-3">Rate</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r: any) => (
              <tr key={`${r.from_currency}-${r.to_currency}`} className="border-t border-sand-100">
                <td className="px-4 py-3 font-medium text-ink">{r.from_currency}</td>
                <td className="px-4 py-3 text-ink">{r.to_currency}</td>
                <td className="px-4 py-3 font-mono text-ink">{Number(r.rate).toFixed(6)}</td>
                <td className="px-4 py-3 text-ink-secondary text-xs">{new Date(r.fetched_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <RateEditForm rateId={r.id} currentRate={Number(r.rate)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RateEditForm({ rateId, currentRate }: { rateId: string; currentRate: number }) {
  return (
    <form action={handleUpdateRate} className="flex items-center gap-2 justify-end">
      <input type="hidden" name="id" value={rateId} />
      <input
        type="number"
        name="rate"
        step="0.000001"
        defaultValue={currentRate}
        className="w-28 rounded-lg border border-sand-200 bg-white px-3 py-1.5 text-sm font-mono focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <button type="submit" className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700">
        Update
      </button>
    </form>
  )
}

async function handleUpdateRate(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const rate = Number(formData.get('rate'))
  if (!id || isNaN(rate) || rate <= 0) return
  await updateCurrencyRate(id, rate)
  redirect('/admin/pricing?toast=success&toast_title=Rate+updated')
}
