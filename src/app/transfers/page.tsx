import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPublishedTransfers } from '@/features/catalog/queries'
import { resolveProductPriceBatch } from '@/features/pricing/resolve'
import { cookies } from 'next/headers'
import { formatCurrency } from '@/lib/utils/format'

export const revalidate = 600

export default async function TransfersPage() {
  const currency = (await cookies()).get('tropigo_currency')?.value || 'EUR'
  const transfers = await getPublishedTransfers({ limit: 24 })
  const priceMap = await resolveProductPriceBatch(
    transfers.map(t => ({ id: t.id, base_price: t.base_price, base_currency: t.base_currency })),
    currency,
  )

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        <div className="mb-8">
          <h1 className="heading-display text-4xl">Airport Transfers</h1>
          <p className="mt-2 text-ink-secondary">Private door-to-door transfers across Mauritius.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {transfers.map(t => (
            <Link key={t.id} href={`/transfers/${t.slug}`} className="group overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="relative h-52 w-full">
                {t.cover_image_url ? (
                  <Image src={t.cover_image_url} alt={t.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-sand-100" />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-ink">{t.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-secondary">{t.summary}</p>
                <div className="mt-3 text-sm text-ink">
                  {(() => {
                    if (!t.base_price) return <span>View zones & pricing</span>
                    const rp = priceMap.get(t.id)
                    if (!rp) return <span>View zones & pricing</span>
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
