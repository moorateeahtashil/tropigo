import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { addCartItem, getCartItems, removeCartItem, updateCartItemQuantity } from '@/features/booking/cart'
import type { ProductType } from '@/types/database'

export const runtime = 'nodejs'

function requireSessionId() {
  const cookieName = 'tropigo_session_id'
  return cookies().then(store => store.get(cookieName)?.value || null)
}

export async function GET() {
  const sessionId = await requireSessionId()
  if (!sessionId) return NextResponse.json({ items: [] })
  const items = await getCartItems(sessionId)
  return NextResponse.json({ items })
}

export async function POST(request: NextRequest) {
  const sessionId = await requireSessionId()
  if (!sessionId) return NextResponse.json({ error: 'No booking session' }, { status: 400 })

  const body = await request.json()
  const { productId, productType, quantity, currency, bookingDate, bookingTime, specialRequirements } = body as {
    productId: string
    productType: ProductType
    quantity: number
    currency: string
    bookingDate?: string
    bookingTime?: string
    specialRequirements?: string
  }

  if (!productId || !productType || !quantity || !currency) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const item = await addCartItem({
    sessionId,
    productId,
    productType,
    quantity,
    currency,
    bookingDate,
    bookingTime,
    specialRequirements,
  })

  return NextResponse.json({ item })
}

export async function PATCH(request: NextRequest) {
  const sessionId = await requireSessionId()
  if (!sessionId) return NextResponse.json({ error: 'No booking session' }, { status: 400 })

  const body = await request.json()
  const { itemId, quantity } = body as { itemId: string; quantity: number }
  if (!itemId || !quantity) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  await updateCartItemQuantity(itemId, sessionId, quantity)
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const sessionId = await requireSessionId()
  if (!sessionId) return NextResponse.json({ error: 'No booking session' }, { status: 400 })

  const url = new URL(request.url)
  const itemId = url.searchParams.get('itemId')
  if (!itemId) return NextResponse.json({ error: 'Missing itemId' }, { status: 400 })
  await removeCartItem(itemId, sessionId)
  return NextResponse.json({ ok: true })
}

