import { format, formatDistanceToNow, parseISO } from 'date-fns'

// ---------------------------------------------------------------
// Currency formatting
// ---------------------------------------------------------------

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  MUR: 'Rs',
}

export function formatCurrency(
  amount: number,
  currency: string,
  options?: { compact?: boolean; decimals?: number },
): string {
  const { compact = false, decimals = 2 } = options ?? {}

  // Use Intl.NumberFormat for proper locale-aware formatting
  try {
    const formatter = new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      notation: compact ? 'compact' : 'standard',
    })
    return formatter.format(amount)
  } catch {
    // Fallback if currency code is unknown
    const symbol = CURRENCY_SYMBOLS[currency] ?? currency
    return `${symbol}${amount.toFixed(decimals)}`
  }
}

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency
}

// ---------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------

export function formatDate(date: string | Date, pattern = 'd MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern)
}

export function formatDatetime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'd MMM yyyy, HH:mm')
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

// ---------------------------------------------------------------
// Duration formatting
// ---------------------------------------------------------------

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  if (remaining === 0) return hours === 1 ? '1 hour' : `${hours} hours`
  return `${hours}h ${remaining}m`
}

// ---------------------------------------------------------------
// String formatting
// ---------------------------------------------------------------

export function formatBookingRef(ref: string): string {
  return ref.toUpperCase()
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatProductType(type: string): string {
  const labels: Record<string, string> = {
    airport_transfer: 'Airport Transfer',
    activity: 'Activity',
    package: 'Package',
  }
  return labels[type] ?? capitalize(type)
}

export function formatBookingStatus(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    pending: 'Pending',
    processing: 'Processing',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    failed: 'Failed',
    refunded: 'Refunded',
  }
  return labels[status] ?? capitalize(status)
}

export function formatVehicleType(type: string): string {
  const labels: Record<string, string> = {
    sedan: 'Sedan (up to 4 passengers)',
    minivan: 'Minivan (up to 8 passengers)',
    bus: 'Bus (up to 20 passengers)',
    luxury: 'Luxury Vehicle',
  }
  return labels[type] ?? capitalize(type)
}

// ---------------------------------------------------------------
// Number formatting
// ---------------------------------------------------------------

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatCount(count: number, noun: string): string {
  return `${count} ${noun}${count !== 1 ? 's' : ''}`
}
