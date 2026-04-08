'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

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
    transfer_details?: {
      pickup?: string
      dropoff?: string
      pickup_datetime?: string
      passenger_count?: number
    }
  }
  booking_date: string | null
  booking_time: string | null
  special_requirements: string | null
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadCart()
  }, [])

  async function loadCart() {
    try {
      const res = await fetch('/api/booking/cart')
      const json = await res.json()
      setItems(json.items || [])
    } catch (err) {
      console.error('Failed to load cart:', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity < 1) return
    setUpdating(itemId)
    try {
      const res = await fetch('/api/booking/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })
      if (!res.ok) throw new Error('Failed to update quantity')
      await loadCart()
    } catch (err) {
      console.error('Failed to update cart:', err)
    } finally {
      setUpdating(null)
    }
  }

  async function removeItem(itemId: string) {
    setUpdating(itemId)
    try {
      const res = await fetch('/api/booking/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })
      if (!res.ok) throw new Error('Failed to remove item')
      await loadCart()
    } catch (err) {
      console.error('Failed to remove item:', err)
    } finally {
      setUpdating(null)
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)
  const currency = items[0]?.currency || 'EUR'

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        <h1 className="heading-display">Your Cart</h1>

        {loading ? (
          <div className="mt-8 space-y-4">
            <div className="h-24 animate-pulse rounded-2xl bg-sand-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-sand-100" />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sand-100">
              <ShoppingBag className="h-10 w-10 text-ink-muted" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-ink">Your cart is empty</h2>
            <p className="mt-2 text-ink-secondary">
              Start exploring our activities, transfers, and packages to build your perfect Mauritius trip.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/activities">Browse Activities</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/transfers">Book a Transfer</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Cart items */}
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-sand-100">
                      {item.price_snapshot.cover_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.price_snapshot.cover_image_url}
                          alt={item.price_snapshot.product_title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl">
                          {item.product_type === 'airport_transfer' ? '🚗' : item.product_type === 'package' ? '📦' : '🏝️'}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-ink">
                              {item.price_snapshot.product_title}
                            </h3>
                            <span className="mt-1 inline-block rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium capitalize text-brand-700">
                              {item.product_type.replace('_', ' ')}
                            </span>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={updating === item.id}
                            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Transfer details */}
                        {item.price_snapshot.transfer_details && (
                          <div className="mt-2 space-y-1 text-xs text-ink-secondary">
                            {item.price_snapshot.transfer_details.pickup && (
                              <p>Pickup: {item.price_snapshot.transfer_details.pickup}</p>
                            )}
                            {item.price_snapshot.transfer_details.dropoff && (
                              <p>Dropoff: {item.price_snapshot.transfer_details.dropoff}</p>
                            )}
                            {item.price_snapshot.transfer_details.pickup_datetime && (
                              <p>
                                Date:{' '}
                                {new Date(
                                  item.price_snapshot.transfer_details.pickup_datetime,
                                ).toLocaleString()}
                              </p>
                            )}
                            {item.price_snapshot.transfer_details.passenger_count && (
                              <p>Passengers: {item.price_snapshot.transfer_details.passenger_count}</p>
                            )}
                          </div>
                        )}

                        {/* Activity date/time */}
                        {item.product_type === 'activity' && (item.booking_date || item.booking_time) && (
                          <div className="mt-2 text-xs text-ink-secondary">
                            {item.booking_date && <span>{item.booking_date}</span>}
                            {item.booking_time && <span> at {item.booking_time}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & quantity */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="text-lg font-semibold text-ink">
                        {item.currency} {(item.unit_price * item.quantity).toFixed(2)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updating === item.id}
                          className="rounded-lg border border-sand-200 p-1 transition-colors hover:bg-sand-50 disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                          className="rounded-lg border border-sand-200 p-1 transition-colors hover:bg-sand-50 disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-xs text-ink-muted">
                        {item.currency} {item.unit_price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary */}
            <aside className="h-max space-y-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
              <h2 className="text-lg font-semibold text-ink">Order Summary</h2>

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-ink-secondary">
                      {item.price_snapshot.product_title} × {item.quantity}
                    </span>
                    <span className="font-medium text-ink">
                      {item.currency} {(item.unit_price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-sand-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Subtotal</span>
                  <span className="text-xl font-bold text-ink">
                    {currency} {subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="ghost" asChild className="w-full" size="sm">
                <Link href="/activities">Continue Shopping</Link>
              </Button>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
