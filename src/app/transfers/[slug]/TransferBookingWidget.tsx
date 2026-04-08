'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

type ZonePrice = { from_zone: { id: string; name: string }; to_zone: { id: string; name: string }; vehicle_type: string | null; price: number }

export function TransferBookingWidget({ productId, zonePrices, currency, pricingModel }: {
  productId: string
  zonePrices: ZonePrice[]
  currency: string
  pricingModel: string
}) {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [datetime, setDatetime] = useState('')
  const [passengers, setPassengers] = useState(2)
  const [luggage, setLuggage] = useState(2)
  const [flight, setFlight] = useState('')
  const [fromZone, setFromZone] = useState('')
  const [toZone, setToZone] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [quote, setQuote] = useState<{ amount: number; currency: string; exchange_rate: number } | null>(null)
  const [distanceKm, setDistanceKm] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const zones = useMemo(() => {
    const set = new Map<string, string>()
    for (const z of zonePrices) {
      set.set(z.from_zone.id, z.from_zone.name)
      set.set(z.to_zone.id, z.to_zone.name)
    }
    return Array.from(set.entries()).map(([id, name]) => ({ id, name }))
  }, [zonePrices])

  async function fetchQuote() {
    if (pricingModel === 'distance_based') {
      if (!distanceKm || Number(distanceKm) <= 0) return
      const url = `/api/pricing/transfer-distance-quote?transferId=${productId}&distance=${distanceKm}&currency=${currency}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setQuote({ amount: data.amount, currency: data.currency, exchange_rate: data.exchange_rate })
      } else {
        setQuote(null)
      }
    } else {
      if (!fromZone || !toZone) return
      const url = `/api/pricing/transfer-quote?transferId=${productId}&from=${fromZone}&to=${toZone}&vehicle=${vehicle}&currency=${currency}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setQuote({ amount: data.amount, currency: data.currency, exchange_rate: data.exchange_rate })
      } else {
        setQuote(null)
      }
    }
  }

  async function addToCart() {
    setLoading(true)
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
          bookingDate: datetime ? datetime.split('T')[0] : undefined,
          bookingTime: datetime ? datetime.split('T')[1] : undefined,
          specialRequirements: `pickup:${pickup}; dropoff:${dropoff}; pax:${passengers}; bags:${luggage}; flight:${flight}; fromZone:${fromZone}; toZone:${toZone}; vehicle:${vehicle}`,
          overrideUnitPrice: quote?.amount,
          overrideExchangeRate: quote?.exchange_rate,
          transferMeta: {
            from_zone_id: fromZone,
            to_zone_id: toZone,
            vehicle_type: vehicle || null,
            pickup,
            dropoff,
            pickup_datetime: datetime || null,
            passenger_count: passengers,
            luggage_count: luggage,
            flight_number: flight || null,
          },
        }),
      })
      router.push('/checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {pricingModel !== 'distance_based' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink">From Zone</label>
            <select value={fromZone} onChange={e => setFromZone(e.target.value)} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="">Select</option>
              {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">To Zone</label>
            <select value={toZone} onChange={e => setToZone(e.target.value)} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="">Select</option>
              {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
          </div>
        </div>
      )}
      {pricingModel === 'distance_based' && (
        <div>
          <label className="block text-sm font-medium text-ink">Distance (km)</label>
          <input type="number" min={1} value={distanceKm} onChange={e => setDistanceKm(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-ink">Vehicle</label>
        <select value={vehicle} onChange={e => setVehicle(e.target.value)} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
          <option value="">Any</option>
          <option value="sedan">Sedan</option>
          <option value="minivan">Minivan</option>
          <option value="bus">Bus</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Pickup Location</label>
        <input value={pickup} onChange={e => setPickup(e.target.value)} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. SSR Airport" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Dropoff Location</label>
        <input value={dropoff} onChange={e => setDropoff(e.target.value)} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. Grand Baie Hotel" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Pickup Date & Time</label>
        <input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink">Passengers</label>
          <input type="number" min={1} value={passengers} onChange={e => setPassengers(parseInt(e.target.value || '1', 10))} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Luggage</label>
          <input type="number" min={0} value={luggage} onChange={e => setLuggage(parseInt(e.target.value || '0', 10))} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Flight Number (optional)</label>
        <input value={flight} onChange={e => setFlight(e.target.value)} className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. MK045" />
      </div>
      <div>
        <button type="button" onClick={fetchQuote} className="w-full rounded-xl border border-sand-300 px-4 py-2 text-ink">Get price</button>
        {quote && <div className="mt-2 text-sm text-ink">Price: {quote.currency} {quote.amount.toFixed(2)}</div>}
      </div>
      <button onClick={addToCart} disabled={loading} className="w-full rounded-xl bg-brand-700 px-4 py-2 text-white transition-colors hover:bg-brand-800 disabled:opacity-50">
        {loading ? 'Adding…' : 'Add to cart'}
      </button>
    </div>
  )
}
