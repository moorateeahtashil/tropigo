import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPackageBySlug } from '@/features/catalog/queries'
import { cookies } from 'next/headers'
import { resolveProductPrice } from '@/features/pricing/resolve'
import { ProductGallery } from '@/components/product/ProductGallery'
import { PackageBookingWidget } from './PackageBookingWidget'
import { Check, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export const revalidate = 600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const product = await getPackageBySlug(resolvedParams.slug)
  if (!product) return {}
  return {
    title: product.seo_title || product.title,
    description: product.seo_description || product.summary || undefined,
    openGraph: {
      title: product.seo_title || product.title,
      description: product.seo_description || product.summary || undefined,
      images: product.cover_image_url ? [{ url: product.cover_image_url }] : undefined,
    },
  }
}

export default async function PackageDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const currency = (await cookies()).get('tropigo_currency')?.value || 'EUR'
  const pkg = await getPackageBySlug(resolvedParams.slug)
  if (!pkg) return notFound()
  const display = pkg.base_price ? await resolveProductPrice(pkg.id, currency) : null

  // Get media items for gallery
  const media = (pkg as any).product_media || []
  const galleryMedia = media
    .filter((m: any) => m.url)
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((m: any) => ({
      url: m.url,
      alt: m.alt || pkg.title,
      is_cover: m.is_cover,
      media_type: m.media_type || 'image',
    }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pkg.title,
    description: pkg.summary || pkg.description || undefined,
    image: pkg.cover_image_url || undefined,
    offers: display ? {
      '@type': 'Offer',
      priceCurrency: display.currency,
      price: display.amount,
      availability: 'https://schema.org/InStock'
    } : undefined,
  }

  const items = (pkg as any).package_items || []
  const sortedItems = items.sort((a: any, b: any) => a.sort_order - b.sort_order)
  const includedItems = sortedItems.filter((item: any) => !item.is_optional)
  const optionalItems = sortedItems.filter((item: any) => item.is_optional)

  return (
    <>
      <Header />
      <main className="pb-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Hero with gallery */}
        <section className="container-page mt-8">
          {galleryMedia.length > 0 ? (
            <ProductGallery media={galleryMedia} title={pkg.title} />
          ) : pkg.cover_image_url ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-sand-100">
              <Image src={pkg.cover_image_url} alt={pkg.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-sand-100" />
          )}
        </section>

        <section className="container-page mt-8">
          <h1 className="heading-display">{pkg.title}</h1>
          {pkg.subtitle && <p className="mt-2 text-lg text-ink-secondary">{pkg.subtitle}</p>}
        </section>

        <section className="container-page mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {pkg.description && (
              <div className="prose max-w-none text-ink-secondary whitespace-pre-line">{pkg.description}</div>
            )}

            {/* Package highlights */}
            {(pkg as any).packages?.highlights?.length > 0 && (
              <div className="mt-8 rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
                <h2 className="mb-4 text-xl font-semibold text-ink">Package Highlights</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {(pkg as any).packages.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Duration */}
            {(pkg as any).packages?.duration_days && (
              <div className="mt-6 flex items-center gap-4 text-sm text-ink-secondary">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {(pkg as any).packages.duration_days} day{(pkg as any).packages.duration_days > 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Included items */}
            {includedItems.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold text-ink">What&apos;s Included</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {includedItems.map((item: any) => {
                    const product = item.product
                    const coverMedia = product.product_media?.find((m: any) => m.is_cover)
                    return (
                      <li key={item.id} className="flex gap-4 rounded-xl border border-sand-200 bg-white p-4 shadow-card">
                        <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-sand-100">
                          {coverMedia?.url ? (
                            <Image src={coverMedia.url} alt={product.title} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl">🏝️</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-ink">{product.title}</h3>
                          <p className="mt-1 text-xs text-ink-secondary">{product.summary}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Optional items */}
            {optionalItems.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold text-ink">Optional Add-ons</h2>
                <ul className="space-y-3">
                  {optionalItems.map((item: any) => {
                    const product = item.product
                    const coverMedia = product.product_media?.find((m: any) => m.is_cover)
                    return (
                      <li key={item.id} className="flex items-center gap-4 rounded-xl border border-dashed border-sand-300 bg-sand-50 p-4">
                        <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                          {coverMedia?.url ? (
                            <Image src={coverMedia.url} alt={product.title} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl">🎯</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-ink">{product.title}</h3>
                          <p className="text-xs text-ink-secondary">{product.summary}</p>
                        </div>
                        <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                          Optional
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Important notes */}
            {(pkg as any).packages?.important_notes && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="mb-2 text-sm font-semibold text-amber-800">Important Notes</h3>
                <p className="text-sm text-amber-700 whitespace-pre-line">{(pkg as any).packages.important_notes}</p>
              </div>
            )}
          </div>

          <aside className="sticky top-24 h-max space-y-4">
            <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
              <div className="mb-3 text-sm text-ink-muted">Package Price</div>
              {display && (
                <div className="mb-4 text-2xl font-bold text-ink">{display.currency} {display.amount.toFixed(2)}</div>
              )}
              <PackageBookingWidget productId={pkg.id} items={sortedItems} />
            </div>

            {/* Trust signals */}
            <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
              <h3 className="mb-3 text-sm font-medium text-ink-muted">What&apos;s Included</h3>
              <ul className="space-y-2 text-sm">
                {includedItems.map((item: any) => (
                  <li key={item.id} className="flex items-center gap-2 text-ink-secondary">
                    <Check className="h-4 w-4 text-green-600" />
                    {item.product?.title || 'Activity'}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  )
}

