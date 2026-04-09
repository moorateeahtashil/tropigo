import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPublishedTrips } from '@/features/catalog/queries'
import { getPublishedDestinations } from '@/features/catalog/queries'
import { getTestimonials } from '@/features/content/queries'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
  title: 'Tropigo — Mauritius Guided Trips, Transfers & Packages',
  description:
    'Premium Mauritius experiences. Book guided driving tours, private airport transfers, and curated holiday packages with experienced local drivers.',
}

export const revalidate = 3600

export default async function HomePage() {
  const [trips, destinations, testimonials] = await Promise.all([
    getPublishedTrips({ featured: true, limit: 6 }),
    getPublishedDestinations({ featured: true, limit: 3 }),
    getTestimonials({ limit: 4 }),
  ])

  return (
    <>
      <Header />
      <HomePageClient
        trips={trips}
        destinations={destinations}
        testimonials={testimonials}
      />
      <Footer />
    </>
  )
}
