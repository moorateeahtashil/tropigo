'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Package, Calendar, Clock, Check } from 'lucide-react'
import { AvailabilityCalendar } from '@/components/product/AvailabilityCalendar'
import { IslandLoader } from '@/components/ui/IslandLoader'

export function PackageBookingWidget({ productId, items }: { productId: string; items: any[] }) {
  const [loading, setLoading] = useState(false)
  const [selectedOptional, setSelectedOptional] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const optionalItems = items.filter((item: any) => item.is_optional)

  function toggleOptional(itemId: string) {
    setSelectedOptional(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  const handleDateSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setError('')
  }

  async function addToCart() {
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time')
      return
    }

    setLoading(true)
    setError('')
    try {
      await fetch('/api/booking/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      const currency = localStorage.getItem('tropigo_currency') || 'EUR'
      await fetch('/api/booking/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productType: 'package',
          quantity: 1,
          currency,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
          specialRequirements: selectedOptional.length > 0
            ? `Optional items: ${selectedOptional.join(', ')}`
            : undefined,
        }),
      })
      window.dispatchEvent(new Event('cart-change'))
      setSuccess(true)
      setTimeout(() => router.push('/checkout'), 1500)
    } catch (err) {
      setError('Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <IslandLoader />

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800">Package Added!</h3>
        <p className="mt-2 text-sm text-green-700">Redirecting to checkout...</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Date & Time Selection */}
      <div>
        <div className="mb-3 flex items-center gap-2 font-label text-xs font-bold uppercase tracking-wider text-primary">
          <Calendar className="h-4 w-4" />
          Select Date & Time
        </div>
        <AvailabilityCalendar
          productId={productId}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSelect={handleDateSelect}
          className="w-full"
        />
      </div>

      {/* Optional Add-ons */}
      {optionalItems.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-label text-xs font-bold uppercase tracking-wider text-primary">
            <Package className="h-4 w-4" />
            Optional Add-ons
          </h3>
          <ul className="space-y-2">
            {optionalItems.map((item: any) => (
              <li key={item.id} className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-3">
                <input
                  type="checkbox"
                  checked={selectedOptional.includes(item.id)}
                  onChange={() => toggleOptional(item.id)}
                  className="h-4 w-4 rounded border-outline-variant text-secondary focus:ring-secondary"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink">{item.product?.title}</div>
                  {item.notes && <div className="text-xs text-on-surface-variant">{item.notes}</div>}
                </div>
                {item.price_override && (
                  <div className="text-sm font-semibold text-secondary">+{item.price_override}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span className="mt-0.5">⚠️</span>
          {error}
        </div>
      )}

      {/* Selected summary */}
      {selectedDate && selectedTime && (
        <div className="flex items-center gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 text-sm text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {selectedTime}
          </div>
        </div>
      )}

      {/* Add to Cart */}
      <Button onClick={addToCart} disabled={!selectedDate || !selectedTime} size="lg" className="w-full py-4">
        <Package className="mr-2 h-5 w-5" />
        {selectedDate && selectedTime ? 'Add Package to Cart' : 'Select Date & Time'}
      </Button>
    </div>
  )
}
