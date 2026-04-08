'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from '@/features/pricing/types'

const STORAGE_KEY = 'tropigo_currency'

export function useCurrency() {
  const [currency, setCurrencyState] = useState<string>(DEFAULT_CURRENCY)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const valid = SUPPORTED_CURRENCIES.find(c => c.code === stored)
    if (valid) setCurrencyState(valid.code)
  }, [])

  function setCurrency(code: string) {
    const valid = SUPPORTED_CURRENCIES.find(c => c.code === code)
    if (!valid) return
    setCurrencyState(code)
    localStorage.setItem(STORAGE_KEY, code)
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent('currency-change', { detail: code }))
  }

  return { currency, setCurrency }
}

interface CurrencySwitcherProps {
  className?: string
  variant?: 'pill' | 'select'
}

export function CurrencySwitcher({ className, variant = 'pill' }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency()

  if (variant === 'select') {
    return (
      <select
        value={currency}
        onChange={e => {
          setCurrency(e.target.value)
          // also set a cookie for SSR pages (1 year)
          document.cookie = `${STORAGE_KEY}=${e.target.value}; Path=/; Max-Age=${60*60*24*365}`
        }}
        className={cn(
          'rounded-lg border border-sand-300 bg-white px-2 py-1 text-sm text-ink',
          'focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500',
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
          onClick={() => {
            setCurrency(c.code)
            document.cookie = `${STORAGE_KEY}=${c.code}; Path=/; Max-Age=${60*60*24*365}`
          }}
          className={cn(
            'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
            currency === c.code
              ? 'bg-brand-700 text-white shadow-sm'
              : 'text-ink-secondary hover:text-ink hover:bg-sand-50',
          )}
          aria-pressed={currency === c.code}
        >
          {c.symbol} {c.code}
        </button>
      ))}
    </div>
  )
}
