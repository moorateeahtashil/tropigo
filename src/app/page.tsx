import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPublishedActivities } from '@/features/catalog/queries'
import { getPublishedDestinations } from '@/features/catalog/queries'
import { getTestimonials } from '@/features/content/queries'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
  title: 'Tropigo — Curated Mauritius Excellence',
  description:
    'Premium Mauritius experiences. Book private airport transfers, island day trips, activities, and curated holiday packages.',
}

export const revalidate = 3600

export default async function HomePage() {
  const [activities, destinations, testimonials] = await Promise.all([
    getPublishedActivities({ featured: true, limit: 6 }),
    getPublishedDestinations({ featured: true, limit: 3 }),
    getTestimonials({ limit: 4 }),
  ])

  return (
    <>
      <Header />
      <HomePageClient
        activities={activities}
        destinations={destinations}
        testimonials={testimonials}
      />
      <Footer />
    </>
  )
}
