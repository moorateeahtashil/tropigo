// =============================================================
// PRICING RESOLUTION ENGINE
//
// Priority order (strict):
//   1. Manual admin override for the requested currency
//   2. Converted price: base_price × cached exchange rate
//   3. Base price in base currency (fallback, with currency mismatch flag)
// =============================================================

import { createClient } from '@/lib/supabase/server'
import { getExchangeRate } from './convert'
import type { ResolvedPrice } from './types'

// ---------------------------------------------------------------
// Resolve the display price for a single product + currency
// ---------------------------------------------------------------

export async function resolveProductPrice(
  productId: string,
  requestedCurrency: string,
): Promise<ResolvedPrice> {
  const supabase = await createClient()

  // Fetch the base product and any manual override in one query
  const [productResult, overrideResult] = await Promise.all([
    supabase
      .from('products')
      .select('base_price, base_currency')
      .eq('id', productId)
      .single(),
    supabase
      .from('product_pricing')
      .select('price')
      .eq('product_id', productId)
      .eq('currency', requestedCurrency)
      .maybeSingle(),
  ])

  if (productResult.error || !productResult.data) {
    throw new Error(`Product ${productId} not found`)
  }

  const { base_price, base_currency } = productResult.data

  // 1. Manual override
  if (overrideResult.data?.price != null) {
    return {
      amount: overrideResult.data.price,
      currency: requestedCurrency,
      base_amount: base_price ?? 0,
      base_currency,
      exchange_rate: 1,
      is_override: true,
      is_cached_rate: true,
    }
  }

  // No base price — return zero
  if (base_price == null) {
    return {
      amount: 0,
      currency: requestedCurrency,
      base_amount: 0,
      base_currency,
      exchange_rate: 1,
      is_override: false,
      is_cached_rate: true,
    }
  }

  // Same currency — no conversion needed
  if (base_currency === requestedCurrency) {
    return {
      amount: base_price,
      currency: requestedCurrency,
      base_amount: base_price,
      base_currency,
      exchange_rate: 1,
      is_override: false,
      is_cached_rate: true,
    }
  }

  // 2. Derived from exchange rate
  try {
    const { rate, isCached } = await getExchangeRate(base_currency, requestedCurrency)
    const converted = Math.round(base_price * rate * 100) / 100

    return {
      amount: converted,
      currency: requestedCurrency,
      base_amount: base_price,
      base_currency,
      exchange_rate: rate,
      is_override: false,
      is_cached_rate: isCached,
    }
  } catch {
    // 3. Fallback: return base price in base currency
    return {
      amount: base_price,
      currency: base_currency,
      base_amount: base_price,
      base_currency,
      exchange_rate: 1,
      is_override: false,
      is_cached_rate: false,
    }
  }
}

// ---------------------------------------------------------------
// Resolve prices for multiple products efficiently
// ---------------------------------------------------------------

export async function resolveProductPriceBatch(
  products: Array<{ id: string; base_price: number | null; base_currency: string }>,
  requestedCurrency: string,
): Promise<Map<string, ResolvedPrice>> {
  const supabase = await createClient()
  const result = new Map<string, ResolvedPrice>()

  if (products.length === 0) return result

  const productIds = products.map(p => p.id)

  // Fetch all overrides in one query
  const { data: overrides } = await supabase
    .from('product_pricing')
    .select('product_id, price')
    .in('product_id', productIds)
    .eq('currency', requestedCurrency)

  const overrideMap = new Map(overrides?.map(o => [o.product_id, o.price]) ?? [])

  // Determine which currencies we need rates for
  const currenciesNeeded = new Set(
    products
      .filter(p => p.base_currency !== requestedCurrency && !overrideMap.has(p.id))
      .map(p => p.base_currency),
  )

  const rateCache = new Map<string, number>()
  await Promise.all(
    Array.from(currenciesNeeded).map(async currency => {
      try {
        const { rate } = await getExchangeRate(currency, requestedCurrency)
        rateCache.set(currency, rate)
      } catch {
        // Rate unavailable — will fall back to base currency
      }
    }),
  )

  for (const product of products) {
    const override = overrideMap.get(product.id)

    if (override != null) {
      result.set(product.id, {
        amount: override,
        currency: requestedCurrency,
        base_amount: product.base_price ?? 0,
        base_currency: product.base_currency,
        exchange_rate: 1,
        is_override: true,
        is_cached_rate: true,
      })
      continue
    }

    if (product.base_price == null) {
      result.set(product.id, {
        amount: 0,
        currency: requestedCurrency,
        base_amount: 0,
        base_currency: product.base_currency,
        exchange_rate: 1,
        is_override: false,
        is_cached_rate: true,
      })
      continue
    }

    if (product.base_currency === requestedCurrency) {
      result.set(product.id, {
        amount: product.base_price,
        currency: requestedCurrency,
        base_amount: product.base_price,
        base_currency: product.base_currency,
        exchange_rate: 1,
        is_override: false,
        is_cached_rate: true,
      })
      continue
    }

    const rate = rateCache.get(product.base_currency)
    if (rate) {
      result.set(product.id, {
        amount: Math.round(product.base_price * rate * 100) / 100,
        currency: requestedCurrency,
        base_amount: product.base_price,
        base_currency: product.base_currency,
        exchange_rate: rate,
        is_override: false,
        is_cached_rate: true,
      })
    } else {
      // Fallback
      result.set(product.id, {
        amount: product.base_price,
        currency: product.base_currency,
        base_amount: product.base_price,
        base_currency: product.base_currency,
        exchange_rate: 1,
        is_override: false,
        is_cached_rate: false,
      })
    }
  }

  return result
}
