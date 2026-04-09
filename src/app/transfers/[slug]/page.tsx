import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getTransferBySlug } from '@/features/catalog/queries'
import { cookies } from 'next/headers'
import { ProductGallery } from '@/components/product/ProductGallery'
import { TransferBookingWidget } from './TransferBookingWidget'

export const revalidate = 600

export default async function TransferDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const currency = (await cookies()).get('tropigo_currency')?.value || 'EUR'
  const transfer = await getTransferBySlug(resolvedParams.slug)
  if (!transfer) return notFound()

  // Get media items for gallery
  const media = (transfer as any).product_media || []
  const galleryMedia = media
    .filter((m: any) => m.url)
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((m: any) => ({
      url: m.url,
      alt: m.alt || transfer.title,
      is_cover: m.is_cover,
      media_type: m.media_type || 'image',
    }))

  const { airport_transfers: config } = transfer
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: transfer.title,
    description: transfer.summary || transfer.description || undefined,
    areaServed: 'Mauritius',
    provider: { '@type': 'Organization', name: 'Tropigo' },
  }

  return (
    <>
      <Header />
      <main className="pb-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Gallery */}
        <section className="container-page mt-8">
          {galleryMedia.length > 0 ? (
            <ProductGallery media={galleryMedia} title={transfer.title} />
          ) : transfer.cover_image_url ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-sand-100">
              <Image src={transfer.cover_image_url} alt={transfer.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-sand-100" />
          )}
        </section>

        {/* Title */}
        <section className="container-page mt-8">
          <h1 className="heading-display">{transfer.title}</h1>
          <p className="mt-2 text-ink-secondary">
            Private • {config.vehicle_type} • up to {config.max_passengers} passengers
          </p>
        </section>

        <section className="container-page mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="mb-3 text-xl font-semibold text-ink">Zone Pricing</h2>
            <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-sand-50 text-ink-muted">
                  <tr>
                    <th className="px-4 py-2">From</th>
                    <th className="px-4 py-2">To</th>
                    <th className="px-4 py-2">Vehicle</th>
                    <th className="px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {transfer.zone_prices.map((z: any) => (
                    <tr key={z.from_zone.id + z.to_zone.id + (z.vehicle_type || '')} className="border-t border-sand-100">
                      <td className="px-4 py-2">{z.from_zone.name}</td>
                      <td className="px-4 py-2">{z.to_zone.name}</td>
                      <td className="px-4 py-2">{z.vehicle_type || 'Any'}</td>
                      <td className="px-4 py-2">{transfer.base_currency} {Number(z.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="sticky top-24 h-max rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
            <TransferBookingWidget productId={transfer.id} zonePrices={transfer.zone_prices} currency={currency} pricingModel={config.pricing_model} />
          </aside>
        </section>
      </main>
      <Footer />
    </>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const product = await getTransferBySlug(resolvedParams.slug)
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
