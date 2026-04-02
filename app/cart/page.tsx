"use client"

import { useCart } from '@/components/cart/useCart'
import { useEffect, useState } from 'react'
import Section from '@/components/ui/Section'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Button from '@/components/ui/Button'

export default function CartPage() {
  const { item, setItem, clear } = useCart()
  const [tour, setTour] = useState<any>(null)
  const [quote, setQuote] = useState<any>(null)

  useEffect(() => { (async () => {
    if (!item) return
    const tRes = await fetch(`/api/tour?id=${item.tourId}`)
    const tJson = await tRes.json()
    setTour(tJson.tour)
  })() }, [item?.tourId])

  async function refreshQuote() {
    if (!item) return setQuote(null)
    const res = await fetch('/api/book/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tourId: item.tourId, slotId: item.slotId, quantity: item.quantity, pickupId: item.pickupId || null, couponCode: item.couponCode || null }) })
    const json = await res.json()
    setQuote(json.quote || null)
  }
  useEffect(() => { refreshQuote() }, [item])

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
                <div className="flex items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {tour?.hero_image_url && <img src={tour.hero_image_url} alt="" className="w-32 h-24 object-cover rounded-xl" />}
                  <div className="flex-1">
                    <h3 className="font-headline text-xl text-primary">{tour?.name}</h3>
                    <p className="text-sm text-outline">{new Date(item.date).toLocaleDateString()} • qty {item.quantity}</p>
                    <div className="mt-3 flex gap-2">
                      <select value={item.quantity} onChange={(e)=>setItem({ ...item, quantity: Number((e.target as HTMLSelectElement).value) })} className="bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <Button variant="outline" onClick={()=>{ refreshQuote() }}>Update</Button>
                      <Button variant="outline" onClick={()=>clear()}>Remove</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant/10 p-5">
                <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Notes</label>
                <textarea className="mt-2 w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm min-h-[100px]" placeholder="Any special requests?" />
              </div>
            </div>

            <aside className="sticky top-24 bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-5 h-fit space-y-3">
              <div className="text-lg font-bold">Order Summary</div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Coupon</label>
                <input value={item.couponCode || ''} onChange={(e)=>setItem({ ...item, couponCode: e.target.value })} placeholder="Optional" className="mt-1 w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" />
              </div>
              <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-3 text-sm">
                {!quote && <div className="text-outline">Updating…</div>}
                {quote && (
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Subtotal</span><span>{quote.currency || tour?.currency || 'MUR'} {Number(quote.subtotal || 0).toLocaleString()}</span></div>
                    {quote.discount ? <div className="flex justify-between text-secondary"><span>Discount</span><span>- {quote.currency || tour?.currency || 'MUR'} {Number(quote.discount || 0).toLocaleString()}</span></div> : null}
                    <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{quote.currency || tour?.currency || 'MUR'} {Number(quote.total || 0).toLocaleString()}</span></div>
                  </div>
                )}
              </div>
              <a href="/checkout"><Button className="w-full">Proceed to Checkout</Button></a>
            </aside>
          </div>
        </Section>
      </main>
      {/* @ts-expect-error Async Server Component */}
      <Footer />
    </div>
  )
}

