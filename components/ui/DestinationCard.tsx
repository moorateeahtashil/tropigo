import { Card, CardBody, CardMedia } from '@/components/ui/Card'

export default function DestinationCard({
  name,
  summary,
  image,
  href = '#',
}: {
  name: string
  summary?: string
  image?: string
  href?: string
}) {
  return (
    <a href={href} className="block">
      <Card>
        {image && <CardMedia src={image} alt={name} />}
        <CardBody>
          <h4 className="font-headline text-xl text-primary">{name}</h4>
          {summary && <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{summary}</p>}
        </CardBody>
      </Card>
    </a>
  )
}

