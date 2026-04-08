import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getExchangeRate } from '@/features/pricing/convert'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const transferId = url.searchParams.get('transferId')
  const fromZone = url.searchParams.get('from')
  const toZone = url.searchParams.get('to')
  const vehicle = url.searchParams.get('vehicle')
  const currency = url.searchParams.get('currency') || 'EUR'
  if (!transferId || !fromZone || !toZone) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const supabase = createAdminClient()
  // Fetch base product and attempt zone price
  const [{ data: product }, { data: zonePrice }] = await Promise.all([
    supabase.from('products').select('id, base_currency, base_price').eq('id', transferId).single(),
    supabase
      .from('transfer_zone_prices')
      .select('price, vehicle_type')
      .eq('transfer_id', transferId)
      .eq('from_zone_id', fromZone)
      .eq('to_zone_id', toZone)
      .maybeSingle(),
  ])

  if (!product) return NextResponse.json({ error: 'Transfer not found' }, { status: 404 })

  let priceBase = zonePrice?.price ?? product.base_price ?? 0
  if (!priceBase || priceBase <= 0) return NextResponse.json({ error: 'No price available' }, { status: 400 })

  // Convert to requested currency
  let amount = priceBase
  let rate = 1
  if (product.base_currency !== currency) {
    const ex = await getExchangeRate(product.base_currency, currency)
    amount = Math.round(priceBase * ex.rate * 100) / 100
    rate = ex.rate
  }

  return NextResponse.json({
    amount,
    currency,
    base_amount: priceBase,
    base_currency: product.base_currency,
    exchange_rate: rate,
  })
}

