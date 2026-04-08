// =============================================================
// PRICE SNAPSHOT
//
// Freezes the resolved price at the moment of cart add.
// Once a price is snapshotted, it NEVER changes.
// Checkout totals are computed from snapshots, not live prices.
// =============================================================

import type { CartPriceSnapshot } from '@/types/database'
import type { ResolvedPrice } from './types'

export function createPriceSnapshot(
  product: {
    id: string
    title: string
    summary: string | null
    cover_image_url: string | null
  },
  resolved: ResolvedPrice,
): CartPriceSnapshot {
  return {
    product_title: product.title,
    base_price: resolved.base_amount,
    base_currency: resolved.base_currency,
    display_price: resolved.amount,
    display_currency: resolved.currency,
    exchange_rate: resolved.exchange_rate,
    override_used: resolved.is_override,
    product_summary: product.summary,
    cover_image_url: product.cover_image_url,
  }
}

// ---------------------------------------------------------------
// Compute the total from a set of cart item snapshots
// ---------------------------------------------------------------

export function computeCartTotal(
  items: Array<{ unit_price: number; quantity: number; currency: string }>,
): { total: number; currency: string } | null {
  if (items.length === 0) return null

  // All items in a session are in the same currency (enforced at cart add)
  const currency = items[0].currency
  const total = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0,
  )

  return { total: Math.round(total * 100) / 100, currency }
}

// ---------------------------------------------------------------
// Validate that all items in a cart use the same currency
// ---------------------------------------------------------------

export function assertConsistentCurrency(
  items: Array<{ currency: string }>,
): string {
  if (items.length === 0) throw new Error('Cart is empty')
  const currency = items[0].currency
  const inconsistent = items.find(i => i.currency !== currency)
  if (inconsistent) {
    throw new Error(
      `Currency mismatch in cart: expected ${currency}, found ${inconsistent.currency}`,
    )
  }
  return currency
}
