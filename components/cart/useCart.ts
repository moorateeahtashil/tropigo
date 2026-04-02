"use client"

import { useEffect, useState } from 'react'

export type CartItem = {
  tourId: string
  date: string
  slotId: string
  quantity: number
  pickupId?: string
  pickupLocation?: string
  couponCode?: string
}

export function useCart() {
  const [item, setItem] = useState<CartItem | null>(null)

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('cart') : null
    if (raw) setItem(JSON.parse(raw))
  }, [])

  function save(next: CartItem | null) {
    setItem(next)
    if (next) window.localStorage.setItem('cart', JSON.stringify(next))
    else window.localStorage.removeItem('cart')
  }

  return { item, setItem: save, clear: () => save(null) }
}

