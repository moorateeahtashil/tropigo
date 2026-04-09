import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  hint?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, hint, leadingIcon, trailingIcon, id, ...props }, ref) => {
    const inputId = id ?? props.name

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leadingIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-ink-muted">
              {leadingIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type ?? 'text'}
            ref={ref}
            className={cn(
              'block w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink shadow-sm transition-all',
              'placeholder:text-on-surface-variant',
              'focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20',
              'disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                : 'border-outline-variant hover:border-secondary',
              leadingIcon && 'pl-11',
              trailingIcon && 'pr-11',
              className,
            )}
            {...props}
          />
          {trailingIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted">
              {trailingIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-ink-muted">{hint}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
