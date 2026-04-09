import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  ({ className = '', label, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 8)}`
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">{label}</label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }>(
  ({ className = '', label, id, ...props }, ref) => {
    const inputId = id || `textarea-${Math.random().toString(36).slice(2, 8)}`
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">{label}</label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 resize-y ${className}`}
          {...props}
        />
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { label?: string }>(
  ({ className = '', label, id, children, ...props }, ref) => {
    const inputId = id || `select-${Math.random().toString(36).slice(2, 8)}`
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">{label}</label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
    )
  }
)
Select.displayName = 'Select'

export function FieldLabel({ children, className = '', htmlFor }: { children: React.ReactNode; className?: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className={`mb-1.5 block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  )
}
