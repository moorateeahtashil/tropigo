import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getTripBySlug } from '@/features/catalog/queries'
import { cookies } from 'next/headers'
import { ProductGallery } from '@/components/product/ProductGallery'
import { Check, X, Clock, Users, MapPin, Car, Calendar } from 'lucide-react'
import { TripBookingSection } from './TripBookingSection'

export const revalidate = 600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const product = await getTripBySlug(resolvedParams.slug)
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

export default async function TripDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const currency = (await cookies()).get('tropigo_currency')?.value || 'EUR'
  const trip = await getTripBySlug(resolvedParams.slug)
  if (!trip) return notFound()

  const media = (trip as any).product_media || []
  const galleryMedia = media
    .filter((m: any) => m.url)
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((m: any) => ({
      url: m.url,
      alt: m.alt || trip.title,
      is_cover: m.is_cover,
      media_type: m.media_type || 'image',
    }))

  const tripData = trip.trips as any

  return (
    <>
      <Header />
      <main className="pb-16">
        {/* Gallery */}
        <section className="container-page mt-8">
          {galleryMedia.length > 0 ? (
            <ProductGallery media={galleryMedia} title={trip.title} />
          ) : trip.cover_image_url ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-sand-100">
              <Image src={trip.cover_image_url} alt={trip.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-sand-100" />
          )}
        </section>

        {/* Title & Meta */}
        <section className="container-page mt-8">
          <div className="flex items-center gap-2">
            {tripData?.trip_mode && (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                tripData.trip_mode === 'single_dropoff'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-brand-100 text-brand-700'
              }`}>
                {tripData.trip_mode === 'single_dropoff' ? 'Drop-off' : 'Guided Tour'}
              </span>
            )}
            {tripData?.trip_type && (
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                {tripData.trip_type}
              </span>
            )}
          </div>
          <h1 className="heading-display mt-3">{trip.title}</h1>
          {trip.destination && (
            <p className="mt-2 flex items-center gap-1.5 text-ink-secondary">
              <MapPin className="h-4 w-4" />
              {trip.destination.name}
              {trip.destination.region && `, ${trip.destination.region}`}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-secondary">
            {tripData?.duration_minutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {tripData.duration_minutes >= 60
                  ? `${Math.floor(tripData.duration_minutes / 60)}h ${tripData.duration_minutes % 60 > 0 ? `${tripData.duration_minutes % 60}m` : ''}`
                  : `${tripData.duration_minutes} minutes`}
              </span>
            )}
            {tripData?.vehicle_type && (
              <span className="flex items-center gap-1.5">
                <Car className="h-4 w-4" />
                <span className="capitalize">{tripData.vehicle_type}</span>
              </span>
            )}
            {tripData?.max_passengers && (
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Up to {tripData.max_passengers} passengers
              </span>
            )}
            {tripData?.difficulty_level && (
              <span className="capitalize">{tripData.difficulty_level}</span>
            )}
          </div>
        </section>

        {/* Content + Booking Sidebar */}
        <section className="container-page mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <article className="space-y-8">
            {trip.summary && (
              <p className="text-lg text-ink-secondary">{trip.summary}</p>
            )}
            {trip.description && (
              <div className="whitespace-pre-line text-ink-secondary">{trip.description}</div>
            )}

            {/* Pickup Info */}
            {(tripData?.pickup_included || tripData?.dropoff_included) && (
              <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
                <h2 className="mb-4 text-xl font-semibold text-ink">Pickup & Dropoff</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {tripData?.pickup_included && (
                    <div className="rounded-lg bg-green-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                        <Check className="h-4 w-4" />
                        Pickup Included
                      </div>
                      {tripData?.pickup_location && (
                        <p className="mt-2 text-sm text-green-700">
                          {tripData.pickup_location}
                        </p>
                      )}
                      {tripData?.pickup_time && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                          <Clock className="h-3 w-3" />
                          {tripData.pickup_time}
                        </p>
                      )}
                    </div>
                  )}
                  {tripData?.dropoff_included && (
                    <div className="rounded-lg bg-blue-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                        <Check className="h-4 w-4" />
                        Dropoff Included
                      </div>
                      {tripData?.dropoff_location && (
                        <p className="mt-2 text-sm text-blue-700">
                          {tripData.dropoff_location}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Highlights */}
            {tripData?.highlights?.length ? (
              <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
                <h2 className="mb-4 text-xl font-semibold text-ink">Highlights</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {tripData.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* What's Included */}
            {tripData?.included_items?.length > 0 && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
                <h2 className="mb-4 text-lg font-semibold text-green-800">What&apos;s Included</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {tripData.included_items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Not Included */}
            {tripData?.excluded_items?.length > 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h2 className="mb-4 text-lg font-semibold text-red-800">What&apos;s Not Included</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {tripData.excluded_items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary (only for guided tours) */}
            {tripData?.trip_mode !== 'single_dropoff' && tripData?.itinerary?.length > 0 && (
              <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
                <h2 className="mb-4 text-xl font-semibold text-ink">Itinerary</h2>
                <div className="space-y-4">
                  {tripData.itinerary.map((step: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                          {i + 1}
                        </div>
                        {i < tripData.itinerary.length - 1 && (
                          <div className="h-full w-0.5 bg-sand-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-sm font-medium text-ink">{step.title}</div>
                        {step.time && <div className="text-xs text-ink-muted">{step.time}</div>}
                        {step.description && <div className="mt-1 text-sm text-ink-secondary">{step.description}</div>}
                        {step.photo_url && (
                          <div className="relative mt-2 h-32 overflow-hidden rounded-lg">
                            <Image src={step.photo_url} alt={step.title} fill className="object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Notes */}
            {tripData?.important_notes && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="mb-2 text-sm font-semibold text-amber-800">Important Notes</h3>
                <p className="text-sm text-amber-700 whitespace-pre-line">{tripData.important_notes}</p>
              </div>
            )}
          </article>

          {/* Booking Sidebar */}
          <aside className="sticky top-24 h-max">
            <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
              <TripBookingSection
                productId={trip.id}
                basePrice={trip.base_price ? Number(trip.base_price) : null}
                baseCurrency={trip.base_currency}
                minParticipants={tripData?.min_participants}
                maxParticipants={tripData?.max_participants}
                pickupIncluded={tripData?.pickup_included}
                pickupLocation={tripData?.pickup_location}
                pickupTime={tripData?.pickup_time}
              />
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  )
}
