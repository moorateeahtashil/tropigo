import Badge from '@/components/ui/Badge'

export default function TourListItem({
  name,
  summary,
  image,
  price,
  currency,
  href = '#',
  featured,
  onSale,
  salePrice,
  duration,
  destinationName,
}: {
  name: string
  summary?: string
  image?: string
  price?: number
  currency?: string
  href?: string
  featured?: boolean
  onSale?: boolean
  salePrice?: number | null
  duration?: string | null
  destinationName?: string | null
}) {
  return (
    <a href={href} className="block bg-white rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[320px,1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image && (
          <img src={image} alt={name} className="w-full h-56 md:h-full object-cover" />
        )}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {featured && <Badge tone="primary">Featured</Badge>}
            {onSale && <Badge tone="secondary">Sale</Badge>}
          </div>
          <h3 className="font-headline text-2xl text-primary">{name}</h3>
          {summary && <p className="text-sm text-on-surface-variant line-clamp-2">{summary}</p>}
          <div className="flex items-center gap-4 text-sm text-outline mt-auto">
            {destinationName && <span>{destinationName}</span>}
            {duration && <span>• {duration}</span>}
          </div>
          <div className="text-primary font-semibold">
            {onSale && salePrice != null ? (
              <>
                <span className="mr-2">now {currency || 'MUR'} {Number(salePrice).toLocaleString()}</span>
                {price != null && (
                  <span className="line-through text-outline">{currency || 'MUR'} {Number(price).toLocaleString()}</span>
                )}
              </>
            ) : price != null ? (
              <>from {currency || 'MUR'} {Number(price).toLocaleString()}</>
            ) : null}
          </div>
        </div>
      </div>
    </a>
  )
}

