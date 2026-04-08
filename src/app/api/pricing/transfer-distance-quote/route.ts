import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getExchangeRate } from '@/features/pricing/convert'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const transferId = url.searchParams.get('transferId')
  const distanceKm = Number(url.searchParams.get('distance') || 0)
  const currency = url.searchParams.get('currency') || 'EUR'
  if (!transferId || !distanceKm) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const supabase = createAdminClient()
  const { data: transfer } = await supabase
    .from('products')
    .select('id, base_currency, airport_transfers(base_fare, per_km_rate)')
    .eq('id', transferId)
    .single()

  if (!transfer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const at = transfer.airport_transfers?.[0] || {}
  const baseFare = at.base_fare ?? 0
  const perKm = at.per_km_rate ?? 0
  const priceBase = Math.max(0, (baseFare + perKm * distanceKm))

  let amount = priceBase
  let rate = 1
  if (transfer.base_currency !== currency) {
    const ex = await getExchangeRate(transfer.base_currency, currency)
    amount = Math.round(priceBase * ex.rate * 100) / 100
    rate = ex.rate
  }

  return NextResponse.json({ amount, currency, base_amount: priceBase, base_currency: transfer.base_currency, exchange_rate: rate })
}

