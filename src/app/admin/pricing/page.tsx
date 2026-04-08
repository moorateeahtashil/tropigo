import { listCurrencyRates, refreshRatesAction, getSupportedCurrencies } from './actions'

export default async function PricingPage() {
  const [rates, supported] = await Promise.all([listCurrencyRates(), getSupportedCurrencies()])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Pricing & Currencies</h1>
        <form action={refreshRatesAction}>
          <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Refresh Live Rates</button>
        </form>
      </div>
      <div className="rounded-2xl border border-sand-200 bg-white p-4 shadow-card">
        <h2 className="mb-2 font-semibold text-ink">Supported</h2>
        <div className="text-sm text-ink">{supported.join(', ')}</div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Rate</th>
              <th className="px-4 py-2">Fetched At</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r:any)=> (
              <tr key={`${r.from_currency}-${r.to_currency}`} className="border-t border-sand-100">
                <td className="px-4 py-2">{r.from_currency}</td>
                <td className="px-4 py-2">{r.to_currency}</td>
                <td className="px-4 py-2">{Number(r.rate).toFixed(6)}</td>
                <td className="px-4 py-2">{new Date(r.fetched_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

