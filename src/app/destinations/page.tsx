import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPublishedDestinations } from '@/features/catalog/queries'

export const revalidate = 600

export default async function DestinationsPage() {
  const destinations = await getPublishedDestinations({ featured: false })

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        <div className="mb-8">
          <h1 className="heading-display text-4xl">Destinations</h1>
          <p className="mt-2 text-ink-secondary">Explore regions across Mauritius.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map(d => (
            <Link key={d.id} href={`/destinations/${d.slug}`} className="group overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="relative h-52 w-full">
                {d.hero_image_url ? (
                  <Image src={d.hero_image_url} alt={d.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-sand-100" />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-ink">{d.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-secondary">{d.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}

