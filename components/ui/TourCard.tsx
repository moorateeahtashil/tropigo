import { Card, CardBody, CardMedia } from '@/components/ui/Card'

export default function TourCard({
  name,
  summary,
  image,
  price,
  currency,
  href = '#',
}: {
  name: string
  summary?: string
  image?: string
  price?: number
  currency?: string
  href?: string
}) {
  return (
    <a href={href} className="block">
      <Card>
        {image && <CardMedia src={image} alt={name} aspect="aspect-[16/10]" />}
        <CardBody>
          <h4 className="font-headline text-xl text-primary">{name}</h4>
          {summary && <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{summary}</p>}
          {price != null && (
            <p className="text-sm text-primary font-semibold mt-2">
              from {currency || 'MUR'} {Number(price).toLocaleString()}
            </p>
          )}
        </CardBody>
      </Card>
    </a>
  )
}

