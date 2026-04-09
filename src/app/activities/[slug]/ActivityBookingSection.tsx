'use client'

import { useState } from 'react'
import { Users, Minus, Plus, Check, X, ArrowRight } from 'lucide-react'
import { AvailabilityCalendar } from '@/components/product/AvailabilityCalendar'
import { IslandLoader } from '@/components/ui/IslandLoader'

interface ActivityBookingSectionProps {
  productId: string
  basePrice: number | null
  baseCurrency: string
  minParticipants?: number
}

export function ActivityBookingSection({
  productId,
  basePrice,
  baseCurrency,
  minParticipants = 1,
}: ActivityBookingSectionProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [quantity, setQuantity] = useState(minParticipants)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const currency = typeof window !== 'undefined' ? localStorage.getItem('tropigo_currency') || 'EUR' : 'EUR'
  const totalPrice = basePrice ? basePrice * quantity : null

  async function addToCart() {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Check availability
      const checkRes = await fetch(
        `/api/availability/check?productId=${productId}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}`
      )
      if (!checkRes.ok) {
        const j = await checkRes.json().catch(() => null)
        setError(j?.error || 'Selected time is no longer available')
        setLoading(false)
        return
      }

      // Create booking session
      await fetch('/api/booking/session', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      })

      // Add to cart
      const res = await fetch('/api/booking/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productType: 'activity',
          quantity,
          currency,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
        }),
      })

      if (!res.ok) throw new Error('Failed to add to cart')

      // Notify header cart icon
      window.dispatchEvent(new Event('cart-change'))
      setSuccess(true)

      // Redirect to cart after short delay
      setTimeout(() => {
        window.location.href = '/cart'
      }, 1000)
    } catch (err) {
      setError('Failed to add to cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setError('')
  }

  if (loading) {
    return <IslandLoader />
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800">Added to Cart!</h3>
        <p className="mt-2 text-sm text-green-700">Redirecting to your cart...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-1 text-sm font-medium text-on-surface-variant">Book This Experience</div>
        {basePrice && (
          <div className="text-2xl font-bold text-primary">
            {basePrice.toFixed(2)} {baseCurrency}
            {quantity > 1 && (
              <span className="ml-2 text-sm font-normal text-on-surface-variant">
                / person
              </span>
            )}
          </div>
        )}
        {minParticipants > 1 && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
            <Users className="h-3.5 w-3.5" />
            Minimum {minParticipants} participants
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Calendar with inline time selection */}
      <AvailabilityCalendar
        productId={productId}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onSelect={handleDateSelect}
        className="w-full"
      />

      {/* Quantity selector */}
      {selectedDate && selectedTime && (
        <div className="space-y-4 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <span>📅</span>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <span>🕐</span>
              {selectedTime}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-primary">
              <Users className="h-4 w-4" />
              Participants
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(minParticipants, q - 1))}
                disabled={quantity <= minParticipants}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant bg-white transition-all hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-base font-semibold text-primary">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant bg-white transition-all hover:bg-surface-container"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {totalPrice && (
            <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3">
              <span className="text-sm font-medium text-on-surface-variant">Total</span>
              <span className="text-xl font-bold text-secondary">
                {totalPrice.toFixed(2)} {currency}
              </span>
            </div>
          )}

          {/* Add to cart button */}
          <button
            onClick={addToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-label text-sm font-bold uppercase tracking-widest text-on-primary transition-all hover:bg-on-primary-fixed active:scale-98"
          >
            Add to Cart
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
