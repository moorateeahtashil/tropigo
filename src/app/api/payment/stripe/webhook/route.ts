import { NextRequest, NextResponse } from 'next/server'
import { processStripeWebhook } from '@/features/payment/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// We need the raw body for Stripe signature verification
export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  const rawBody = await request.text()

  try {
    const result = await processStripeWebhook(rawBody, signature)
    return NextResponse.json({ received: true, ...result })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}

