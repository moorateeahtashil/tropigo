import { createAdminClient } from '@/lib/supabase/admin'

const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!

async function getAccessToken() {
  const creds = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error('PayPal auth failed')
  const json = await res.json() as { access_token: string }
  return json.access_token
}

export async function createPaypalOrder(params: {
  bookingId: string
  bookingRef: string
  amount: number
  currency: string
  returnUrl: string
  cancelUrl: string
}) {
  const token = await getAccessToken()
  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: params.bookingId,
        custom_id: params.bookingId,
        invoice_id: params.bookingRef,
        amount: { value: params.amount.toFixed(2), currency_code: params.currency },
      },
    ],
    application_context: {
      return_url: params.returnUrl,
      cancel_url: params.cancelUrl,
      brand_name: 'Tropigo',
      user_action: 'PAY_NOW',
    },
  }
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to create PayPal order')
  return res.json() as Promise<any>
}

export async function capturePaypalOrder(orderId: string) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to capture PayPal order')
  return res.json() as Promise<any>
}

export async function getPaypalOrder(orderId: string) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch PayPal order')
  return res.json() as Promise<any>
}

export async function recordPaypalPaymentOnCreate(bookingId: string, orderId: string, amount: number, currency: string) {
  const supabase = createAdminClient()
  await supabase.from('payments').insert({ booking_id: bookingId, provider: 'paypal', provider_session_id: orderId, amount, currency, status: 'pending' })
  await supabase.from('bookings').update({ status: 'processing' }).eq('id', bookingId).in('status', ['pending'])
}

export async function recordPaypalCapture(order: any) {
  const supabase = createAdminClient()
  const pu = order.purchase_units?.[0]
  const bookingId = pu?.custom_id || pu?.reference_id
  if (!bookingId) return
  await supabase
    .from('payments')
    .update({ status: 'succeeded' })
    .eq('provider_session_id', order.id)
  await supabase
    .from('bookings')
    .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
    .eq('id', bookingId)
    .in('status', ['pending', 'processing'])
}
