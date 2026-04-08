import { cn } from '@/lib/utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

function Card({ className, hover = false, padding = 'md', children, ...props }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-sand-200 bg-white shadow-card',
        hover && 'cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold text-ink', className)} {...props} />
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-ink-muted', className)} {...props} />
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-4 flex items-center gap-2 border-t border-sand-100 pt-4', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
