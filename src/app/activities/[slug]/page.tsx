import { redirect } from 'next/navigation'

export default function ActivitySlugRedirect({ params }: { params: { slug: string } }) {
  redirect('/trips')
}
