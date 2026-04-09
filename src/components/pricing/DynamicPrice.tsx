'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatCurrency } from '@/lib/utils/format'
import { EVENT_NAME, COOKIE_NAME } from '@/components/pricing/CurrencySwitcher'
import { SUPPORTED_CURRENCIES } from '@/features/pricing/types'

const DEFAULT_CURRENCY = 'EUR'

function getStoredCurrency(): string {
  if (typeof document === 'undefined') return DEFAULT_CURRENCY
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  if (match) {
    const val = decodeURIComponent(match[1])
    if (SUPPORTED_CURRENCIES.find(c => c.code === val)) return val
  }
  const stored = localStorage.getItem(COOKIE_NAME)
  if (stored && SUPPORTED_CURRENCIES.find(c => c.code === stored)) return stored
  return DEFAULT_CURRENCY
}

interface PriceResolverProps {
  productId: string
  basePrice: number | null
  baseCurrency: string
  className?: string
}

export function DynamicPrice({ productId, basePrice, baseCurrency, className }: PriceResolverProps) {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initial = getStoredCurrency()
    setCurrency(initial)
    setMounted(true)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string
      if (detail) setCurrency(detail)
    }
    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  }, [])

  // Simple client-side conversion (assuming 1:1 for now, will fetch real rates)
  const getPrice = useCallback(() => {
    if (!basePrice) return null
    if (currency === baseCurrency) return { amount: basePrice, currency: baseCurrency }
    // For now, convert using approximate rates (in production, fetch from API)
    const rates: Record<string, number> = {
      EUR: 1,
      USD: 1.08,
      GBP: 0.86,
      MUR: 49.5,
    }
    const baseInEur = baseCurrency === 'EUR' ? basePrice : basePrice / (rates[baseCurrency] || 1)
    const converted = baseInEur * (rates[currency] || 1)
    return { amount: converted, currency }
  }, [basePrice, baseCurrency, currency])

  if (!mounted || !basePrice) {
    return <span className={className}>Contact us</span>
  }

  const price = getPrice()
  if (!price) return <span className={className}>Contact us</span>

  return (
    <span className={className}>
      <span className="text-on-surface-variant">From </span>
      <strong className="text-secondary">{formatCurrency(price.amount, price.currency)}</strong>
    </span>
  )
}

interface PriceListProps {
  activities: Array<{
    id: string
    base_price: number | null
    base_currency: string
  }>
  children: (prices: Map<string, { amount: number; currency: string }>) => React.ReactNode
}

export function PriceList({ activities, children }: PriceListProps) {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY)
  const [priceMap, setPriceMap] = useState<Map<string, { amount: number; currency: string }>>(new Map())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initial = getStoredCurrency()
    setCurrency(initial)
    setMounted(true)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string
      if (detail) setCurrency(detail)
    }
    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const rates: Record<string, number> = {
      EUR: 1,
      USD: 1.08,
      GBP: 0.86,
      MUR: 49.5,
    }
    const newMap = new Map()
    activities.forEach(a => {
      if (!a.base_price) return
      const baseInEur = a.base_currency === 'EUR' ? a.base_price : a.base_price / (rates[a.base_currency] || 1)
      const converted = baseInEur * (rates[currency] || 1)
      newMap.set(a.id, { amount: converted, currency })
    })
    setPriceMap(newMap)
  }, [activities, currency, mounted])

  if (!mounted) return null
  return <>{children(priceMap)}</>
}
