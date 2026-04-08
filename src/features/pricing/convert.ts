import { createAdminClient } from '@/lib/supabase/admin'
import type { ExchangeRatesMap } from './types'

const RATE_CACHE_MAX_AGE_HOURS = 12
const RATE_API_BASE_URL = 'https://open.er-api.com/v6/latest'

// ---------------------------------------------------------------
// Fetch rates from our DB cache first, then live API as fallback
// ---------------------------------------------------------------

export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
): Promise<{ rate: number; isCached: boolean; isStale: boolean }> {
  if (fromCurrency === toCurrency) {
    return { rate: 1, isCached: true, isStale: false }
  }

  const supabase = createAdminClient()

  const { data } = await supabase
    .from('currency_rates')
    .select('rate, fetched_at')
    .eq('from_currency', fromCurrency)
    .eq('to_currency', toCurrency)
    .single()

  if (data) {
    const ageHours = (Date.now() - new Date(data.fetched_at).getTime()) / 3_600_000
    const isStale = ageHours > RATE_CACHE_MAX_AGE_HOURS
    return { rate: data.rate, isCached: true, isStale }
  }

  // No cached rate — try live API
  const liveRate = await fetchLiveRate(fromCurrency, toCurrency)
  if (liveRate !== null) {
    await cacheRate(fromCurrency, toCurrency, liveRate, supabase)
    return { rate: liveRate, isCached: false, isStale: false }
  }

  // Could not obtain rate
  throw new Error(`No exchange rate available for ${fromCurrency} → ${toCurrency}`)
}

export async function getAllRatesFrom(baseCurrency: string): Promise<ExchangeRatesMap> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('currency_rates')
    .select('to_currency, rate')
    .eq('from_currency', baseCurrency)

  const ratesMap: ExchangeRatesMap = { [baseCurrency]: 1 }
  if (data) {
    for (const row of data) {
      ratesMap[row.to_currency] = row.rate
    }
  }

  return ratesMap
}

// ---------------------------------------------------------------
// Refresh rates from live API — called by cron every 6h
// ---------------------------------------------------------------

export async function refreshAllRates(
  supportedCurrencies: string[],
  baseCurrency = 'EUR',
): Promise<void> {
  const supabase = createAdminClient()

  const response = await fetch(`${RATE_API_BASE_URL}/${baseCurrency}`)
  if (!response.ok) {
    throw new Error(`Rate API error: ${response.status}`)
  }

  const json = await response.json() as { rates: Record<string, number> }
  const rates = json.rates

  const upserts = supportedCurrencies
    .filter(c => c !== baseCurrency && rates[c])
    .map(c => ({
      from_currency: baseCurrency,
      to_currency: c,
      rate: rates[c],
      fetched_at: new Date().toISOString(),
    }))

  // Also store reverse rates for convenience
  for (const currency of supportedCurrencies) {
    if (currency === baseCurrency || !rates[currency]) continue
    upserts.push({
      from_currency: currency,
      to_currency: baseCurrency,
      rate: 1 / rates[currency],
      fetched_at: new Date().toISOString(),
    })
  }

  // Cross-rates
  for (const from of supportedCurrencies) {
    for (const to of supportedCurrencies) {
      if (from === to || from === baseCurrency || to === baseCurrency) continue
      if (!rates[from] || !rates[to]) continue
      upserts.push({
        from_currency: from,
        to_currency: to,
        rate: rates[to] / rates[from],
        fetched_at: new Date().toISOString(),
      })
    }
  }

  await supabase
    .from('currency_rates')
    .upsert(upserts, { onConflict: 'from_currency,to_currency' })
}

// ---------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------

async function fetchLiveRate(from: string, to: string): Promise<number | null> {
  try {
    const response = await fetch(`${RATE_API_BASE_URL}/${from}`)
    if (!response.ok) return null
    const json = await response.json() as { rates: Record<string, number> }
    return json.rates[to] ?? null
  } catch {
    return null
  }
}

async function cacheRate(
  from: string,
  to: string,
  rate: number,
  supabase: ReturnType<typeof createAdminClient>,
): Promise<void> {
  await supabase
    .from('currency_rates')
    .upsert(
      { from_currency: from, to_currency: to, rate, fetched_at: new Date().toISOString() },
      { onConflict: 'from_currency,to_currency' },
    )
}
