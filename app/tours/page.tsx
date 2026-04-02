import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import TourCard from '@/components/ui/TourCard'
import TourListItem from '@/components/ui/TourListItem'
import { getServerSupabase } from '@/supabase/server'

type SearchParams = {
  q?: string
  category?: string
  destination?: string
  min?: string
  max?: string
  duration?: string
  sort?: string
  view?: 'grid' | 'list'
}

export default async function ToursIndex({ searchParams }: { searchParams: SearchParams }) {
  const supabase = getServerSupabase()

  // Fetch filters data
  const [{ data: cats }, { data: dests }] = await Promise.all([
    supabase.from('activity_categories').select('id, name, slug').eq('published', true).order('name'),
    supabase.from('destinations').select('id, name, slug').eq('published', true).order('name'),
  ])

  // Build tours query
  let query = supabase
    .from('tours')
    .select('id,name,slug,summary,price_from,currency,hero_image_url,featured,is_active,published,sale_active,sale_price,duration,destination_id, destinations!inner(name)')
    .eq('published', true)
    .eq('is_active', true)

  const q = (searchParams.q || '').trim()
  if (q) {
    query = query.or(`name.ilike.%${q}%,summary.ilike.%${q}%`)
  }

  const destination = searchParams.destination
  if (destination) {
    // Match by slug: fetch id and filter by id
    const d = (dests || []).find((x) => x.slug === destination)
    if (d) query = query.eq('destination_id', d.id)
  }

  const category = searchParams.category
  if (category) {
    // Join category
    const c = (cats || []).find((x) => x.slug === category)
    if (c) {
      query = supabase
        .from('tours')
        .select('id,name,slug,summary,price_from,currency,hero_image_url,featured,is_active,published,sale_active,sale_price,duration,destination_id, destinations!inner(name), tours_activity_categories!inner(category_id)')
        .eq('published', true)
        .eq('is_active', true)
        .eq('tours_activity_categories.category_id', c.id)
    }
  }

  const min = Number(searchParams.min)
  if (!Number.isNaN(min) && min >= 0) {
    query = query.gte('price_from', min)
  }
  const max = Number(searchParams.max)
  if (!Number.isNaN(max) && max > 0) {
    query = query.lte('price_from', max)
  }

  const duration = (searchParams.duration || '').trim()
  if (duration) {
    query = query.eq('duration', duration)
  }

  // Sort
  const sort = searchParams.sort || 'featured'
  if (sort === 'price_asc') query = query.order('price_from', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price_from', { ascending: false })
  else if (sort === 'name') query = query.order('name', { ascending: true })
  else if (sort === 'newest') query = query.order('created_at', { ascending: false })
  else query = query.order('featured', { ascending: false }).order('position', { ascending: true })

  const { data: tours } = await query

  const view = searchParams.view === 'list' ? 'list' : 'grid'

  const makeUrl = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams()
    const merged = { ...searchParams, ...params }
    Object.entries(merged).forEach(([k, v]) => {
      if (v && String(v).length) sp.set(k, String(v))
    })
    return `/tours?${sp.toString()}`
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section bg="surface" padding="lg">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="font-headline text-4xl text-primary">Tours</h1>
              <p className="text-on-surface-variant text-sm mt-2">Search and filter curated experiences</p>
            </div>
            <div className="flex gap-2">
              <a href={makeUrl({ view: 'grid' })}><Button variant={view==='grid'?'primary':'outline'} size="sm">Grid</Button></a>
              <a href={makeUrl({ view: 'list' })}><Button variant={view==='list'?'primary':'outline'} size="sm">List</Button></a>
            </div>
          </div>

          <form method="get" className="glass-panel rounded-2xl p-4 border border-outline-variant/20 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div>
                <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Search</label>
                <input name="q" defaultValue={searchParams.q || ''} className="mt-2 w-full bg-white border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:ring-secondary focus:border-secondary" placeholder="Keywords" />
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Category</label>
                <select name="category" defaultValue={searchParams.category || ''} className="mt-2 w-full bg-white border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:ring-secondary focus:border-secondary">
                  <option value="">All</option>
                  {(cats || []).map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Destination</label>
                <select name="destination" defaultValue={searchParams.destination || ''} className="mt-2 w-full bg-white border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:ring-secondary focus:border-secondary">
                  <option value="">All</option>
                  {(dests || []).map((d) => <option key={d.id} value={d.slug}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Price Range</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input name="min" defaultValue={searchParams.min || ''} className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary" placeholder="Min" />
                  <input name="max" defaultValue={searchParams.max || ''} className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary" placeholder="Max" />
                </div>
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Duration</label>
                <select name="duration" defaultValue={searchParams.duration || ''} className="mt-2 w-full bg-white border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:ring-secondary focus:border-secondary">
                  <option value="">Any</option>
                  <option value="Half day">Half day</option>
                  <option value="Full day">Full day</option>
                  <option value="Multi-day">Multi-day</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Sort</label>
                <select name="sort" defaultValue={searchParams.sort || 'featured'} className="bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-secondary focus:border-secondary">
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name A–Z</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              <div className="flex gap-2">
                <a href="/tours" className="px-4 py-2 rounded-xl border border-outline-variant text-sm">Reset</a>
                <Button type="submit">Apply Filters</Button>
              </div>
            </div>
          </form>

          {(!tours || tours.length === 0) && (
            <div className="text-center text-on-surface-variant py-12">No tours match your filters.</div>
          )}

          {tours && tours.length > 0 && view === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((t: any) => (
                <TourCard
                  key={t.id}
                  name={t.name}
                  summary={t.summary}
                  image={t.hero_image_url}
                  price={t.price_from}
                  currency={t.currency}
                  href={`/tours/${t.slug}`}
                />
              ))}
            </div>
          )}

          {tours && tours.length > 0 && view === 'list' && (
            <div className="space-y-4">
              {tours.map((t: any) => (
                <TourListItem
                  key={t.id}
                  name={t.name}
                  summary={t.summary}
                  image={t.hero_image_url}
                  price={t.price_from}
                  currency={t.currency}
                  href={`/tours/${t.slug}`}
                  featured={t.featured}
                  onSale={t.sale_active}
                  salePrice={t.sale_price}
                  duration={t.duration}
                  destinationName={t.destinations?.name || null}
                />
              ))}
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </div>
  )
}

