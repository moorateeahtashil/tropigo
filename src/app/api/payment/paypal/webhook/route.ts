import { NextRequest, NextResponse } from 'next/server'
import { recordPaypalCapture, getPaypalOrder } from '@/features/payment/paypal'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // For MVP: trust and record by order id after fetching capture status from capture endpoint is handled elsewhere.
  // Many deployments validate PayPal signatures with transmission headers; add that later.
  const body = await request.json().catch(()=>null)
  if (body?.resource?.id) {
    try {
      // Verify status by fetching the order
      const order = await getPaypalOrder(body.resource.id)
      if (order?.status === 'COMPLETED' || order?.status === 'APPROVED') {
        await recordPaypalCapture(order)
      }
      return NextResponse.json({ received: true })
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
  }
  return NextResponse.json({ received: true })
}
