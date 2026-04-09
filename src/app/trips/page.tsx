import { getPublishedTrips, getPublishedDestinations } from '@/features/catalog/queries'
import { resolveProductPriceBatch } from '@/features/pricing/resolve'
import { cookies } from 'next/headers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import TripsPageClient from './TripsPageClient'

export const revalidate = 600

export const metadata = {
  title: 'Mauritius Trips & Guided Tours — Tropigo',
  description: 'Book premium guided driving tours across Mauritius. Private trips with experienced drivers, hotel pickup, and curated itineraries.',
}

export default async function TripsPage() {
  const cookieStore = await cookies()
  const currency = cookieStore.get('tropigo_currency')?.value || 'EUR'

  const [trips, destinations] = await Promise.all([
    getPublishedTrips({ limit: 50 }),
    getPublishedDestinations({ limit: 20 }),
  ])

  const priceMap = await resolveProductPriceBatch(
    trips.map(t => ({ id: t.id, base_price: t.base_price, base_currency: t.base_currency })),
    currency,
  )

  return (
    <>
      <Header />
      <TripsPageClient trips={trips} destinations={destinations} priceMap={priceMap} currency={currency} />
      <Footer />
    </>
  )
}
