import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Accordion from '@/components/ui/Accordion'
import GalleryMosaic from '@/components/ui/GalleryMosaic'
import TourCard from '@/components/ui/TourCard'
import { getServerSupabase } from '@/supabase/server'
import BookingWidget from '@/components/booking/BookingWidget'

export default async function TourDetail({ params }: { params: { slug: string } }) {
  const supabase = getServerSupabase()
  const { data: tour } = await supabase
    .from('tours')
    .select('*, destinations!inner(name, slug)')
    .eq('slug', params.slug)
    .eq('published', true)
    .maybeSingle()

  if (!tour) {
    // TODO: not found page
    return (
      <div className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1"><Section><div className="py-24 text-center text-on-surface-variant">Tour not found.</div></Section></main>
        <Footer />
      </div>
    )
  }

  const { data: images } = await supabase
    .from('tour_images')
    .select('image_url')
    .eq('tour_id', tour.id)
    .order('position', { ascending: true })

  const gallery: string[] = [tour.hero_image_url, ...(tour.gallery_urls || []), ...((images || []).map((x: any) => x.image_url))].filter(Boolean)

  // Related tours: same destination
  const { data: related } = await supabase
    .from('tours')
    .select('id,name,slug,summary,price_from,currency,hero_image_url')
    .eq('destination_id', tour.destination_id)
    .eq('published', true)
    .neq('id', tour.id)
    .order('featured', { ascending: false })
    .order('position', { ascending: true })
    .limit(3)

  const includes: string[] = Array.isArray(tour.inclusions) ? tour.inclusions : []
  const excludes: string[] = Array.isArray(tour.exclusions) ? tour.exclusions : []
  const itinerary: string[] = Array.isArray(tour.itinerary) ? tour.itinerary : []
  const { data: tb } = await supabase.from('tour_badges').select('badge_id, badges!inner(label)').eq('tour_id', tour.id)
  const tourBadges = (tb || []).map((x: any) => x.badges?.label).filter(Boolean)

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section bg="surface" padding="lg">
          <div className="grid lg:grid-cols-[1fr,360px] gap-8 items-start">
            <div className="space-y-6">
              <GalleryMosaic images={gallery} />

              <div className="flex flex-wrap items-center gap-2">
                {tour.featured && <Badge tone="primary">Featured</Badge>}
                {tour.sale_active && <Badge tone="secondary">Sale</Badge>}
                {tourBadges.map((b: string, i:number)=> <Badge key={i}>{b}</Badge>)}
              </div>

              <h1 className="font-headline text-4xl text-primary">{tour.name}</h1>
              <p className="text-on-surface-variant text-base">{tour.summary}</p>

              {/* Metadata cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4"><div className="text-[11px] uppercase tracking-widest text-outline mb-1">Destination</div><div className="font-semibold">{tour.destinations?.name}</div></div>
                {tour.duration && <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4"><div className="text-[11px] uppercase tracking-widest text-outline mb-1">Duration</div><div className="font-semibold">{tour.duration}</div></div>}
                {tour.transport && <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4"><div className="text-[11px] uppercase tracking-widest text-outline mb-1">Transport</div><div className="font-semibold">{tour.transport}</div></div>}
                {tour.difficulty && <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4"><div className="text-[11px] uppercase tracking-widest text-outline mb-1">Difficulty</div><div className="font-semibold">{tour.difficulty}</div></div>}
              </div>

              {/* Overview */}
              {tour.description && (
                <div className="bg-white rounded-2xl border border-outline-variant/10 p-6">
                  <h2 className="font-headline text-2xl text-primary mb-2">Overview</h2>
                  <div className="prose prose-slate max-w-none text-on-surface-variant">{tour.description}</div>
                </div>
              )}

              {/* Includes / Excludes */}
              {(includes.length > 0 || excludes.length > 0) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {includes.length > 0 && (
                    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
                      <h3 className="font-headline text-xl text-primary mb-3">Inclusions</h3>
                      <ul className="list-disc ml-5 space-y-1 text-sm text-on-surface-variant">
                        {includes.map((it, i) => (<li key={i}>{it}</li>))}
                      </ul>
                    </div>
                  )}
                  {excludes.length > 0 && (
                    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
                      <h3 className="font-headline text-xl text-primary mb-3">Exclusions</h3>
                      <ul className="list-disc ml-5 space-y-1 text-sm text-on-surface-variant">
                        {excludes.map((it, i) => (<li key={i}>{it}</li>))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Itinerary */}
              {itinerary.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-headline text-xl text-primary">Itinerary</h3>
                  <Accordion items={itinerary.map((it, i) => ({ title: `Step ${i + 1}`, content: <p>{it}</p> }))} />
                </div>
              )}

              {/* Notices */}
              {tour.notices && (
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
                  <h3 className="font-headline text-xl text-primary mb-2">Good to know</h3>
                  <p className="text-sm text-on-surface-variant whitespace-pre-line">{tour.notices}</p>
                </div>
              )}

              {/* Reviews placeholder */}
              <div className="bg-white rounded-2xl border border-outline-variant/10 p-6">
                <h3 className="font-headline text-xl text-primary">Reviews</h3>
                <p className="text-sm text-on-surface-variant">Reviews coming soon.</p>
              </div>

              {/* Related tours */}
              {related && related.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-headline text-xl text-primary">You may also like</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {related.map((t: any) => (
                      <TourCard key={t.id} name={t.name} summary={t.summary} image={t.hero_image_url} price={t.price_from} currency={t.currency} href={`/tours/${t.slug}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky booking panel shell */}
            <aside className="sticky top-24 bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-5 h-fit">
              <div className="text-sm text-outline mb-2">From</div>
              <div className="text-3xl font-headline text-primary mb-4">
                {tour.sale_active && tour.sale_price != null ? (
                  <>
                    {tour.currency || 'MUR'} {Number(tour.sale_price).toLocaleString()}
                    <span className="ml-2 line-through text-outline text-base">{tour.currency || 'MUR'} {Number(tour.price_from || 0).toLocaleString()}</span>
                  </>
                ) : (
                  <>
                    {tour.currency || 'MUR'} {Number(tour.price_from || 0).toLocaleString()}
                  </>
                )}
              </div>
              <BookingWidget tourId={tour.id} currency={tour.currency} />
              <p className="text-[11px] text-outline mt-3">Secure checkout. Final price is validated on the server.</p>
            </aside>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
