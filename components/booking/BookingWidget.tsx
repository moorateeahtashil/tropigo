"use client"

import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'

export default function BookingWidget({ tourId, currency }: { tourId: string; currency?: string }) {
  const [date, setDate] = useState<string>('')
  const [slots, setSlots] = useState<any[]>([])
  const [slotId, setSlotId] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(2)
  const [pickups, setPickups] = useState<any[]>([])
  const [pickupId, setPickupId] = useState<string>('')
  const [pickupLocation, setPickupLocation] = useState<string>('')
  const [couponCode, setCouponCode] = useState<string>('')
  const [quote, setQuote] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`/api/pickups?tourId=${tourId}`)
      const json = await res.json()
      setPickups(json.pickups || [])
    })()
  }, [tourId])

  async function fetchSlots(d: string) {
    if (!d) return setSlots([])
    const res = await fetch(`/api/availability?tourId=${tourId}&date=${d}`)
    const json = await res.json()
    setSlots(json.slots || [])
  }

  useEffect(() => {
    setSlotId('')
    setQuote(null)
    if (date) fetchSlots(date)
  }, [date])

  async function refreshQuote() {
    if (!tourId || !slotId || !quantity) return setQuote(null)
    setLoading(true)
    try {
      const res = await fetch('/api/book/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tourId, slotId, quantity, pickupId: pickupId || null, couponCode: couponCode || null }) })
      const json = await res.json()
      setQuote(json.quote || null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refreshQuote() }, [slotId, quantity, pickupId, couponCode])

  async function reserve() {
    if (!email || !name) { alert('Please enter your contact details.'); return }
    setLoading(true)
    try {
      let headers: any = { 'Content-Type': 'application/json' }
      try {
        const { getSupabaseClient } = await import('@/supabase/client')
        const sup = getSupabaseClient()
        const { data: { session } } = await sup.auth.getSession()
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
      } catch {}
      const res = await fetch('/api/book/reserve', { method: 'POST', headers, body: JSON.stringify({ tourId, slotId, quantity, pickupId: pickupId || null, couponCode: couponCode || null, customerEmail: email, customerName: name, customerPhone: phone, pickupLocation }) })
      const json = await res.json()
      if (json?.result?.status === 'reserved') {
        alert(`Reserved! Reference: ${json.result.booking_ref}`)
      } else {
        alert(`Could not reserve: ${(json?.result?.messages || []).join(', ') || json.error || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const slotOptions = useMemo(() => slots.map((s: any) => ({ id: s.id, label: new Date(s.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), left: s.capacity_left })), [slots])

  return (
    <div className="space-y-3">
      {/* Date */}
      <div>
        <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Date</label>
        <input value={date} onChange={(e)=>setDate(e.target.value)} type="date" className="mt-1 w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary" />
      </div>

      {/* Time */}
      <div>
        <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Pickup Time</label>
        <select value={slotId} onChange={(e)=>setSlotId((e.target as HTMLSelectElement).value)} className="mt-1 w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary">
          <option value="">Select time</option>
          {slotOptions.map((o: any) => (
            <option key={o.id} value={o.id}>{o.label} {o.left <= 3 ? `(only ${o.left} left)` : ''}</option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Guests</label>
        <select value={quantity} onChange={(e)=>setQuantity(Number((e.target as HTMLSelectElement).value))} className="mt-1 w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {/* Pickup option */}
      {pickups.length > 0 && (
        <div>
          <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Pickup Option</label>
          <select value={pickupId} onChange={(e)=>setPickupId((e.target as HTMLSelectElement).value)} className="mt-1 w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary">
            <option value="">No pickup</option>
            {pickups.map((p: any) => <option key={p.id} value={p.id}>{p.label} {p.surcharge ? `(+${currency || 'MUR'} ${Number(p.surcharge).toLocaleString()})` : ''}</option>)}
          </select>
        </div>
      )}

      {/* Pickup location */}
      <div>
        <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Pickup Location (optional)</label>
        <input value={pickupLocation} onChange={(e)=>setPickupLocation(e.target.value)} placeholder="Hotel/Villa address" className="mt-1 w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary" />
      </div>

      {/* Coupon */}
      <div>
        <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Coupon</label>
        <input value={couponCode} onChange={(e)=>setCouponCode(e.target.value)} placeholder="Optional" className="mt-1 w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary" />
      </div>

      {/* Preview */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-3 text-sm">
        {!quote && <div className="text-outline">Select date/time and guests to preview price.</div>}
        {quote && (
          <div className="space-y-1">
            <div className="flex justify-between"><span>Unit price</span><span>{quote.currency || currency || 'MUR'} {Number(quote.unit_price || 0).toLocaleString()}</span></div>
            {quote.pickup_surcharge ? <div className="flex justify-between"><span>Pickup surcharge</span><span>{quote.currency || currency || 'MUR'} {Number(quote.pickup_surcharge || 0).toLocaleString()}</span></div> : null}
            <div className="flex justify-between font-semibold"><span>Subtotal</span><span>{quote.currency || currency || 'MUR'} {Number(quote.subtotal || 0).toLocaleString()}</span></div>
            {quote.discount ? <div className="flex justify-between text-secondary"><span>Discount</span><span>- {quote.currency || currency || 'MUR'} {Number(quote.discount || 0).toLocaleString()}</span></div> : null}
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{quote.currency || currency || 'MUR'} {Number(quote.total || 0).toLocaleString()}</span></div>
            {Array.isArray(quote.messages) && quote.messages.length > 0 && (
              <div className="text-[12px] text-outline">{quote.messages.join(', ')}</div>
            )}
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="grid md:grid-cols-2 gap-2">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary" />
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary md:col-span-2" />
      </div>

      {/* CTAs */}
      <div className="space-y-2">
        <Button className="w-full" onClick={reserve} disabled={loading || !quote || !quote.valid}>Book Now</Button>
        <a
          href="#"
          onClick={(e)=>{ e.preventDefault();
            if (!tourId || !slotId || !date) { alert('Select date and time first.'); return }
            const cart = { tourId, slotId, date, quantity, pickupId: pickupId || undefined, pickupLocation: pickupLocation || undefined, couponCode: couponCode || undefined }
            window.localStorage.setItem('cart', JSON.stringify(cart))
            window.location.href = '/cart'
          }}
          className="block text-center text-sm text-outline underline"
        >Add to cart</a>
        <a href="/contact" className="block text-center text-sm text-outline underline">Prefer to enquire? Contact Concierge</a>
      </div>
    </div>
  )
}
