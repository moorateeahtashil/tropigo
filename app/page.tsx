import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'
import Label from '@/components/ui/Label'
import Button from '@/components/ui/Button'
import FeatureStrip from '@/components/ui/FeatureStrip'
import ImageBlock from '@/components/ui/ImageBlock'
import CTA from '@/components/ui/CTA'
import SearchBar from '@/components/ui/SearchBar'
import TourCard from '@/components/ui/TourCard'
import DestinationCard from '@/components/ui/DestinationCard'
import CategoryCard from '@/components/ui/CategoryCard'
import TestimonialCard from '@/components/ui/TestimonialCard'
import { fetchHomepageData } from '@/lib/server/homepage'

export default async function HomePage() {
  const data = await fetchHomepageData()
  const hero = data.hero
  const heroImg = hero?.background_image_url
  const promosHero = (data.promos || []).find((p: any) => p.placement === 'homepage_hero')
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[520px] lg:h-[660px] flex items-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {heroImg && (
            <img src={heroImg} alt={hero?.title || 'Hero'} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="relative z-10 px-6 md:px-12 max-w-4xl">
            {hero?.eyebrow && <Label className="text-secondary font-bold mb-4 block">{hero.eyebrow}</Label>}
            {hero?.title && (
              <h1 className="font-headline text-5xl lg:text-7xl text-white mb-6 leading-[1.1]">{hero.title}</h1>
            )}
            {hero?.body && <p className="text-white/85 text-base md:text-lg max-w-xl mb-8">{hero.body}</p>}
            <div className="flex gap-4">
              {hero?.primary_cta_label && (
                <a href={hero?.primary_cta_url || '#'}>
                  <Button variant="secondary">{hero.primary_cta_label}</Button>
                </a>
              )}
              {hero?.secondary_cta_label && (
                <a
                  href={hero?.secondary_cta_url || '#'}
                  className="border border-white/30 backdrop-blur-sm text-white px-6 md:px-8 py-3 rounded-full text-xs tracking-widest uppercase hover:bg-white/10 transition-colors"
                >
                  {hero.secondary_cta_label}
                </a>
              )}
            </div>
            {promosHero && (
              <div className="mt-6 inline-flex items-center gap-3 bg-white/10 text-white px-4 py-2 rounded-full backdrop-blur">
                <span className="text-sm font-semibold">{promosHero.title}</span>
                {promosHero.cta_label && (
                  <a href={promosHero.cta_url || '#'} className="underline text-sm">
                    {promosHero.cta_label}
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Benefits band */}
        <Section bg="white" padding="md" className="border-b border-outline-variant/10">
          <FeatureStrip
            items={(data.trustBadges || []).slice(0, 4).map((b: any) => ({
              icon: '✔️',
              label: b.label,
            }))}
          />
        </Section>

        {/* Search and Regions */}
        <Section bg="surface" padding="lg">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="font-headline text-4xl text-primary">{data.sections.find((s:any)=>s.section_type==='regions')?.title || 'Find Your Experience'}</h2>
              <p className="text-on-surface-variant text-sm">{data.sections.find((s:any)=>s.section_type==='regions')?.subtitle || ''}</p>
              <SearchBar />
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.featuredDestinations.slice(0,3).map((d:any)=> (
                <ImageBlock key={d.id} src={d.hero_image_url} alt={d.name} title={d.name} subtitle={d.summary || ''} />
              ))}
              {data.promos.find((p:any)=>p.placement==='inline') && (
                <CTA
                  eyebrow={data.promos.find((p:any)=>p.placement==='inline')?.title}
                  title={data.promos.find((p:any)=>p.placement==='inline')?.body || ''}
                  primary={
                    data.promos.find((p:any)=>p.placement==='inline')?.cta_label ? (
                      <Button>{data.promos.find((p:any)=>p.placement==='inline')?.cta_label}</Button>
                    ) : undefined
                  }
                />
              )}
            </div>
          </div>
        </Section>

        {/* Featured Tours */}
        <Section bg="white" padding="lg">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-headline text-3xl text-primary">{data.sections.find((s:any)=>s.section_type==='experiences')?.title || 'Featured Tours'}</h2>
              <p className="text-on-surface-variant text-sm mt-2">{data.sections.find((s:any)=>s.section_type==='experiences')?.subtitle || ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.featuredTours.map((t:any)=>(
              <TourCard key={t.id} name={t.name} summary={t.summary} image={t.hero_image_url} price={t.price_from} currency={t.currency} href={`/tours/${t.slug}`} />
            ))}
          </div>
        </Section>

        {/* Categories */}
        <Section bg="surface" padding="lg">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-headline text-3xl text-primary">{data.sections.find((s:any)=>s.title==='categories')?.title || 'Popular Activities'}</h2>
              <p className="text-on-surface-variant text-sm mt-2">{data.sections.find((s:any)=>s.title==='categories')?.subtitle || ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.categories.map((c:any)=>(
              <CategoryCard key={c.id} name={c.name} image={c.image_url} href={`/activities/${c.slug}`} />
            ))}
          </div>
        </Section>

        {/* Testimonials */}
        <Section bg="white" padding="lg">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-headline text-3xl text-primary">{data.sections.find((s:any)=>s.section_type==='testimonials')?.title || 'What Guests Say'}</h2>
              <p className="text-on-surface-variant text-sm mt-2">{data.sections.find((s:any)=>s.section_type==='testimonials')?.subtitle || ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.testimonials.map((t:any)=>(
              <TestimonialCard key={t.id} quote={t.quote} author={t.author_name} location={t.author_location || ''} rating={t.rating || 5} />
            ))}
          </div>
        </Section>

        {/* Newsletter / Partners / Stats */}
        {data.newsletter && (
          <Section bg="surface" padding="lg">
            <CTA
              eyebrow={data.newsletter.eyebrow}
              title={data.newsletter.title}
              body={data.newsletter.body}
              primary={<Button>{data.newsletter.cta_label || 'Subscribe'}</Button>}
            />
          </Section>
        )}
        {Array.isArray(data.partners) && data.partners.length > 0 && (
          <Section bg="white" padding="md">
            <div className="flex flex-wrap items-center gap-8 justify-center opacity-80">
              {data.partners.map((p:any, i:number)=>(
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={p.logo_url} alt={p.name || 'Partner'} className="h-10 object-contain" />
              ))}
            </div>
          </Section>
        )}
        {Array.isArray(data.stats) && data.stats.length > 0 && (
          <Section bg="white" padding="md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {data.stats.map((s:any, i:number)=>(
                <div key={i}>
                  <div className="font-headline text-3xl text-primary">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-widest text-outline mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </main>
      <Footer />
    </div>
  )
}
