import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { resolveProductPrice } from '@/features/pricing/resolve'
import { createPriceSnapshot, computeCartTotal } from '@/features/pricing/snapshot'
import { assertAvailable } from '@/features/booking/availability'
import type { CartItemRow, ProductType } from '@/types/database'

// ---------------------------------------------------------------
// Add an item to the cart (freezes price at add time)
// ---------------------------------------------------------------

export async function addCartItem(params: {
  sessionId: string
  productId: string
  productType: ProductType
  quantity: number
  currency: string
  bookingDate?: string
  bookingTime?: string
  specialRequirements?: string
  overrideUnitPrice?: number
  overrideExchangeRate?: number
  transferMeta?: Record<string, unknown>
}): Promise<CartItemRow> {
  const supabase = createAdminClient()

  // Fetch product details for snapshot
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, title, summary, status, base_currency, base_price')
    .eq('id', params.productId)
    .eq('status', 'published')
    .single()

  if (productError || !product) {
    throw new Error(`Product ${params.productId} not found or not published`)
  }

  // Availability checks for dated products (activities primarily)
  if (params.productType === 'activity') {
    await assertAvailable(params.productId, params.bookingDate ?? undefined, params.bookingTime ?? undefined)
  }

  // Fetch cover image
  const { data: coverMedia } = await supabase
    .from('product_media')
    .select('url')
    .eq('product_id', params.productId)
    .eq('is_cover', true)
    .maybeSingle()

  // Resolve price: allow override (e.g., transfer zone price), otherwise resolve per pricing engine
  const resolved = params.overrideUnitPrice != null && params.overrideExchangeRate != null
    ? {
        amount: params.overrideUnitPrice,
        currency: params.currency,
        base_amount: product.base_price ?? 0,
        base_currency: product.base_currency,
        exchange_rate: params.overrideExchangeRate,
        is_override: true,
        is_cached_rate: true,
      }
    : await resolveProductPrice(params.productId, params.currency)

  // Create immutable price snapshot
  const snapshot = createPriceSnapshot(
    {
      id: product.id,
      title: product.title,
      summary: product.summary,
      cover_image_url: coverMedia?.url ?? null,
    },
    resolved,
  )
  if (params.transferMeta) {
    ;(snapshot as any).transfer_details = params.transferMeta
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      session_id: params.sessionId,
      product_id: params.productId,
      product_type: params.productType,
      quantity: params.quantity,
      unit_price: resolved.amount,
      currency: resolved.currency,
      exchange_rate: resolved.exchange_rate,
      price_snapshot: snapshot,
      booking_date: params.bookingDate ?? null,
      booking_time: params.bookingTime ?? null,
      special_requirements: params.specialRequirements ?? null,
    })
    .select()
    .single()

  if (error || !data) {
    throw new Error(`Failed to add cart item: ${error?.message}`)
  }

  return data as CartItemRow
}

// ---------------------------------------------------------------
// Remove an item from the cart
// ---------------------------------------------------------------

export async function removeCartItem(itemId: string, sessionId: string): Promise<void> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('session_id', sessionId) // ensures ownership

  if (error) throw new Error(`Failed to remove cart item: ${error.message}`)
}

// ---------------------------------------------------------------
// Update item quantity
// ---------------------------------------------------------------

export async function updateCartItemQuantity(
  itemId: string,
  sessionId: string,
  quantity: number,
): Promise<void> {
  if (quantity < 1) throw new Error('Quantity must be at least 1')

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('session_id', sessionId)

  if (error) throw new Error(`Failed to update cart item: ${error.message}`)
}

// ---------------------------------------------------------------
// Get all cart items for a session
// ---------------------------------------------------------------

export async function getCartItems(sessionId: string): Promise<CartItemRow[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(`Failed to fetch cart: ${error.message}`)

  return (data ?? []) as CartItemRow[]
}

// ---------------------------------------------------------------
// Get cart total from frozen snapshots
// ---------------------------------------------------------------

export async function getCartTotal(sessionId: string) {
  const items = await getCartItems(sessionId)
  return computeCartTotal(items)
}

// ---------------------------------------------------------------
// Clear an entire cart
// ---------------------------------------------------------------

export async function clearCart(sessionId: string): Promise<void> {
  const supabase = createAdminClient()

  await supabase
    .from('cart_items')
    .delete()
    .eq('session_id', sessionId)
}
