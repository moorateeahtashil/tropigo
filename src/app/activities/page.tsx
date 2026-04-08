import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPublishedActivities, getPublishedDestinations } from '@/features/catalog/queries'
import { resolveProductPriceBatch } from '@/features/pricing/resolve'
import { cookies } from 'next/headers'
import { formatCurrency } from '@/lib/utils/format'
import { Search, Filter, MapPin, Clock, Star, ArrowRight, Headphones } from 'lucide-react'

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
      <div className="min-h-screen pt-16 lg:grid lg:grid-cols-[350px_1fr]">
        {/* ---- SIDEBAR FILTERS ---- */}
        <aside className="sticky top-16 z-40 hidden h-[calc(100vh-4rem)] flex-col overflow-y-auto border-r border-outline-variant/30 bg-surface-container-low p-8 lg:flex">
          <div className="mt-8">
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
              Reserve Excellence
            </span>
            <h2 className="heading-display mt-2 mb-8 text-3xl text-primary">Plan Your Experience</h2>
            
            <div className="space-y-6">
              {/* Destination Filter */}
              <div className="space-y-2">
                <label className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Where to?
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:ring-secondary"
                    defaultValue="all"
                  >
                    <option value="all">All Destinations</option>
                    {destinations.map(dest => (
                      <option key={dest.id} value={dest.slug}>{dest.name}</option>
                    ))}
                  </select>
                  <Filter className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                </div>
              </div>

              {/* Activity Type Filter */}
              <div className="space-y-2">
                <label className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Experience Type
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:ring-secondary"
                    defaultValue="all"
                  >
                    <option value="all">All Experiences</option>
                    <option value="private">Private Tours</option>
                    <option value="group">Group Tours</option>
                    <option value="shared">Shared Tours</option>
                  </select>
                  <Filter className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                </div>
              </div>

              {/* Duration Filter */}
              <div className="space-y-2">
                <label className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Duration
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:ring-secondary"
                    defaultValue="all"
                  >
                    <option value="all">All Durations</option>
                    <option value="short">Under 3 hours</option>
                    <option value="medium">3-6 hours</option>
                    <option value="long">Full day+</option>
                  </select>
                  <Clock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Price Range
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:ring-secondary"
                    defaultValue="all"
                  >
                    <option value="all">All Prices</option>
                    <option value="budget">Under €100</option>
                    <option value="mid">€100 - €300</option>
                    <option value="premium">€300+</option>
                  </select>
                  <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                </div>
              </div>

              {/* Search Button */}
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-label text-sm uppercase tracking-widest text-white transition-all hover:bg-on-primary-fixed">
                <Search className="h-5 w-5" />
                Check Availability
              </button>
            </div>

            {/* Live Support Card */}
            <div className="mt-12 rounded-2xl border border-primary/10 bg-primary/5 p-6">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-primary/60">
                Live Support
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
                  <Headphones className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary">Chat with Concierge</p>
                  <p className="text-[10px] text-on-surface-variant">Response time: &lt; 2 mins</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ---- MAIN CONTENT ---- */}
        <main className="w-full overflow-hidden">
          {/* Hero Section */}
          <section className="relative flex h-[500px] items-end overflow-hidden lg:h-[600px]">
            <Image
              src="https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1920&q=85"
              alt="Mauritius Activities"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            <div className="relative z-10 max-w-4xl px-12 pb-12">
              <span className="mb-4 block font-label text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">
                Expedited Premium Travel
              </span>
              <h1 className="heading-display mb-6 text-5xl leading-[1.1] text-white lg:text-7xl">
                Direct Access to <br />Unseen Mauritius
              </h1>
              <p className="mb-8 max-w-xl text-lg font-light text-white/80">
                Efficiently browse the island&apos;s most exclusive experiences, verified by our on-site experts.
              </p>
              <div className="flex gap-4">
                <button className="rounded-full bg-secondary px-8 py-3 font-label text-xs uppercase tracking-widest text-on-secondary transition-all hover:brightness-110">
                  Quick Explorer
                </button>
                <button className="rounded-full border border-white/30 px-8 py-3 font-label text-xs uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white/10">
                  View Map
                </button>
              </div>
            </div>
          </section>

          {/* Value Props */}
          <section className="border-b border-outline-variant/10 bg-white py-8">
            <div className="grid grid-cols-2 gap-8 px-12 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-secondary" />
                <span className="font-label text-[11px] font-bold uppercase tracking-wider text-primary">
                  Top 1% Experiences
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-secondary" />
                <span className="font-label text-[11px] font-bold uppercase tracking-wider text-primary">
                  Instant Confirmation
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Headphones className="h-5 w-5 text-secondary" />
                <span className="font-label text-[11px] font-bold uppercase tracking-wider text-primary">
                  24/7 Priority Support
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-secondary" />
                <span className="font-label text-[11px] font-bold uppercase tracking-wider text-primary">
                  Expert Verified
                </span>
              </div>
            </div>
          </section>

          {/* Top Regions */}
          <section className="bg-surface px-12 py-16">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="heading-display text-4xl text-primary">Top Regions</h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Curated selections for immediate booking.
                </p>
              </div>
              <Link
                href="/destinations"
                className="font-label text-[11px] font-bold uppercase tracking-widest text-secondary border-b border-secondary"
              >
                All Destinations
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {destinations.slice(0, 3).map(dest => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={dest.hero_image_url || 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80'}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="heading-display text-2xl">{dest.name}</h3>
                    <p className="mt-1 font-label text-[10px] uppercase tracking-widest text-white/70">
                      {dest.region}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Activities Grid */}
          <section className="bg-white px-12 py-16">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="heading-display text-4xl text-primary">All Activities</h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {activities.length} experiences available for booking.
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map(activity => (
                <Link
                  key={activity.id}
                  href={`/activities/${activity.slug}`}
                  className="group overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <div className="relative h-52 w-full">
                    {activity.cover_image_url ? (
                      <Image
                        src={activity.cover_image_url}
                        alt={activity.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-surface-container" />
                    )}
                    {activity.destination && (
                      <div className="absolute bottom-3 left-3">
                        <span className="flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          <MapPin className="h-3 w-3" />
                          {activity.destination.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-ink">{activity.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-secondary">{activity.summary}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-ink">
                        {(() => {
                          const rp = priceMap.get(activity.id)
                          if (!rp || !activity.base_price) return <span>Contact us</span>
                          return (
                            <>
                              <span className="text-ink-muted">From </span>
                              <strong>{formatCurrency(rp.amount, rp.currency)}</strong>
                            </>
                          )
                        })()}
                      </div>
                      <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary">
                        View <ArrowRight className="inline h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  )
}
