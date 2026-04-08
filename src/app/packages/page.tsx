import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPublishedPackages } from '@/features/catalog/queries'

export const revalidate = 600

export default async function PackagesPage() {
  const packages = await getPublishedPackages({ limit: 24 })

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        <div className="mb-8">
          <h1 className="heading-display text-4xl">Packages</h1>
          <p className="mt-2 text-ink-secondary">Curated multi-activity bundles with savings.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map(p => (
            <Link key={p.id} href={`/packages/${p.slug}`} className="group overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="relative h-52 w-full">
                {p.cover_image_url ? (
                  <Image src={p.cover_image_url} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-sand-100" />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-ink">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-secondary">{p.summary}</p>
                <div className="mt-3 text-sm text-ink-muted">Includes {p.item_count} items</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}

