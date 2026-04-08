'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'
import { forwardRef } from 'react'
import React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900 shadow-sm hover:shadow-md',
        secondary:
          'bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 hover:border-brand-300 shadow-sm',
        outline:
          'border border-sand-300 text-ink-secondary bg-transparent hover:bg-sand-50 hover:border-sand-400',
        ghost:
          'text-ink-secondary hover:bg-sand-100 hover:text-ink',
        lagoon:
          'bg-lagoon-500 text-white hover:bg-lagoon-600 active:bg-lagoon-700 shadow-sm hover:shadow-md',
        danger:
          'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        'danger-outline':
          'border border-red-200 text-red-600 hover:bg-red-50',
        link:
          'text-brand-600 hover:text-brand-800 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        xs: 'h-7 px-3 text-xs rounded-lg',
        sm: 'h-8 px-3 text-sm rounded-lg',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, asChild, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className)

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        className: cn((children as any).props?.className, classes),
        ref,
        ...(disabled || loading ? { 'aria-disabled': true } : {}),
        ...props,
      })
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
