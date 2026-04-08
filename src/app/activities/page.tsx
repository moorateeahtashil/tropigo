import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPublishedActivities } from '@/features/catalog/queries'
import { resolveProductPriceBatch } from '@/features/pricing/resolve'
import { cookies } from 'next/headers'
import { formatCurrency } from '@/lib/utils/format'

export const revalidate = 600

export default async function ActivitiesPage() {
  const cookieStore = await cookies()
  const currency = cookieStore.get('tropigo_currency')?.value || 'EUR'
  const activities = await getPublishedActivities({ limit: 24 })
  const priceMap = await resolveProductPriceBatch(
    activities.map(a => ({ id: a.id, base_price: a.base_price, base_currency: a.base_currency })),
    currency,
  )

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        <div className="mb-8">
          <h1 className="heading-display text-4xl">Activities in Mauritius</h1>
          <p className="mt-2 text-ink-secondary">Curated experiences for every traveller.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map(a => (
            <Link key={a.id} href={`/activities/${a.slug}`} className="group overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="relative h-52 w-full">
                {a.cover_image_url ? (
                  <Image src={a.cover_image_url} alt={a.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-sand-100" />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-ink">{a.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-secondary">{a.summary}</p>
                <div className="mt-3 text-sm text-ink">
                  {(() => {
                    const rp = priceMap.get(a.id)
                    if (!rp || !a.base_price) return <span>Contact us</span>
                    return <><span className="text-ink-muted">From </span><strong>{formatCurrency(rp.amount, rp.currency)}</strong></>
                  })()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
