import { NextRequest, NextResponse } from 'next/server'
import { getBookingStatus } from '@/features/booking/checkout'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const ref = url.searchParams.get('ref')
  const email = url.searchParams.get('email')
  if (!ref || !email) return NextResponse.json({ error: 'Missing ref or email' }, { status: 400 })
  const status = await getBookingStatus(ref, email)
  if (!status) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(status)
}

