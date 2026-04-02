type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

export default function Button({
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; rounded?: 'md' | 'xl' | 'full' }) {
  const base = 'inline-flex items-center justify-center font-label tracking-widest uppercase transition-colors'
  const sizeCls = size === 'sm' ? 'px-4 py-2 text-[11px]' : size === 'md' ? 'px-6 py-3 text-xs' : 'px-8 py-4 text-sm'
  const radius = rounded === 'full' ? 'rounded-full' : rounded === 'xl' ? 'rounded-xl' : 'rounded-md'
  const variantCls =
    variant === 'primary'
      ? 'bg-secondary text-on-secondary hover:opacity-90'
      : variant === 'secondary'
      ? 'bg-primary text-on-primary hover:bg-on-primary-fixed'
      : variant === 'outline'
      ? 'border border-outline-variant/60 text-primary hover:bg-surface-container'
      : 'text-primary hover:bg-surface-container'
  return (
    <button className={`${base} ${sizeCls} ${radius} ${variantCls} ${className || ''}`} {...rest}>
      {children}
    </button>
  )
}

