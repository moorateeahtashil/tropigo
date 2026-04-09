import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  label?: string
  hint?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, hint, options, placeholder, id, ...props }, ref) => {
    const selectId = id ?? props.name

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'block w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-9 text-sm text-ink shadow-sm transition-all',
              'focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20',
              'disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                : 'border-outline-variant hover:border-secondary',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-ink-muted">{hint}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'

export { Select }
