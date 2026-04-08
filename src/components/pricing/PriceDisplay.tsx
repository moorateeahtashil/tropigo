import { formatCurrency } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface PriceDisplayProps {
  amount: number
  currency: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  prefix?: string
  className?: string
  showCurrencyCode?: boolean
}

export function PriceDisplay({
  amount,
  currency,
  size = 'md',
  prefix = 'From',
  className,
  showCurrencyCode = false,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl',
  }

  const prefixClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  }

  return (
    <div className={cn('flex items-baseline gap-1', className)}>
      {prefix && (
        <span className={cn('text-ink-muted font-normal', prefixClasses[size])}>
          {prefix}
        </span>
      )}
      <span className={cn('font-semibold text-ink', sizeClasses[size])}>
        {formatCurrency(amount, currency)}
      </span>
      {showCurrencyCode && (
        <span className={cn('text-ink-muted font-normal', prefixClasses[size])}>
          {currency}
        </span>
      )}
    </div>
  )
}

interface PriceSummaryRowProps {
  label: string
  amount: number
  currency: string
  highlight?: boolean
  strikethrough?: boolean
}

export function PriceSummaryRow({
  label,
  amount,
  currency,
  highlight = false,
  strikethrough = false,
}: PriceSummaryRowProps) {
  return (
    <div className={cn('flex items-center justify-between py-1.5', highlight && 'font-semibold')}>
      <span className={cn('text-sm', highlight ? 'text-ink' : 'text-ink-secondary')}>
        {label}
      </span>
      <span
        className={cn(
          'text-sm',
          highlight ? 'text-ink text-base font-semibold' : 'text-ink',
          strikethrough && 'line-through text-ink-muted',
        )}
      >
        {formatCurrency(amount, currency)}
      </span>
    </div>
  )
}

interface SavingsBadgeProps {
  savings: number
  currency: string
  discountPercent?: number
}

export function SavingsBadge({ savings, currency, discountPercent }: SavingsBadgeProps) {
  if (savings <= 0) return null

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      Save {formatCurrency(savings, currency)}
      {discountPercent != null && ` (${discountPercent}% off)`}
    </span>
  )
}
