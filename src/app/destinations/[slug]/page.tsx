import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getDestinationBySlug, getPublishedActivities } from '@/features/catalog/queries'
import Link from 'next/link'

export const revalidate = 600

export default async function DestinationDetail({ params }: { params: { slug: string } }) {
  const [destination, activities] = await Promise.all([
    getDestinationBySlug(params.slug),
    getPublishedActivities({ destinationSlug: params.slug, limit: 6 }),
  ])

  if (!destination) return notFound()

  return (
    <>
      <Header />
      <main className="pb-16">
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
              {destination.region && <p className="mt-2 text-white/80">{destination.region}</p>}
            </div>
          </div>
        </section>

        <section className="container-page mt-10">
          {destination.description && (
            <div className="prose max-w-none whitespace-pre-line text-ink-secondary">{destination.description}</div>
          )}

          {activities.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-semibold text-ink">Popular activities</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activities.map(a => (
                  <Link key={a.id} href={`/activities/${a.slug}`} className="group overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                    <div className="relative h-44 w-full">
                      {a.cover_image_url ? (
                        <Image src={a.cover_image_url} alt={a.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full bg-sand-100" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="font-medium text-ink">{a.title}</div>
                      <div className="text-sm text-ink-secondary">{a.summary}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

