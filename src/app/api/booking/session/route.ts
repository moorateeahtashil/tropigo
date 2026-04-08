import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createBookingSession, getBookingSession } from '@/features/booking/session'

export const runtime = 'nodejs'

function getCookieName() {
  return 'tropigo_session_id'
}

async function ensureSession(request: NextRequest, preferredCurrency?: string) {
  const cookieStore = await cookies()
  const cookieName = getCookieName()
  const existing = cookieStore.get(cookieName)?.value

  if (existing) {
    const session = await getBookingSession(existing)
    if (session) {
      return session
    }
  }

  const currency = preferredCurrency || 'EUR'
  const session = await createBookingSession({ currency })
  cookieStore.set({ name: cookieName, value: session.id, path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 2 })
  return session
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const currency = url.searchParams.get('currency') || undefined
  const session = await ensureSession(request, currency)
  return NextResponse.json({ session })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { currency?: string }
  const session = await ensureSession(request, body.currency)
  return NextResponse.json({ session })
}

