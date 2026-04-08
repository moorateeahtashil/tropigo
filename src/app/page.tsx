import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPublishedActivities } from '@/features/catalog/queries'
import { getPublishedDestinations } from '@/features/catalog/queries'
import { getTestimonials } from '@/features/content/queries'
import { formatCurrency } from '@/lib/utils/format'
import { resolveProductPriceBatch } from '@/features/pricing/resolve'
import { cookies } from 'next/headers'
import { Star, Shield, Headphones, Leaf, Gem, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tropigo — Curated Mauritius Excellence',
  description:
    'Premium Mauritius experiences. Book private airport transfers, island day trips, activities, and curated holiday packages.',
}

export const revalidate = 3600

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
        {/* ---- HERO SECTION ---- */}
        <section className="relative flex min-h-[100svh] items-end overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=2560&q=95"
              alt="Mauritius 4K aerial view of green island in turquoise water"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <span className="mb-6 font-label text-sm uppercase tracking-[0.4em] opacity-90">
              Private Island Sanctuary
            </span>
            <h1 className="heading-display mb-12 max-w-5xl text-5xl leading-tight md:text-8xl">
              Refined Luxury in the <br />Heart of the Lagoon
            </h1>
            
            {/* Quick actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/activities"
                className="rounded-full bg-secondary px-8 py-3 font-label text-sm uppercase tracking-widest text-on-secondary transition-all hover:brightness-110 active:scale-95"
              >
                Explore Activities
              </Link>
              <Link
                href="/transfers"
                className="rounded-full border border-white/30 bg-white/10 px-8 py-3 font-label text-sm uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Book Transfer
              </Link>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-3">
            <div className="h-1 w-12 rounded-full bg-white" />
            <div className="h-1 w-8 rounded-full bg-white/30" />
            <div className="h-1 w-8 rounded-full bg-white/30" />
          </div>
        </section>

        {/* ---- VALUE PROP STRIP ---- */}
        <section className="border-b border-surface-container bg-surface py-12 px-8">
          <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex items-center gap-4 group">
              <Shield className="h-9 w-9 text-secondary transition-transform group-hover:scale-110" />
              <div>
                <p className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Certified Luxury
                </p>
                <p className="text-xs text-on-surface-variant">Top experiences in Mauritius</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <Headphones className="h-9 w-9 text-secondary transition-transform group-hover:scale-110" />
              <div>
                <p className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  24/7 Concierge
                </p>
                <p className="text-xs text-on-surface-variant">Personalized itineraries</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <Leaf className="h-9 w-9 text-secondary transition-transform group-hover:scale-110" />
              <div>
                <p className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Sustainable Eco
                </p>
                <p className="text-xs text-on-surface-variant">Local heritage support</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <Gem className="h-9 w-9 text-secondary transition-transform group-hover:scale-110" />
              <div>
                <p className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Member Benefits
                </p>
                <p className="text-xs text-on-surface-variant">Exclusive island access</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- POPULAR DESTINATIONS BENTO GRID ---- */}
        <section className="bg-surface-container-low px-8 py-24">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <span className="font-label text-xs font-bold uppercase tracking-[0.3em] text-secondary">
                  Curated Atlas
                </span>
                <h2 className="heading-display mt-4 text-5xl text-primary md:text-6xl">
                  Discover Your Haven
                </h2>
                <p className="mt-6 text-lg text-on-surface-variant">
                  From the rugged peaks of Le Morne to the bustling turquoise waters of Grand Baie,
                  explore Mauritius through our curated lens of exclusivity.
                </p>
              </div>
              <Link
                href="/destinations"
                className="border-b-2 border-primary pb-1 font-label text-xs uppercase tracking-widest text-primary transition-all hover:border-secondary hover:text-secondary"
              >
                View All Destinations
              </Link>
            </div>

            <div className="grid h-[600px] grid-cols-1 gap-6 md:grid-cols-12 md:h-[800px]">
              {/* Main Card */}
              {destinations[0] && (
                <div className="group relative col-span-7 overflow-hidden rounded-3xl">
                  <Image
                    src={destinations[0].hero_image_url || 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&q=80'}
                    alt={destinations[0].name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-10 text-white">
                    <span className="mb-4 inline-block rounded-full bg-secondary/20 px-4 py-1 font-label text-[10px] uppercase tracking-widest backdrop-blur-md">
                      {destinations[0].region}
                    </span>
                    <h3 className="heading-display mb-2 text-4xl">{destinations[0].name}</h3>
                    <p className="max-w-sm font-light text-white/80">{destinations[0].summary}</p>
                  </div>
                </div>
              )}
              
              {/* Top Right Card */}
              {destinations[1] && (
                <div className="group relative col-span-5 overflow-hidden rounded-3xl">
                  <Image
                    src={destinations[1].hero_image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'}
                    alt={destinations[1].name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="heading-display mb-1 text-3xl">{destinations[1].name}</h3>
                    <p className="font-light text-white/80">{destinations[1].summary}</p>
                  </div>
                </div>
              )}
              
              {/* Bottom Right Card */}
              {destinations[2] && (
                <div className="group relative col-span-5 overflow-hidden rounded-3xl">
                  <Image
                    src={destinations[2].hero_image_url || 'https://images.unsplash.com/photo-1559128010-7c1b6c89c6b9?w=800&q=80'}
                    alt={destinations[2].name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="heading-display mb-1 text-3xl">{destinations[2].name}</h3>
                    <p className="font-light text-white/80">{destinations[2].summary}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ---- EDITORIAL WHY US ---- */}
        <section className="bg-surface px-8 py-32">
          <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-20 md:flex-row">
            <div className="relative w-full md:w-1/2">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80"
                  alt="Luxury Mauritius experience"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Overlapping Element */}
              <div className="absolute -bottom-12 -right-12 hidden max-w-xs rounded-3xl border border-white/50 bg-white/80 p-8 shadow-xl backdrop-blur-md lg:block">
                <Gem className="mb-4 h-10 w-10 text-tertiary" />
                <p className="heading-display mb-2 text-xl text-primary">The Curator&apos;s Touch</p>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Every experience is personally veted by our team of local specialists.
                </p>
              </div>
            </div>
            <div className="w-full space-y-8 md:w-1/2">
              <span className="font-label text-xs font-bold uppercase tracking-[0.3em] text-secondary">
                The Tropigo Standard
              </span>
              <h2 className="heading-display text-6xl leading-tight text-primary">
                We don&apos;t just book trips; we curate legacies.
              </h2>
              <p className="text-lg leading-relaxed text-on-surface-variant">
                Tropigo has been the quiet architect of the island&apos;s most exclusive escapes.
                We believe luxury isn&apos;t a price point; it&apos;s the seamless alignment of place,
                pulse, and personalized detail.
              </p>
              <div className="grid grid-cols-1 gap-6 pt-6">
                <div className="flex gap-6 border-b border-surface-container pb-6">
                  <span className="font-headline text-3xl text-primary">01</span>
                  <div>
                    <h4 className="mb-2 font-label text-sm font-bold uppercase tracking-wider">
                      The Hidden Collection
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Access to exclusive experiences not listed on any public platforms.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 border-b border-surface-container pb-6">
                  <span className="font-headline text-3xl text-primary">02</span>
                  <div>
                    <h4 className="mb-2 font-label text-sm font-bold uppercase tracking-wider">
                      Island Insiders
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Private access to local artists and secret cove discoveries.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <span className="font-headline text-3xl text-primary">03</span>
                  <div>
                    <h4 className="mb-2 font-label text-sm font-bold uppercase tracking-wider">
                      Impact Conscious
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      15% of every booking goes directly to coral reef restoration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- EXPERIENCE CAROUSEL ---- */}
        <section className="bg-surface-container-low py-24">
          <div className="mx-auto max-w-screen-2xl px-8">
            <span className="font-label text-xs font-bold uppercase tracking-[0.3em] text-secondary">
              Island Rhythms
            </span>
            <h2 className="heading-display mt-4 text-5xl text-primary">Unforgettable Experiences</h2>
          </div>
          <div className="mt-16 flex gap-8 overflow-x-auto px-8 pb-12 no-scrollbar snap-x">
            {activities.map(activity => (
              <div key={activity.id} className="min-w-[400px] snap-center group">
                <Link href={`/activities/${activity.slug}`} className="block">
                  <div className="relative mb-6 h-[500px] overflow-hidden rounded-[40px]">
                    <Image
                      src={activity.cover_image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'}
                      alt={activity.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="400px"
                    />
                    <div className="absolute right-6 top-6">
                      <div className="rounded-full bg-white/80 p-3 backdrop-blur-md">
                        <Star className="h-5 w-5 text-primary" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <h4 className="heading-display mb-1 text-2xl text-primary">{activity.title}</h4>
                  <p className="font-label text-[11px] font-bold uppercase tracking-widest text-secondary">
                    {activity.activities?.tour_type} · {activity.activities?.duration_minutes ? `${Math.floor(activity.activities.duration_minutes / 60)}h` : 'Flexible'}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    {activity.base_price && (
                      <span className="font-bold text-secondary">
                        {(() => {
                          const rp = priceMap.get(activity.id)
                          return rp ? `From ${formatCurrency(rp.amount, rp.currency)}` : ''
                        })()}
                      </span>
                    )}
                    <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary">
                      View Details <ArrowRight className="inline h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ---- POPULAR EXPERIENCES GRID ---- */}
        <section className="bg-surface-container-low px-12 py-16">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="heading-display text-3xl text-primary">Popular Experiences</h2>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant transition-colors hover:bg-white">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant transition-colors hover:bg-white">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex gap-6 overflow-x-auto snap-x pb-4 no-scrollbar">
              {activities.slice(0, 4).map(activity => (
                <div
                  key={activity.id}
                  className="min-w-[320px] snap-start rounded-2xl border border-outline-variant/20 bg-white p-4 transition-shadow hover:shadow-lg"
                >
                  <Link href={`/activities/${activity.slug}`}>
                    <Image
                      src={activity.cover_image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80'}
                      alt={activity.title}
                      width={320}
                      height={192}
                      className="mb-4 h-48 w-full rounded-xl object-cover"
                    />
                    <h4 className="text-lg font-bold text-primary">{activity.title}</h4>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {activity.activities?.duration_minutes ? `${Math.floor(activity.activities.duration_minutes / 60)}h` : 'Flexible'} · {activity.activities?.tour_type || 'Private Journey'}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-secondary">
                        {activity.base_price ? formatCurrency(activity.base_price, activity.base_currency) : 'Contact us'}
                      </span>
                      <span className="flex items-center gap-1 font-label text-[10px] font-bold uppercase tracking-widest text-primary">
                        Quick View <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
