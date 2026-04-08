import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { getPublishedActivities } from '@/features/catalog/queries'
import { getPublishedDestinations } from '@/features/catalog/queries'
import { getTestimonials } from '@/features/content/queries'
import { formatCurrency } from '@/lib/utils/format'
import { resolveProductPriceBatch } from '@/features/pricing/resolve'
import { cookies } from 'next/headers'
import { Star, Clock, MapPin, Car, Waves, Package, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tropigo — Discover Mauritius, Your Way',
  description:
    'Premium Mauritius experiences. Book private airport transfers, island day trips, activities, and curated holiday packages.',
}

export const revalidate = 3600 // ISR: revalidate every hour

async function getHomeData(currency: string) {
  const [activities, destinations, testimonials] = await Promise.all([
    getPublishedActivities({ featured: true, limit: 6 }),
    getPublishedDestinations({ featured: true, limit: 3 }),
    getTestimonials({ limit: 4 }),
  ])
  const priceMap = await resolveProductPriceBatch(
    activities.map(a => ({ id: a.id, base_price: a.base_price, base_currency: a.base_currency })),
    currency,
  )
  return { activities, destinations, testimonials, priceMap }
}

export default async function HomePage() {
  const currency = (await cookies()).get('tropigo_currency')?.value || 'EUR'
  const { activities, destinations, testimonials, priceMap } = await getHomeData(currency)

  return (
    <>
      <Header />
      <main>
        {/* ---- HERO ---- */}
        <section className="relative flex min-h-[100svh] items-end overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1920&q=85"
              alt="Mauritius turquoise lagoon"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 hero-overlay" />
          </div>

          <div className="relative container-page w-full pb-20 pt-32 text-white">
            <div className="max-w-3xl animate-fade-in">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-lagoon-400" />
                Mauritius • Premium Travel Experiences
              </div>
              <h1 className="heading-display mb-6 text-5xl leading-none sm:text-6xl lg:text-7xl">
                Discover Mauritius,{' '}
                <em className="not-italic text-lagoon-300">Your Way</em>
              </h1>
              <p className="mb-8 text-lg text-white/80 sm:text-xl leading-relaxed max-w-xl">
                Premium airport transfers, island activities, and curated packages — designed for travellers who expect more.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="xl" variant="lagoon" asChild>
                  <Link href="/activities">
                    Explore Activities
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="secondary" asChild>
                  <Link href="/transfers">Book a Transfer</Link>
                </Button>
              </div>
            </div>

            {/* Quick stat bar */}
            <div className="mt-12 flex flex-wrap gap-6">
              {[
                { icon: <Car className="h-4 w-4" />, label: 'Airport Transfers', desc: 'From €35' },
                { icon: <Waves className="h-4 w-4" />, label: 'Activities', desc: 'Island experiences' },
                { icon: <Package className="h-4 w-4" />, label: 'Packages', desc: 'Save up to 15%' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{stat.label}</div>
                    <div className="text-xs text-white/70">{stat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- TRANSFERS CTA ---- */}
        <section className="bg-brand-950 text-white">
          <div className="container-page py-12">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lagoon-500/20">
                  <Car className="h-6 w-6 text-lagoon-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Private Airport Transfers</h2>
                  <p className="text-sm text-white/70">
                    Meet & greet · Flight tracking · Door-to-door · Available 24/7
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-white/60">From</div>
                  <div className="text-2xl font-bold">€35</div>
                </div>
                <Button variant="lagoon" size="lg" asChild>
                  <Link href="/transfers">Book Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ---- FEATURED ACTIVITIES ---- */}
        <section className="section-gap bg-sand-50">
          <div className="container-page">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-wider text-lagoon-600">
                  Experiences
                </p>
                <h2 className="heading-display text-4xl text-ink sm:text-5xl">Top Activities</h2>
                <p className="mt-3 text-ink-secondary">
                  Curated adventures for every kind of traveller.
                </p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/activities">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
              {activities.map(activity => (
                <Link
                  key={activity.id}
                  href={`/activities/${activity.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 animate-fade-in"
                >
                  <div className="relative h-52 overflow-hidden">
                    {activity.cover_image_url ? (
                      <Image
                        src={activity.cover_image_url}
                        alt={activity.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="h-full w-full bg-sand-200" />
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
                    {activity.activities?.duration_minutes && (
                      <div className="mb-2 flex items-center gap-1.5 text-xs text-ink-muted">
                        <Clock className="h-3.5 w-3.5" />
                        {Math.floor(activity.activities.duration_minutes / 60)}h{' '}
                        {activity.activities.duration_minutes % 60 > 0 &&
                          `${activity.activities.duration_minutes % 60}m`}
                      </div>
                    )}
                    <h3 className="mb-1.5 font-semibold text-ink leading-snug group-hover:text-brand-700 transition-colors">
                      {activity.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-ink-secondary">
                      {activity.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        {activity.base_price ? (
                          <>
                            <span className="text-xs text-ink-muted">From </span>
                            <span className="text-base font-semibold text-ink">
                              {(() => {
                                const rp = priceMap.get(activity.id)
                                return rp ? formatCurrency(rp.amount, rp.currency) : formatCurrency(activity.base_price!, activity.base_currency)
                              })()}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-semibold text-ink">Contact us</span>
                        )}
                      </div>
                      <span className="rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 group-hover:bg-brand-700 group-hover:text-white transition-colors">
                        View details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/activities">View all activities</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ---- DESTINATIONS ---- */}
        <section className="section-gap bg-white">
          <div className="container-page">
            <div className="mb-10 text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-lagoon-600">
                Explore
              </p>
              <h2 className="heading-display text-4xl text-ink sm:text-5xl">
                Discover Mauritius
              </h2>
              <p className="mt-3 text-ink-secondary">
                From powdery northern beaches to the wild southwestern coast.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {destinations.map((dest, i) => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'sm:col-span-2 h-80' : 'h-64'}`}
                >
                  {dest.hero_image_url ? (
                    <Image
                      src={dest.hero_image_url}
                      alt={dest.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-sand-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="text-xs font-medium text-white/70 mb-1">{dest.region}</div>
                    <h3 className="text-xl font-semibold">{dest.name}</h3>
                    <p className="mt-1 text-sm text-white/80 line-clamp-2">{dest.summary}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <Link href="/destinations">
                  All destinations <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ---- TESTIMONIALS ---- */}
        {testimonials.length > 0 && (
          <section className="section-gap bg-brand-950 text-white">
            <div className="container-page">
              <div className="mb-10 text-center">
                <p className="mb-2 text-sm font-medium uppercase tracking-wider text-lagoon-400">
                  Reviews
                </p>
                <h2 className="heading-display text-4xl sm:text-5xl">
                  What Our Guests Say
                </h2>
                <p className="mt-3 text-white/60">
                  Thousands of happy travellers trust Tropigo every year.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {testimonials.map(t => (
                  <div
                    key={t.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <div className="mb-3 flex items-center gap-1">
                      {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                      ))}
                    </div>
                    <p className="mb-4 text-sm text-white/80 leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div>
                      <div className="text-sm font-semibold">{t.author_name}</div>
                      {t.author_location && (
                        <div className="text-xs text-white/50">{t.author_location}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
