'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from '@/features/pricing/types'

const COOKIE_NAME = 'tropigo_currency'
const EVENT_NAME = 'currency:change'

// Read cookie from document.cookie (works for SSR-set cookies)
function getCookieCurrency(): string {
  if (typeof document === 'undefined') return DEFAULT_CURRENCY
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : DEFAULT_CURRENCY
}

export function CurrencySwitcher({ className, variant = 'pill' }: { className?: string; variant?: 'pill' | 'select' }) {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY)

  // Initialize from cookie
  useEffect(() => {
    setCurrencyState(getCookieCurrency())
  }, [])

  // Listen for currency changes from other components
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string
      if (detail) setCurrencyState(detail)
    }
    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  }, [])

  const setCurrency = (code: string) => {
    const valid = SUPPORTED_CURRENCIES.find(c => c.code === code)
    if (!valid) return

    setCurrencyState(code)
    localStorage.setItem(COOKIE_NAME, code)
    // Set cookie for SSR (1 year)
    document.cookie = `${COOKIE_NAME}=${code}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`
    // Dispatch event
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: code }))
  }

  if (variant === 'select') {
    return (
      <select
        value={currency}
        onChange={e => setCurrency(e.target.value)}
        className={cn(
          'rounded-lg border border-sand-300 bg-white px-2 py-1 text-sm text-ink',
          'focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary',
          className,
        )}
        aria-label="Select currency"
      >
        {SUPPORTED_CURRENCIES.map(c => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center rounded-xl border border-sand-200 bg-white p-1',
        className,
      )}
      role="group"
      aria-label="Currency selector"
    >
      {SUPPORTED_CURRENCIES.map(c => (
        <button
          key={c.code}
          onClick={() => setCurrency(c.code)}
          className={cn(
            'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
            currency === c.code
              ? 'bg-secondary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-sand-50',
          )}
          aria-pressed={currency === c.code}
        >
          {c.code}
        </button>
      ))}
    </div>
  )
}
