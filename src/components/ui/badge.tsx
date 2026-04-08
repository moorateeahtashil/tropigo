import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-sand-100 text-ink-secondary',
        brand: 'bg-brand-50 text-brand-700',
        lagoon: 'bg-lagoon-50 text-lagoon-700',
        gold: 'bg-gold-50 text-gold-700',
        success: 'bg-emerald-50 text-emerald-700',
        warning: 'bg-amber-50 text-amber-700',
        danger: 'bg-red-50 text-red-700',
        outline: 'border border-sand-300 text-ink-secondary bg-transparent',
        dark: 'bg-ink text-white',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export function BookingStatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    confirmed: { variant: 'success', label: 'Confirmed' },
    pending: { variant: 'warning', label: 'Pending' },
    processing: { variant: 'brand', label: 'Processing' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    failed: { variant: 'danger', label: 'Failed' },
    refunded: { variant: 'default', label: 'Refunded' },
    draft: { variant: 'default', label: 'Draft' },
  }

  const { variant, label } = config[status] ?? { variant: 'default', label: status }
  return <Badge variant={variant}>{label}</Badge>
}

export function ProductStatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    published: { variant: 'success', label: 'Published' },
    draft: { variant: 'warning', label: 'Draft' },
    archived: { variant: 'default', label: 'Archived' },
  }

  const { variant, label } = config[status] ?? { variant: 'default', label: status }
  return <Badge variant={variant}>{label}</Badge>
}

export function ProductTypeBadge({ type }: { type: string }) {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    activity: { variant: 'lagoon', label: 'Activity' },
    airport_transfer: { variant: 'brand', label: 'Transfer' },
    package: { variant: 'gold', label: 'Package' },
  }

  const { variant, label } = config[type] ?? { variant: 'default', label: type }
  return <Badge variant={variant}>{label}</Badge>
}

export { Badge, badgeVariants }
