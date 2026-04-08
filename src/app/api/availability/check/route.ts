import { NextRequest, NextResponse } from 'next/server'
import { assertAvailable } from '@/features/booking/availability'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const productId = url.searchParams.get('productId')
  const date = url.searchParams.get('date') || undefined
  const time = url.searchParams.get('time') || undefined
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  try {
    await assertAvailable(productId, date, time)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}

