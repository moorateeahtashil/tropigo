'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IslandLoader } from '@/components/ui/IslandLoader'
import { Check, ArrowRight, Car, MapPin, Calendar, Clock, Users, Package, Plane } from 'lucide-react'

type ZonePrice = { from_zone: { id: string; name: string }; to_zone: { id: string; name: string }; vehicle_type: string | null; price: number }

export function TransferBookingWidget({ productId, zonePrices, currency, pricingModel }: {
  productId: string
  zonePrices: ZonePrice[]
  currency: string
  pricingModel: string
}) {
  const router = useRouter()

  // Form state
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [passengers, setPassengers] = useState(2)
  const [luggage, setLuggage] = useState(2)
  const [flight, setFlight] = useState('')
  const [fromZone, setFromZone] = useState('')
  const [toZone, setToZone] = useState('')
  const [vehicle, setVehicle] = useState('')

  // Quote state
  const [quote, setQuote] = useState<{ amount: number; currency: string; exchange_rate: number } | null>(null)
  const [distanceKm, setDistanceKm] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [fetchingQuote, setFetchingQuote] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Available time slots (driver availability)
  const [availableTimes, setAvailableTimes] = useState<string[]>(['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'])

  // Fetch driver availability when date changes
  useEffect(() => {
    if (!pickupDate) return
    fetchDriverAvailability()
  }, [pickupDate])

  async function fetchDriverAvailability() {
    try {
      const res = await fetch(
        `/api/availability/check?productId=${productId}&startDate=${pickupDate}&endDate=${pickupDate}`
      )
      if (res.ok) {
        const data = await res.json()
        const slots = data.slots?.[pickupDate] || []
        if (slots.length > 0) {
          setAvailableTimes(slots.filter((s: any) => s.available).map((s: any) => s.time))
        }
      }
    } catch {
      // Fall back to default times
    }
  }

  const zones = useMemo(() => {
    const set = new Map<string, string>()
    for (const z of zonePrices) {
      set.set(z.from_zone.id, z.from_zone.name)
      set.set(z.to_zone.id, z.to_zone.name)
    }
    return Array.from(set.entries()).map(([id, name]) => ({ id, name }))
  }, [zonePrices])

  const minDate = new Date().toISOString().split('T')[0]

  async function fetchQuote() {
    setError('')
    setQuote(null)

    if (pricingModel === 'distance_based') {
      if (!distanceKm || Number(distanceKm) <= 0) {
        setError('Please enter a valid distance')
        return
      }
      setFetchingQuote(true)
      try {
        const url = `/api/pricing/transfer-distance-quote?transferId=${productId}&distance=${distanceKm}&currency=${currency}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setQuote({ amount: data.amount, currency: data.currency, exchange_rate: data.exchange_rate })
        } else {
          setError('Could not calculate price. Please check your distance.')
        }
      } catch {
        setError('Failed to get price quote')
      } finally {
        setFetchingQuote(false)
      }
    } else {
      if (!fromZone || !toZone) {
        setError('Please select both pickup and dropoff zones')
        return
      }
      setFetchingQuote(true)
      try {
        const url = `/api/pricing/transfer-quote?transferId=${productId}&from=${fromZone}&to=${toZone}&vehicle=${vehicle}&currency=${currency}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setQuote({ amount: data.amount, currency: data.currency, exchange_rate: data.exchange_rate })
        } else {
          setError('No price found for this route. Please contact us.')
        }
      } catch {
        setError('Failed to get price quote')
      } finally {
        setFetchingQuote(false)
      }
    }
  }

  async function addToCart() {
    if (!pickup || !dropoff) {
      setError('Please enter pickup and dropoff locations')
      return
    }
    if (!pickupDate || !pickupTime) {
      setError('Please select a pickup date and time')
      return
    }

    setLoading(true)
    setError('')
    try {
      await fetch('/api/booking/session', { method: 'POST', body: JSON.stringify({}), headers: { 'Content-Type': 'application/json' } })
      const displayCurrency = localStorage.getItem('tropigo_currency') || currency
      await fetch('/api/booking/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productType: 'airport_transfer',
          quantity: 1,
          currency: displayCurrency,
          bookingDate: pickupDate,
          bookingTime: pickupTime,
          specialRequirements: `pickup:${pickup}; dropoff:${dropoff}; pax:${passengers}; bags:${luggage}; flight:${flight}`,
          overrideUnitPrice: quote?.amount,
          overrideExchangeRate: quote?.exchange_rate,
          transferMeta: {
            from_zone_id: fromZone || null,
            to_zone_id: toZone || null,
            vehicle_type: vehicle || null,
            pickup,
            dropoff,
            pickup_datetime: `${pickupDate}T${pickupTime}`,
            passenger_count: passengers,
            luggage_count: luggage,
            flight_number: flight || null,
          },
        }),
      })
      window.dispatchEvent(new Event('cart-change'))
      setSuccess(true)
      setTimeout(() => router.push('/checkout'), 1500)
    } catch {
      setError('Failed to add to cart. Please try again.')
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
        <h3 className="text-lg font-semibold text-green-800">Transfer Added!</h3>
        <p className="mt-2 text-sm text-green-700">Redirecting to checkout...</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Route Selection */}
      {pricingModel !== 'distance_based' && (
        <div>
          <div className="mb-3 flex items-center gap-2 font-label text-xs font-bold uppercase tracking-wider text-primary">
            <MapPin className="h-4 w-4" />
            Route
          </div>
          <div className="space-y-3">
            <div className="relative">
              <label className="mb-1.5 block text-sm font-medium text-on-surface">From Zone</label>
              <select
                value={fromZone}
                onChange={e => { setFromZone(e.target.value); setQuote(null) }}
                className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm shadow-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              >
                <option value="">Select pickup zone</option>
                {zones.map(z => <option key={`from-${z.id}`} value={z.id}>{z.name}</option>)}
              </select>
            </div>
            <div className="relative">
              <label className="mb-1.5 block text-sm font-medium text-on-surface">To Zone</label>
              <select
                value={toZone}
                onChange={e => { setToZone(e.target.value); setQuote(null) }}
                className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm shadow-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              >
                <option value="">Select dropoff zone</option>
                {zones.map(z => <option key={`to-${z.id}`} value={z.id}>{z.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Distance input */}
      {pricingModel === 'distance_based' && (
        <Input
          label="Distance (km)"
          type="number"
          min={1}
          value={distanceKm}
          onChange={e => { setDistanceKm(e.target.value === '' ? '' : Number(e.target.value)); setQuote(null) }}
          required
        />
      )}

      {/* Vehicle type */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-on-surface">Vehicle Type</label>
        <select
          value={vehicle}
          onChange={e => { setVehicle(e.target.value); setQuote(null) }}
          className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm shadow-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
        >
          <option value="">Any vehicle</option>
          <option value="sedan">Sedan (up to 3)</option>
          <option value="minivan">Minivan (up to 7)</option>
          <option value="bus">Bus (up to 15)</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>

      {/* Pickup & Dropoff locations */}
      <Input
        label="Pickup Location"
        value={pickup}
        onChange={e => setPickup(e.target.value)}
        placeholder="e.g. SSR Airport, Hotel name"
        required
      />
      <Input
        label="Dropoff Location"
        value={dropoff}
        onChange={e => setDropoff(e.target.value)}
        placeholder="e.g. Grand Baie Hotel"
        required
      />

      {/* Date Selection */}
      <div>
        <div className="mb-3 flex items-center gap-2 font-label text-xs font-bold uppercase tracking-wider text-primary">
          <Calendar className="h-4 w-4" />
          Pickup Date
        </div>
        <input
          type="date"
          value={pickupDate}
          onChange={e => { setPickupDate(e.target.value); setPickupTime(''); setQuote(null) }}
          min={minDate}
          className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm shadow-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
        />
      </div>

      {/* Time Selection (only if date selected) */}
      {pickupDate && (
        <div>
          <div className="mb-3 flex items-center gap-2 font-label text-xs font-bold uppercase tracking-wider text-primary">
            <Clock className="h-4 w-4" />
            Pickup Time
          </div>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map(time => (
              <button
                key={time}
                type="button"
                onClick={() => { setPickupTime(time); setError('') }}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  pickupTime === time
                    ? 'border-secondary bg-secondary text-white shadow-md'
                    : 'border-outline-variant bg-white text-on-surface hover:border-secondary hover:bg-secondary/5'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Passengers & Luggage */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-on-surface">
            <Users className="h-3.5 w-3.5" />
            Passengers
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPassengers(p => Math.max(1, p - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-white hover:bg-surface-container"
            >
              −
            </button>
            <span className="w-8 text-center text-base font-semibold">{passengers}</span>
            <button
              type="button"
              onClick={() => setPassengers(p => p + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-white hover:bg-surface-container"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex-1">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-on-surface">
            <Package className="h-3.5 w-3.5" />
            Luggage
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLuggage(l => Math.max(0, l - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-white hover:bg-surface-container"
            >
              −
            </button>
            <span className="w-8 text-center text-base font-semibold">{luggage}</span>
            <button
              type="button"
              onClick={() => setLuggage(l => l + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-white hover:bg-surface-container"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Flight number */}
      <Input
        label="Flight Number (optional)"
        value={flight}
        onChange={e => setFlight(e.target.value)}
        placeholder="e.g. MK045"
      />

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span className="mt-0.5">⚠️</span>
          {error}
        </div>
      )}

      {/* Quote / Price */}
      <div>
        {quote && (
          <div className="mb-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 text-center">
            <div className="text-sm text-on-surface-variant">Estimated Price</div>
            <div className="text-2xl font-bold text-secondary">
              {quote.currency} {quote.amount.toFixed(2)}
            </div>
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={fetchQuote}
          disabled={fetchingQuote}
          className="w-full py-3"
        >
          {fetchingQuote ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Calculating...
            </>
          ) : (
            <>
              <Car className="mr-2 h-4 w-4" />
              {quote ? 'Recalculate Price' : 'Get Price'}
            </>
          )}
        </Button>
      </div>

      {/* Add to Cart */}
      <Button
        onClick={addToCart}
        disabled={!quote}
        className="w-full py-4"
      >
        Add Transfer to Cart
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
