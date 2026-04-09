'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, Minus, Plus, Check, X, ArrowRight } from 'lucide-react'
import { AvailabilityCalendar } from '@/components/product/AvailabilityCalendar'
import { IslandLoader } from '@/components/ui/IslandLoader'

interface ActivityBookingSectionProps {
  productId: string
  basePrice: number | null
  baseCurrency: string
  minParticipants?: number
  availableTimes?: string[]
}

export function ActivityBookingSection({
  productId,
  basePrice,
  baseCurrency,
  minParticipants = 1,
  availableTimes,
}: ActivityBookingSectionProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [quantity, setQuantity] = useState(minParticipants)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState<'date' | 'time' | 'details'>('date')

  // Calculate total price
  const currency = typeof window !== 'undefined' ? localStorage.getItem('tropigo_currency') || 'EUR' : 'EUR'
  const totalPrice = basePrice ? basePrice * quantity : null

  async function addToCart() {
    if (!selectedDate) {
      setError('Please select a date')
      return
    }
    if (!selectedTime) {
      setError('Please select a time')
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
    if (time) setSelectedTime(time)
    setStep(time ? 'details' : 'time')
    setError('')
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep('details')
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

      {/* Step 1: Calendar */}
      {step === 'date' && (
        <div>
          <div className="mb-3 flex items-center gap-2 font-label text-xs font-bold uppercase tracking-wider text-primary">
            <Calendar className="h-4 w-4" />
            Select Date
          </div>
          <AvailabilityCalendar
            productId={productId}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelect={handleDateSelect}
            className="w-full"
          />
        </div>
      )}

      {/* Step 2: Time Selection */}
      {step === 'time' && selectedDate && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-label text-xs font-bold uppercase tracking-wider text-primary">
              <Clock className="h-4 w-4" />
              Select Time
            </div>
            <button
              onClick={() => setStep('date')}
              className="text-xs text-secondary hover:text-tertiary"
            >
              Change date
            </button>
          </div>
          <div className="text-sm text-on-surface-variant mb-3">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(availableTimes || ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00']).map(time => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  selectedTime === time
                    ? 'border-secondary bg-secondary/10 text-secondary ring-1 ring-secondary'
                    : 'border-outline-variant bg-white text-on-surface hover:border-secondary hover:bg-secondary/5'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Quantity & Add to Cart */}
      {step === 'details' && (
        <div className="space-y-4">
          {/* Selected date & time summary */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Calendar className="h-4 w-4" />
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-on-surface-variant">
              <Clock className="h-4 w-4" />
              {selectedTime}
            </div>
          </div>

          {/* Quantity selector */}
          <div>
            <label className="mb-2 flex items-center gap-2 font-label text-xs font-bold uppercase tracking-wider text-primary">
              <Users className="h-4 w-4" />
              Number of Participants
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(minParticipants, q - 1))}
                disabled={quantity <= minParticipants}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-white transition-all hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-lg font-semibold text-primary">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-white transition-all hover:bg-surface-container"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Total price */}
          {totalPrice && (
            <div className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
              <span className="text-sm font-medium text-on-surface-variant">Total Price</span>
              <span className="text-xl font-bold text-secondary">
                {totalPrice.toFixed(2)} {currency}
              </span>
            </div>
          )}

          {/* Add to cart button */}
          <button
            onClick={addToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-label text-sm font-bold uppercase tracking-widest text-on-primary transition-all hover:bg-on-primary-fixed active:scale-98"
          >
            Add to Cart
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Back button */}
          <button
            onClick={() => setStep('time')}
            className="w-full py-2 text-xs font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            ← Change time or date
          </button>
        </div>
      )}
    </div>
  )
}
