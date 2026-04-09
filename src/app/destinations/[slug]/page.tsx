import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getDestinationBySlug, getPublishedTrips } from '@/features/catalog/queries'
import { cookies } from 'next/headers'
import { resolveProductPriceBatch } from '@/features/pricing/resolve'
import { formatCurrency } from '@/lib/utils/format'
import Link from 'next/link'
import { MapPin, Clock, Car, ArrowRight } from 'lucide-react'

export const revalidate = 600

export default async function DestinationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const currency = (await cookies()).get('tropigo_currency')?.value || 'EUR'

  const [destination, trips] = await Promise.all([
    getDestinationBySlug(resolvedParams.slug),
    getPublishedTrips({ destinationSlug: resolvedParams.slug }),
  ])

  if (!destination) return notFound()

  const priceMap = await resolveProductPriceBatch(
    trips.map(t => ({ id: t.id, base_price: t.base_price, base_currency: t.base_currency })),
    currency,
  )

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  const getTripPrice = (trip: typeof trips[0]) => {
    const rp = priceMap.get(trip.id)
    if (rp) return rp.amount
    if (trip.base_price) return Number(trip.base_price)
    return null
  }

  return (
    <>
      <Header />
      <main className="pb-16">
        {/* Hero */}
        <section className="relative h-[360px] w-full">
          {destination.hero_image_url ? (
            <Image src={destination.hero_image_url} alt={destination.name} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-sand-100" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container-page pb-6">
              <h1 className="heading-display text-white">{destination.name}</h1>
              {destination.region && (
                <p className="mt-2 flex items-center gap-1.5 text-white/80">
                  <MapPin className="h-4 w-4" />
                  {destination.region}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="container-page mt-10">
          {destination.description && (
            <div className="max-w-3xl whitespace-pre-line text-ink-secondary">{destination.description}</div>
          )}

          {/* Trips under this destination */}
          {trips.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-6 text-2xl font-semibold text-ink">
                Trips in {destination.name}
                <span className="ml-2 text-base font-normal text-ink-muted">({trips.length})</span>
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map(trip => {
                  const price = getTripPrice(trip)
                  const tripData = trip.trips as any
                  return (
                    <Link
                      key={trip.id}
                      href={`/trips/${trip.slug}`}
                      className="group overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                    >
                      <div className="relative h-48 w-full">
                        {trip.cover_image_url ? (
                          <Image src={trip.cover_image_url} alt={trip.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="h-full w-full bg-sand-100" />
                        )}
                        {tripData?.trip_type && (
                          <div className="absolute top-3 right-3">
                            <span className="rounded-full bg-brand-700/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                              {tripData.trip_type.charAt(0).toUpperCase() + tripData.trip_type.slice(1)}
                            </span>
                          </div>
                        )}
                        {tripData?.trip_mode === 'single_dropoff' && (
                          <div className="absolute top-3 left-3">
                            <span className="rounded-full bg-blue-600/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                              Drop-off
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-ink">{trip.title}</h3>
                        {trip.summary && <p className="mt-1 line-clamp-2 text-sm text-ink-secondary">{trip.summary}</p>}
                        <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
                          {tripData?.duration_minutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDuration(tripData.duration_minutes)}
                            </span>
                          )}
                          {tripData?.vehicle_type && (
                            <span className="flex items-center gap-1">
                              <Car className="h-3.5 w-3.5" />
                              {tripData.vehicle_type}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          {price ? (
                            <div className="text-sm text-ink">
                              <span className="text-ink-muted">From </span>
                              <strong className="text-secondary">{formatCurrency(price, currency)}</strong>
                            </div>
                          ) : (
                            <span className="text-sm text-ink-muted">Contact us</span>
                          )}
                          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary">
                            View <ArrowRight className="inline h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {trips.length === 0 && (
            <div className="mt-10 rounded-2xl border border-sand-200 bg-sand-50 py-16 text-center">
              <p className="text-lg font-medium text-ink">No trips available for this destination yet.</p>
              <p className="mt-2 text-ink-muted">Check back soon or contact us for custom arrangements.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

