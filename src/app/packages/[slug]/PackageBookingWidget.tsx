'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'

export function PackageBookingWidget({ productId, items }: { productId: string; items: any[] }) {
  const [loading, setLoading] = useState(false)
  const [selectedOptional, setSelectedOptional] = useState<string[]>([])
  const router = useRouter()

  const optionalItems = items.filter((item: any) => item.is_optional)

  function toggleOptional(itemId: string) {
    setSelectedOptional(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  async function addToCart() {
    setLoading(true)
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
          specialRequirements: selectedOptional.length > 0
            ? `Optional items: ${selectedOptional.join(', ')}`
            : undefined,
        }),
      })
      router.push('/checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {optionalItems.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-ink">Optional Add-ons</h3>
          <ul className="space-y-2">
            {optionalItems.map((item: any) => (
              <li key={item.id} className="flex items-center gap-3 rounded-lg border border-sand-200 bg-sand-50 p-3">
                <input
                  type="checkbox"
                  checked={selectedOptional.includes(item.id)}
                  onChange={() => toggleOptional(item.id)}
                  className="h-4 w-4 rounded border-sand-300 text-brand-700 focus:ring-brand-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink">{item.product?.title}</div>
                  {item.notes && <div className="text-xs text-ink-muted">{item.notes}</div>}
                </div>
                {item.price_override && (
                  <div className="text-sm font-semibold text-ink">+{item.price_override}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button onClick={addToCart} disabled={loading} size="lg" className="w-full">
        {loading ? 'Adding…' : (<><Package className="mr-2 h-4 w-4" />Add Package to Cart</>)}
      </Button>
    </div>
  )
}
