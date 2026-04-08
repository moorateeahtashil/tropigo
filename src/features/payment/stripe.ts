import { stripe, toStripeCurrency, toStripeAmount, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'
import { resend, EMAIL_FROM, EMAIL_REPLY_TO } from '@/lib/resend/resend'

// ---------------------------------------------------------------
// Create a Stripe Checkout Session for a pending booking
// ---------------------------------------------------------------

export async function createStripeCheckoutSession(params: {
  bookingId: string
  bookingRef: string
  amount: number
  currency: string
  customerEmail: string
  productTitle: string
  successUrl: string
  cancelUrl: string
}): Promise<{ url: string; sessionId: string }> {
  const supabase = createAdminClient()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: toStripeCurrency(params.currency),
          unit_amount: toStripeAmount(params.amount, params.currency),
          product_data: {
            name: params.productTitle,
            description: `Booking Reference: ${params.bookingRef}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      booking_id: params.bookingId,
      booking_ref: params.bookingRef,
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min expiry
  })

  if (!session.url) {
    throw new Error('Stripe did not return a session URL')
  }

  // Record the pending payment
  await supabase.from('payments').insert({
    booking_id: params.bookingId,
    provider: 'stripe',
    provider_session_id: session.id,
    status: 'pending',
    amount: params.amount,
    currency: params.currency,
    metadata: { stripe_session_id: session.id },
  })

  // Update booking to processing state
  await supabase
    .from('bookings')
    .update({ status: 'processing' })
    .eq('id', params.bookingId)
    .eq('status', 'pending')

  return { url: session.url, sessionId: session.id }
}

// ---------------------------------------------------------------
// Verify and process a Stripe webhook event
// Returns the event type and relevant data, or null for unknown events
// ---------------------------------------------------------------

export async function processStripeWebhook(
  rawBody: string,
  signature: string,
): Promise<{ processed: boolean; bookingId?: string }> {
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${(err as Error).message}`)
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.booking_id

      if (!bookingId) return { processed: false }

      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id

      // Update payment record
      await supabase
        .from('payments')
        .update({
          status: 'succeeded',
          provider_payment_intent_id: paymentIntentId ?? null,
          paid_at: new Date().toISOString(),
        })
        .eq('provider_session_id', session.id)

      // Confirm the booking (idempotent)
      await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', bookingId)
        .in('status', ['pending', 'processing'])

      // Send confirmation email (best-effort)
      try {
        const { data: booking } = await supabase
          .from('bookings')
          .select('ref, total_amount, currency, customers(email, first_name, last_name)')
          .eq('id', bookingId)
          .single()
        if (booking?.customers?.[0]?.email) {
          await resend.emails.send({
            from: EMAIL_FROM,
            to: booking.customers[0].email,
            replyTo: EMAIL_REPLY_TO,
            subject: `Your Tropigo booking ${booking.ref} is confirmed`,
            html: `<p>Thank you for your booking.</p><p>Reference: <strong>${booking.ref}</strong><br/>Total: <strong>${booking.currency} ${Number(booking.total_amount).toFixed(2)}</strong></p><p>We look forward to welcoming you to Mauritius.</p>`
          })
        }
      } catch {}

      return { processed: true, bookingId }
    }

    case 'checkout.session.expired':
    case 'payment_intent.payment_failed': {
      const obj = event.data.object as Stripe.Checkout.Session | Stripe.PaymentIntent
      const sessionId = 'id' in obj ? obj.id : undefined

      if (sessionId) {
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('provider_session_id', sessionId)

        // Fetch booking ID from payment record
        const { data: payment } = await supabase
          .from('payments')
          .select('booking_id')
          .eq('provider_session_id', sessionId)
          .maybeSingle()

        if (payment?.booking_id) {
          await supabase
            .from('bookings')
            .update({ status: 'failed' })
            .eq('id', payment.booking_id)
            .in('status', ['pending', 'processing'])

          return { processed: true, bookingId: payment.booking_id }
        }
      }

      return { processed: true }
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId =
        typeof charge.payment_intent === 'string' ? charge.payment_intent : null

      if (paymentIntentId) {
        const { data: payment } = await supabase
          .from('payments')
          .select('booking_id')
          .eq('provider_payment_intent_id', paymentIntentId)
          .maybeSingle()

        if (payment?.booking_id) {
          await supabase
            .from('payments')
            .update({ status: 'refunded', refunded_at: new Date().toISOString() })
            .eq('provider_payment_intent_id', paymentIntentId)

          await supabase
            .from('bookings')
            .update({ status: 'refunded' })
            .eq('id', payment.booking_id)

          return { processed: true, bookingId: payment.booking_id }
        }
      }

      return { processed: true }
    }

    default:
      return { processed: false }
  }
}
