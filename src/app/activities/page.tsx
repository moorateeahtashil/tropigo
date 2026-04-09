import { getPublishedActivities, getPublishedDestinations } from '@/features/catalog/queries'
import { resolveProductPriceBatch } from '@/features/pricing/resolve'
import { cookies } from 'next/headers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import ActivitiesPageClient from './ActivitiesPageClient'

export const revalidate = 600

export default async function ActivitiesPage() {
  const cookieStore = await cookies()
  const currency = cookieStore.get('tropigo_currency')?.value || 'EUR'
  
  const [activities, destinations] = await Promise.all([
    getPublishedActivities({ limit: 50 }),
    getPublishedDestinations({ limit: 20 }),
  ])
  
  const priceMap = await resolveProductPriceBatch(
    activities.map(a => ({ id: a.id, base_price: a.base_price, base_currency: a.base_currency })),
    currency,
  )

  return (
    <>
      <Header />
      <ActivitiesPageClient activities={activities} destinations={destinations} priceMap={priceMap} currency={currency} />
      <Footer />
    </>
  )
}
