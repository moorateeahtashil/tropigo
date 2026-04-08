import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPublishedPackages } from '@/features/catalog/queries'
import { resolveProductPriceBatch } from '@/features/pricing/resolve'
import { cookies } from 'next/headers'
import { formatCurrency } from '@/lib/utils/format'
import { Package, ArrowRight, Clock, Shield } from 'lucide-react'

export const revalidate = 600

export default async function PackagesPage() {
  const cookieStore = await cookies()
  const currency = cookieStore.get('tropigo_currency')?.value || 'EUR'
  const packages = await getPublishedPackages({ limit: 24 })
  
  const priceMap = await resolveProductPriceBatch(
    packages.map(p => ({ id: p.id, base_price: p.base_price, base_currency: p.base_currency })),
    currency,
  )

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <span className="font-label text-xs font-bold uppercase tracking-[0.3em] text-secondary">
            Curated Collections
          </span>
          <h1 className="heading-display mt-4 text-5xl text-primary md:text-6xl">
            Holiday Packages
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant">
            Multi-activity bundles designed for the ultimate Mauritius experience. Save more when you book together.
          </p>
        </div>

        {/* Value Props */}
        <section className="mb-16 grid grid-cols-1 gap-8 border-y border-surface-container py-8 md:grid-cols-3">
          <div className="flex items-center justify-center gap-4">
            <Package className="h-8 w-8 text-secondary" />
            <div>
              <p className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                Multi-Activity Bundles
              </p>
              <p className="text-xs text-on-surface-variant">Save up to 15%</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Shield className="h-8 w-8 text-secondary" />
            <div>
              <p className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                Expert Curated
              </p>
              <p className="text-xs text-on-surface-variant">Verified experiences</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Clock className="h-8 w-8 text-secondary" />
            <div>
              <p className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                Flexible Booking
              </p>
              <p className="text-xs text-on-surface-variant">Free cancellation</p>
            </div>
          </div>
        </section>

        {/* Packages Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map(p => (
            <Link
              key={p.id}
              href={`/packages/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="relative h-52 w-full">
                {p.cover_image_url ? (
                  <Image
                    src={p.cover_image_url}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-surface-container" />
                )}
                <div className="absolute right-3 top-3">
                  <span className="rounded-full bg-secondary/20 px-3 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-secondary backdrop-blur-md">
                    {p.item_count} Items
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-ink">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-secondary">{p.summary}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-ink">
                    {(() => {
                      const rp = priceMap.get(p.id)
                      if (!rp || !p.base_price) return <span>Contact us</span>
                      return (
                        <>
                          <span className="text-ink-muted">From </span>
                          <strong className="text-secondary">{formatCurrency(rp.amount, rp.currency)}</strong>
                        </>
                      )
                    })()}
                  </div>
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary">
                    View Details <ArrowRight className="inline h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="py-20 text-center">
            <Package className="mx-auto mb-4 h-16 w-16 text-ink-muted" />
            <h3 className="heading-display text-2xl text-primary">No packages available yet</h3>
            <p className="mt-2 text-on-surface-variant">
              We&apos;re curating amazing multi-activity bundles for you. Check back soon!
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
