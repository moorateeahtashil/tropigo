import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getActivityBySlug } from '@/features/catalog/queries'
import { cookies } from 'next/headers'
import { ProductGallery } from '@/components/product/ProductGallery'
import { Check, X, Clock, Users, MapPin } from 'lucide-react'
import { ActivityBookingSection } from './ActivityBookingSection'

export const revalidate = 600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const product = await getActivityBySlug(resolvedParams.slug)
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

export default async function ActivityDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const currency = (await cookies()).get('tropigo_currency')?.value || 'EUR'
  const activity = await getActivityBySlug(resolvedParams.slug)
  if (!activity) return notFound()

  const media = (activity as any).product_media || []
  const galleryMedia = media
    .filter((m: any) => m.url)
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((m: any) => ({
      url: m.url,
      alt: m.alt || activity.title,
      is_cover: m.is_cover,
      media_type: m.media_type || 'image',
    }))

  const activities = activity.activities as any

  return (
    <>
      <Header />
      <main className="pb-16">
        <section className="container-page mt-8">
          {galleryMedia.length > 0 ? (
            <ProductGallery media={galleryMedia} title={activity.title} />
          ) : activity.cover_image_url ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-sand-100">
              <Image src={activity.cover_image_url} alt={activity.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-sand-100" />
          )}
        </section>

        <section className="container-page mt-8">
          <h1 className="heading-display">{activity.title}</h1>
          {activity.destination && (
            <p className="mt-2 flex items-center gap-1.5 text-ink-secondary">
              <MapPin className="h-4 w-4" />
              {activity.destination.name}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-secondary">
            {activities?.duration_minutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {activities.duration_minutes >= 60
                  ? `${Math.floor(activities.duration_minutes / 60)}h ${activities.duration_minutes % 60 > 0 ? `${activities.duration_minutes % 60}m` : ''}`
                  : `${activities.duration_minutes} minutes`}
              </span>
            )}
            {activities?.tour_type && (
              <span className="capitalize">{activities.tour_type} tour</span>
            )}
            {activities?.difficulty_level && (
              <span className="capitalize">{activities.difficulty_level}</span>
            )}
          </div>
        </section>

        <section className="container-page mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <article className="space-y-8">
            {activity.summary && (
              <p className="text-lg text-ink-secondary">{activity.summary}</p>
            )}
            {activity.description && (
              <div className="whitespace-pre-line text-ink-secondary">{activity.description}</div>
            )}
            {activities?.highlights?.length ? (
              <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
                <h2 className="mb-4 text-xl font-semibold text-ink">Highlights</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {activities.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {activities?.included_items?.length > 0 && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
                <h2 className="mb-4 text-lg font-semibold text-green-800">What&apos;s Included</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {activities.included_items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activities?.excluded_items?.length > 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h2 className="mb-4 text-lg font-semibold text-red-800">What&apos;s Not Included</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {activities.excluded_items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activities?.itinerary?.length > 0 && (
              <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
                <h2 className="mb-4 text-xl font-semibold text-ink">Itinerary</h2>
                <div className="space-y-4">
                  {activities.itinerary.map((step: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                          {i + 1}
                        </div>
                        {i < activities.itinerary.length - 1 && (
                          <div className="h-full w-0.5 bg-sand-200" />
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="text-sm font-medium text-ink">{step.title}</div>
                        {step.time && <div className="text-xs text-ink-muted">{step.time}</div>}
                        {step.description && <div className="mt-1 text-sm text-ink-secondary">{step.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activities?.important_notes && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="mb-2 text-sm font-semibold text-amber-800">Important Notes</h3>
                <p className="text-sm text-amber-700 whitespace-pre-line">{activities.important_notes}</p>
              </div>
            )}
          </article>

          <aside className="sticky top-24 h-max">
            <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
              <ActivityBookingSection
                productId={activity.id}
                basePrice={activity.base_price ? Number(activity.base_price) : null}
                baseCurrency={activity.base_currency}
                minParticipants={activities?.min_participants}
              />
            </div>
          </aside>
        </section>

        <section className="container-page mt-10">
          <ActivityReviewsSection productId={activity.id} />
        </section>
      </main>
      <Footer />
    </>
  )
}

// Server wrapper for client reviews
import { ActivityReviewsSection } from './ActivityReviewsSection'
