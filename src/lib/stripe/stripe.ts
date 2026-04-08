import Stripe from 'stripe'

// Server-side Stripe client — only import in server code
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

// Stripe supports a subset of ISO 4217 currency codes in lowercase
export function toStripeCurrency(currency: string): string {
  return currency.toLowerCase()
}

// Map our booking currency to Stripe amount in smallest unit (cents)
export function toStripeAmount(amount: number, currency: string): number {
  // Zero-decimal currencies (MUR is not zero-decimal, EUR/USD/GBP all use cents)
  const zeroDecimalCurrencies = ['JPY', 'KWD', 'BHD', 'OMR']
  if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    return Math.round(amount)
  }
  return Math.round(amount * 100)
}
