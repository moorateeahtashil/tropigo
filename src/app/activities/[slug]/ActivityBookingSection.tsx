'use client'

import { useState } from 'react'
import { AvailabilityCalendar } from '@/components/product/AvailabilityCalendar'

export function ActivityBookingSection({ productId, minParticipants }: { productId: string; minParticipants?: number }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  async function addToCart() {
    setLoading(true)
    try {
      if (date) {
        const check = await fetch(`/api/availability/check?productId=${productId}&date=${encodeURIComponent(date)}${time ? `&time=${encodeURIComponent(time)}` : ''}`)
        if (!check.ok) {
          const j = await check.json().catch(() => null)
          alert(j?.error || 'Selected time is unavailable')
          setLoading(false)
          return
        }
      }
      await fetch('/api/booking/session', { method: 'POST', body: JSON.stringify({}), headers: { 'Content-Type': 'application/json' } })
      const currency = localStorage.getItem('tropigo_currency') || 'EUR'
      const res = await fetch('/api/booking/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productType: 'activity',
          quantity,
          currency,
          bookingDate: date || undefined,
          bookingTime: time || undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed to add to cart')
      window.location.href = '/checkout'
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-3 text-sm text-ink-muted">Book This Activity</div>
      {minParticipants && (
        <div className="mb-3 flex items-center gap-1.5 text-xs text-ink-muted">
          Min {minParticipants} participant{minParticipants > 1 ? 's' : ''}
        </div>
      )}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-ink">Date</label>
          <input type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Time</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Quantity</label>
          <input type="number" min={1} value={quantity} onChange={e => setQuantity(parseInt(e.target.value || '1', 10))} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <button onClick={addToCart} disabled={loading} className="w-full rounded-xl bg-brand-700 px-4 py-2 text-white transition-colors hover:bg-brand-800 disabled:opacity-50">
          {loading ? 'Adding…' : 'Add to cart'}
        </button>
      </div>
    </div>
  )
}
