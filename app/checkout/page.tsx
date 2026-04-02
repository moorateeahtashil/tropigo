"use client"

import { useCart } from '@/components/cart/useCart'
import { useEffect, useState } from 'react'
import Section from '@/components/ui/Section'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Button from '@/components/ui/Button'

export default function CheckoutPage() {
  const { item, clear } = useCart()
  const [tour, setTour] = useState<any>(null)
  const [quote, setQuote] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { (async () => {
    if (!item) return
    const tRes = await fetch(`/api/tour?id=${item.tourId}`)
    const tJson = await tRes.json()
    setTour(tJson.tour)
    const res = await fetch('/api/book/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tourId: item.tourId, slotId: item.slotId, quantity: item.quantity, pickupId: item.pickupId || null, couponCode: item.couponCode || null }) })
    const json = await res.json()
    setQuote(json.quote || null)
  })() }, [item?.tourId])

  async function placeOrder() {
    if (!item) return
    setLoading(true)
    try {
      let headers: any = { 'Content-Type': 'application/json' }
      try {
        const { getSupabaseClient } = await import('@/supabase/client')
        const sup = getSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
      } catch {}
      const res = await fetch('/api/book/reserve', { method: 'POST', headers, body: JSON.stringify({ tourId: item.tourId, slotId: item.slotId, quantity: item.quantity, pickupId: item.pickupId || null, couponCode: item.couponCode || null, customerEmail: email, customerName: name, customerPhone: phone, pickupLocation: item.pickupLocation || null }) })
      const json = await res.json()
      if (json?.result?.status === 'reserved') {
        const sess = await fetch('/api/payments/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: json.result.booking_id }) })
        const sjson = await sess.json()
        if (sjson?.url) {
          window.location.href = sjson.url
          return
        }
        // fallback
        window.location.href = `/checkout/confirmed?ref=${encodeURIComponent(json.result.booking_ref)}`
      } else {
        alert(`Could not place order: ${(json?.result?.messages || []).join(', ') || json.error || 'Unknown error'}`)
      }
    } finally { setLoading(false) }
  }

  if (!item) {
    return (
      <div className="min-h-dvh flex flex-col">
        {/* @ts-expect-error Async Server Component */}
        <Header />
        <main className="flex-1"><Section><div className="py-16 text-center text-on-surface-variant">Your cart is empty.</div></Section></main>
        {/* @ts-expect-error Async Server Component */}
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <main className="flex-1">
        <Section bg="surface" padding="lg">
          <div className="grid lg:grid-cols-[1fr,360px] gap-8 items-start">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-outline-variant/10 p-5">
                <div className="text-lg font-bold mb-3">Billing Details</div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" />
                  <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" />
                  <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm md:col-span-2" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-outline-variant/10 p-5">
                <div className="text-lg font-bold mb-3">Order Notes</div>
                <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm min-h-[120px]" placeholder="Anything we should know?" />
              </div>
            </div>
            <aside className="sticky top-24 bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-5 h-fit space-y-3">
              <div className="text-lg font-bold">Order Summary</div>
              <div className="text-sm text-on-surface-variant">{tour?.name} • {new Date(item.date).toLocaleDateString()} • qty {item.quantity}</div>
              <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-3 text-sm">
                {!quote && <div className="text-outline">Calculating…</div>}
                {quote && (
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Subtotal</span><span>{quote.currency || tour?.currency || 'MUR'} {Number(quote.subtotal || 0).toLocaleString()}</span></div>
                    {quote.discount ? <div className="flex justify-between text-secondary"><span>Discount</span><span>- {quote.currency || tour?.currency || 'MUR'} {Number(quote.discount || 0).toLocaleString()}</span></div> : null}
                    <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{quote.currency || tour?.currency || 'MUR'} {Number(quote.total || 0).toLocaleString()}</span></div>
                  </div>
                )}
              </div>
              <Button className="w-full" onClick={placeOrder} disabled={loading || !quote || !quote.valid}>Place Order</Button>
              <div className="text-[11px] text-outline">No payment yet. Your spot is reserved after placing the order.</div>
            </aside>
          </div>
        </Section>
      </main>
      {/* @ts-expect-error Async Server Component */}
      <Footer />
    </div>
  )
}
