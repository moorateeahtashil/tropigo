import { Card, CardBody, CardMedia } from '@/components/ui/Card'

export default function CategoryCard({
  name,
  image,
  href = '#',
}: {
  name: string
  image?: string
  href?: string
}) {
  return (
    <a href={href} className="block">
      <Card>
        {image && <CardMedia src={image} alt={name} aspect="aspect-[16/10]" />}
        <CardBody>
          <h4 className="font-headline text-lg text-primary">{name}</h4>
        </CardBody>
      </Card>
    </a>
  )
}

