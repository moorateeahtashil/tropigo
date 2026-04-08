import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    const textareaId = id ?? props.name

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-ink">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'block w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-ink shadow-sm transition-colors resize-none',
            'placeholder:text-ink-muted',
            'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
            'disabled:cursor-not-allowed disabled:bg-sand-100',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
              : 'border-sand-300 hover:border-sand-400',
            className,
          )}
          rows={props.rows ?? 4}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-ink-muted">{hint}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

export { Textarea }
