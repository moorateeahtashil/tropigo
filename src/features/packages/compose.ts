import { createClient } from '@/lib/supabase/server'
import { resolveProductPriceBatch } from '@/features/pricing/resolve'
import type { PackageItemRow, ProductRow, PackageRow } from '@/types/database'

export interface PackageItemWithProduct extends PackageItemRow {
  product: ProductRow & { cover_image_url: string | null }
}

export interface ComposedPackage {
  package: PackageRow
  items: PackageItemWithProduct[]
  /** Resolved total in the requested currency */
  computed_total: number
  /** Final display price after discount */
  final_price: number
  currency: string
  savings: number
}

// ---------------------------------------------------------------
// Compose a package: resolve all item prices and compute the total
// ---------------------------------------------------------------

export async function composePackage(
  packageProductId: string,
  displayCurrency: string,
  selectedItemIds?: string[], // IDs of selected optional items
): Promise<ComposedPackage | null> {
  const supabase = await createClient()

  // Fetch the package extension data
  const { data: pkg } = await supabase
    .from('packages')
    .select('*')
    .eq('product_id', packageProductId)
    .single()

  if (!pkg) return null

  // Fetch all package items with their products
  const { data: rawItems } = await supabase
    .from('package_items')
    .select(`
      *,
      product:products!product_id(
        id, title, summary, slug, base_price, base_currency, product_type, status,
        product_media(url, is_cover)
      )
    `)
    .eq('package_id', packageProductId)
    .order('sort_order', { ascending: true })

  if (!rawItems) return null

  // Filter to included items (mandatory + selected optional)
  const activeItems = rawItems.filter(item => {
    if (!item.is_optional) return true
    if (selectedItemIds) return selectedItemIds.includes(item.product_id)
    return item.is_default_selected
  })

  // Build product list for batch price resolution
  const productsForPricing = activeItems.map(item => {
    const product = item.product as ProductRow & { product_media: Array<{ url: string; is_cover: boolean }> }
    return {
      id: product.id,
      base_price: item.price_override ?? product.base_price,
      base_currency: product.base_currency,
    }
  })

  const priceMap = await resolveProductPriceBatch(productsForPricing, displayCurrency)

  let computedTotal = 0
  const items: PackageItemWithProduct[] = []

  for (const item of activeItems) {
    const product = item.product as ProductRow & { product_media: Array<{ url: string; is_cover: boolean }> }
    const resolved = priceMap.get(product.id)
    const coverUrl = product.product_media?.find(m => m.is_cover)?.url
      ?? product.product_media?.[0]?.url
      ?? null

    const lineTotal = (resolved?.amount ?? 0) * item.quantity
    computedTotal += lineTotal

    items.push({
      ...item,
      product: { ...product as unknown as ProductRow, cover_image_url: coverUrl },
    })
  }

  // Apply package-level pricing mode
  const packageData = pkg as PackageRow
  let finalPrice = computedTotal
  let savings = 0

  if (packageData.pricing_mode === 'fixed' && packageProductId) {
    // For fixed mode, fetch the package product's own base_price
    const { data: pProduct } = await supabase
      .from('products')
      .select('base_price')
      .eq('id', packageProductId)
      .single()

    if (pProduct?.base_price != null) {
      finalPrice = pProduct.base_price
      savings = Math.max(0, computedTotal - finalPrice)
    }
  } else if (packageData.pricing_mode === 'computed_with_discount') {
    const discount = packageData.discount_percent / 100
    finalPrice = computedTotal * (1 - discount)
    savings = computedTotal - finalPrice
  }

  finalPrice = Math.round(finalPrice * 100) / 100
  savings = Math.round(savings * 100) / 100

  return {
    package: packageData,
    items,
    computed_total: Math.round(computedTotal * 100) / 100,
    final_price: finalPrice,
    currency: displayCurrency,
    savings,
  }
}
