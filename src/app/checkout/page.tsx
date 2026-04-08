"use client"
import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

interface CartItem {
  id: string
  product_id: string
  product_type: string
  quantity: number
  unit_price: number
  currency: string
  price_snapshot: {
    product_title: string
    cover_image_url: string | null
  }
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    lead_email: '',
    lead_phone: '',
    lead_first_name: '',
    lead_last_name: '',
    special_requirements: '',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      await fetch('/api/booking/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      const res = await fetch('/api/booking/cart')
      const json = await res.json()
      setItems(json.items || [])
      setLoading(false)
    }
    load()
  }, [])

  const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)
  const currency = items[0]?.currency || (typeof window !== 'undefined' ? (localStorage.getItem('tropigo_currency') || 'EUR') : 'EUR')

  async function pay(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const sessionRes = await fetch('/api/booking/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currency }) })
    const { session } = await sessionRes.json()
    const payload = {
      session_id: session.id,
      lead_email: form.lead_email,
      lead_phone: form.lead_phone || undefined,
      lead_first_name: form.lead_first_name,
      lead_last_name: form.lead_last_name,
      country: undefined,
      special_requirements: form.special_requirements || undefined,
      travellers: [
        {
          first_name: form.lead_first_name,
          last_name: form.lead_last_name,
          email: form.lead_email,
          phone: form.lead_phone || undefined,
          is_lead_traveller: true,
        },
      ],
    }
    const res = await fetch('/api/booking/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      setError(json?.error ? JSON.stringify(json.error) : 'Checkout failed')
      return
    }
    const json = await res.json()
    window.location.href = json.url
  }

  async function payWithPaypal(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const sessionRes = await fetch('/api/booking/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currency }) })
    const { session } = await sessionRes.json()
    const payload = {
      session_id: session.id,
      lead_email: form.lead_email,
      lead_phone: form.lead_phone || undefined,
      lead_first_name: form.lead_first_name,
      lead_last_name: form.lead_last_name,
      country: undefined,
      special_requirements: form.special_requirements || undefined,
      travellers: [
        {
          first_name: form.lead_first_name,
          last_name: form.lead_last_name,
          email: form.lead_email,
          phone: form.lead_phone || undefined,
          is_lead_traveller: true,
        },
      ],
    }
    // Create booking without Stripe session
    const res = await fetch('/api/booking/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) { const j = await res.json().catch(()=>null); setError(j?.error ? JSON.stringify(j.error) : 'Checkout failed'); return }
    const { booking_id } = await res.json()
    // Create PayPal order and redirect to approval URL
    const orderRes = await fetch('/api/payment/paypal/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ booking_id }) })
    const j = await orderRes.json()
    if (!orderRes.ok) { setError(j?.error || 'PayPal order failed'); return }
    window.location.href = j.approval_url
  }

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        <h1 className="heading-display text-3xl">Checkout</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <form onSubmit={pay} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-ink">First name</label>
                <input value={form.lead_first_name} onChange={e => setForm({ ...form, lead_first_name: e.target.value })} required className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Last name</label>
                <input value={form.lead_last_name} onChange={e => setForm({ ...form, lead_last_name: e.target.value })} required className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink">Email</label>
              <input type="email" value={form.lead_email} onChange={e => setForm({ ...form, lead_email: e.target.value })} required className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink">Phone</label>
              <input value={form.lead_phone} onChange={e => setForm({ ...form, lead_phone: e.target.value })} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink">Special requests</label>
              <textarea value={form.special_requirements} onChange={e => setForm({ ...form, special_requirements: e.target.value })} rows={4} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
            </div>
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <button disabled={loading || items.length===0} className="rounded-xl bg-brand-700 px-4 py-2 text-white transition-colors hover:bg-brand-800 disabled:opacity-50">
              {loading ? 'Loading…' : `Pay ${currency} ${total.toFixed(2)}`}
            </button>
            {/* PayPal button (creates order and redirects) — Alternative */}
            {/* For simplicity of MVP, keep Stripe-first flow; PayPal support is exposed via a separate quick call below: */}
            <button onClick={payWithPaypal} disabled={loading || items.length===0} className="ml-3 rounded-xl border border-sand-300 px-4 py-2 text-ink transition-colors hover:bg-sand-50 disabled:opacity-50">Pay with PayPal</button>
          </form>

          <aside className="h-max space-y-3 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
            <h2 className="mb-2 text-lg font-semibold text-ink">Your cart</h2>
            {loading ? (
              <div className="space-y-2">
                <div className="h-16 animate-pulse rounded bg-sand-100" />
                <div className="h-16 animate-pulse rounded bg-sand-100" />
              </div>
            ) : items.length === 0 ? (
              <p className="text-ink-secondary">Your cart is empty.</p>
            ) : (
              <ul className="space-y-3">
                {items.map(i => (
                  <li key={i.id} className="flex items-center gap-3">
                    <div className="h-12 w-16 overflow-hidden rounded-lg bg-sand-100">
                      {i.price_snapshot.cover_image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={i.price_snapshot.cover_image_url} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-ink">{i.price_snapshot.product_title}</div>
                      <div className="text-xs text-ink-secondary">Qty {i.quantity}</div>
                    </div>
                    <div className="text-sm text-ink">{i.currency} {(i.unit_price * i.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            )}
            {!loading && items.length > 0 && (
              <div className="mt-4 flex items-center justify-between border-t border-sand-200 pt-3">
                <div className="text-sm text-ink-muted">Total</div>
                <div className="text-base font-semibold text-ink">{currency} {total.toFixed(2)}</div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
