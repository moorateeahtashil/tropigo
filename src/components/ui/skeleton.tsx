import { cn } from '@/lib/utils/cn'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-lg bg-gradient-to-r from-sand-100 via-sand-200 to-sand-100 bg-[length:200%_100%]',
        className,
      )}
      {...props}
    />
  )
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}

export { Skeleton, ProductCardSkeleton, TableRowSkeleton }
