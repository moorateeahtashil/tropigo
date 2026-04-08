import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getSettings } from '@/features/content/queries'
import { getTestimonials } from '@/features/content/queries'
import { cn } from '@/lib/utils/cn'

export const revalidate = 3600

const VALUES = [
  {
    icon: '🌴',
    title: 'Local Expertise',
    description: 'Born and based in Mauritius, we know every hidden beach, every scenic viewpoint, and the best local guides on the island.',
  },
  {
    icon: '✨',
    title: 'Premium Experiences',
    description: 'We curate only the finest activities, transfers, and packages — so you can focus on making memories, not researching options.',
  },
  {
    icon: '🤝',
    title: 'Trusted Service',
    description: 'From your first enquiry to your last day on the island, we are here to ensure everything runs smoothly.',
  },
  {
    icon: '🌍',
    title: 'Sustainable Tourism',
    description: 'We partner with local operators who respect the environment and support the communities that make Mauritius so special.',
  },
]

const STATS = [
  { value: '500+', label: 'Happy Travellers' },
  { value: '50+', label: 'Curated Activities' },
  { value: '4.9', label: 'Average Rating' },
  { value: '24/7', label: 'Support' },
]

export default async function AboutPage() {
  const settings = await getSettings()
  const testimonials = await getTestimonials({ limit: 3 })

  return (
    <>
      <Header />
      <main className="pb-16">
        {/* Hero */}
        <section className="relative h-[480px] w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544984243-ec57ea16dd59?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
          <div className="relative container-page flex h-full flex-col items-center justify-center text-center">
            <h1 className="heading-display text-white">About Tropigo</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/80">
              Your trusted partner for premium Mauritius experiences — from seamless airport transfers to unforgettable island adventures.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="container-page mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="heading-lg text-ink">Our Story</h2>
            <div className="mt-6 space-y-4 text-ink-secondary leading-relaxed">
              <p>
                Tropigo was born from a simple observation: visitors to Mauritius deserved a single, 
                trustworthy platform to book everything they needed for their trip — airport transfers, 
                activities, and curated holiday packages.
              </p>
              <p>
                We saw travellers spending hours researching activities, comparing prices, and worrying 
                about reliability. So we built a platform that brings together the best of Mauritius 
                under one roof, with transparent pricing and verified operators.
              </p>
              <p>
                Today, Tropigo connects thousands of visitors with the best experiences Mauritius has 
                to offer — from catamaran cruises in the north to canyoning adventures in the south, 
                all backed by our commitment to quality and reliability.
              </p>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand-100 shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80"
              alt="Beautiful Mauritius coastline"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Values */}
        <section className="container-page mt-16">
          <h2 className="heading-lg text-ink">What Drives Us</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card transition-shadow hover:shadow-lg"
              >
                <div className="text-3xl">{v.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-secondary">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mt-16 bg-brand-900 py-12">
          <div className="container-page">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-bold text-white">{s.value}</div>
                  <div className="mt-1 text-sm text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team / Contact CTA */}
        <section className="container-page mt-16">
          <div className="rounded-2xl border border-sand-200 bg-white p-8 shadow-card lg:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="heading-lg text-ink">Get in Touch</h2>
              <p className="mt-4 text-ink-secondary">
                Have a question or need help planning your Mauritius trip? Our team is here to help.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/contact"
                  className="rounded-xl bg-brand-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-800"
                >
                  Contact Us
                </a>
                <a
                  href="/enquiry"
                  className="rounded-xl border border-sand-300 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-sand-50"
                >
                  Enquiry Form
                </a>
              </div>
              {settings?.contact_email && (
                <p className="mt-4 text-sm text-ink-muted">
                  Or email us directly at{' '}
                  <a href={`mailto:${settings.contact_email}`} className="text-brand-700 hover:underline">
                    {settings.contact_email}
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="container-page mt-16">
            <h2 className="heading-lg text-ink">What Our Guests Say</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card"
                >
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-4 text-ink-secondary">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-4 border-t border-sand-100 pt-4">
                    <div className="text-sm font-medium text-ink">{t.author_name}</div>
                    {t.author_location && (
                      <div className="text-xs text-ink-muted">{t.author_location}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
