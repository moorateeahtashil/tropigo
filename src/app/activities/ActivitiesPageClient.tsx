'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils/format'
import { Search, Filter, MapPin, Clock, Star, ArrowRight, Headphones, X } from 'lucide-react'
import type { ActivityProduct } from '@/features/catalog/queries'
import type { ResolvedPrice } from '@/features/pricing/resolve'

interface ActivitiesPageClientProps {
  activities: ActivityProduct[]
  destinations: Array<{ id: string; slug: string; name: string; region: string; hero_image_url: string | null }>
  priceMap: Map<string, ResolvedPrice>
  currency: string
}

export default function ActivitiesPageClient({
  activities,
  destinations,
  priceMap,
  currency,
}: ActivitiesPageClientProps) {
  const [filters, setFilters] = useState({
    destination: 'all',
    tourType: 'all',
    duration: 'all',
    priceRange: 'all',
    search: '',
  })

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Get unique tour types from activities
  const tourTypes = useMemo(() => {
    const types = new Set(activities.map(a => a.activities?.tour_type).filter(Boolean))
    return Array.from(types) as string[]
  }, [activities])

  // Get unique destinations from activities
  const activityDestinations = useMemo(() => {
    const dests = activities
      .map(a => a.destination)
      .filter((d): d is { id: string; slug: string; name: string; region: string } => !!d)
    const unique = new Map(dests.map(d => [d.slug, d]))
    return Array.from(unique.values())
  }, [activities])

  // Get price range info
  const getActivityPrice = (activity: ActivityProduct) => {
    const rp = priceMap.get(activity.id)
    if (rp) return rp.amount
    if (activity.base_price) return Number(activity.base_price)
    return null
  }

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Destination filter
      if (filters.destination !== 'all' && activity.destination?.slug !== filters.destination) {
        return false
      }

      // Tour type filter
      if (filters.tourType !== 'all' && activity.activities?.tour_type !== filters.tourType) {
        return false
      }

      // Duration filter
      if (filters.duration !== 'all') {
        const mins = activity.activities?.duration_minutes || 0
        if (filters.duration === 'short' && mins >= 180) return false
        if (filters.duration === 'medium' && (mins < 180 || mins > 360)) return false
        if (filters.duration === 'long' && mins <= 360) return false
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const price = getActivityPrice(activity)
        if (!price) return false
        if (filters.priceRange === 'budget' && price >= 100) return false
        if (filters.priceRange === 'mid' && (price < 100 || price > 300)) return false
        if (filters.priceRange === 'premium' && price <= 300) return false
      }

      // Search filter
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const matchesTitle = activity.title.toLowerCase().includes(q)
        const matchesSummary = activity.summary?.toLowerCase().includes(q) || false
        const matchesDestination = activity.destination?.name.toLowerCase().includes(q) || false
        if (!matchesTitle && !matchesSummary && !matchesDestination) return false
      }

      return true
    })
  }, [activities, filters, priceMap])

  const activeFilterCount = Object.values(filters).filter(v => v !== 'all' && v !== '').length

  const resetFilters = () => {
    setFilters({ destination: 'all', tourType: 'all', duration: 'all', priceRange: 'all', search: '' })
  }

  return (
    <div className="min-h-screen pt-16 lg:grid lg:grid-cols-[320px_1fr]">
      {/* Mobile Filter Toggle */}
      <div className="sticky top-16 z-30 border-b border-outline-variant/20 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <span className="text-xs text-on-surface-variant">
              {filteredActivities.length} results
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="heading-display text-xl text-primary">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="rounded-full p-2 hover:bg-surface-container">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterContent
              filters={filters}
              setFilters={setFilters}
              destinations={activityDestinations}
              tourTypes={tourTypes}
              resetFilters={resetFilters}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar Filters */}
      <aside className="sticky top-16 z-40 hidden h-[calc(100vh-4rem)] flex-col overflow-y-auto border-r border-outline-variant/30 bg-surface-container-low p-6 lg:flex">
        <div className="mt-4">
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
            Filter Activities
          </span>
          <h2 className="heading-display mt-2 mb-6 text-2xl text-primary">Refine Your Search</h2>
          
          <FilterContent
            filters={filters}
            setFilters={setFilters}
            destinations={activityDestinations}
            tourTypes={tourTypes}
            resetFilters={resetFilters}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full">
        {/* Hero Section */}
        <section className="relative flex h-[400px] items-end overflow-hidden lg:h-[500px]">
          <Image
            src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=85"
            alt="Mauritius Activities"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="relative z-10 max-w-4xl px-8 pb-10 lg:px-12">
            <span className="mb-3 block font-label text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">
              Premium Experiences
            </span>
            <h1 className="heading-display mb-4 text-4xl leading-tight text-white lg:text-6xl">
              Discover Mauritius
            </h1>
            <p className="max-w-xl text-sm font-light text-white/80 lg:text-lg">
              Curated activities and adventures across the island.
            </p>
          </div>
        </section>

        {/* Value Props */}
        <section className="border-b border-outline-variant/10 bg-white py-6">
          <div className="grid grid-cols-2 gap-6 px-8 lg:grid-cols-4 lg:px-12">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-secondary" />
              <span className="font-label text-[11px] font-bold uppercase tracking-wider text-primary">
                Top Experiences
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
                24/7 Support
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

        {/* Results */}
        <section className="bg-white px-8 py-10 lg:px-12">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="heading-display text-3xl text-primary">All Activities</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                {filteredActivities.length} experience{filteredActivities.length !== 1 ? 's' : ''} available
                {activeFilterCount > 0 && ' (filtered)'}
              </p>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="font-label text-xs font-bold uppercase tracking-widest text-secondary hover:text-tertiary"
              >
                Clear All
              </button>
            )}
          </div>

          {filteredActivities.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredActivities.map(activity => (
                <Link
                  key={activity.id}
                  href={`/activities/${activity.slug}`}
                  className="group overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <div className="relative h-48 w-full lg:h-52">
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
                    <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">{activity.summary}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-ink">
                        {(() => {
                          const price = getActivityPrice(activity)
                          if (!price) return <span className="text-on-surface-variant">Contact us</span>
                          return (
                            <>
                              <span className="text-on-surface-variant">From </span>
                              <strong className="text-secondary">{formatCurrency(price, currency)}</strong>
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
          ) : (
            <div className="py-20 text-center">
              <Search className="mx-auto mb-4 h-16 w-16 text-on-surface-variant/30" />
              <h3 className="heading-display text-2xl text-primary">No activities found</h3>
              <p className="mt-2 text-on-surface-variant">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 rounded-full bg-secondary px-6 py-3 font-label text-xs uppercase tracking-widest text-on-secondary transition-all hover:brightness-110"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function FilterContent({
  filters,
  setFilters,
  destinations,
  tourTypes,
  resetFilters,
}: {
  filters: { destination: string; tourType: string; duration: string; priceRange: string; search: string }
  setFilters: React.Dispatch<React.SetStateAction<{ destination: string; tourType: string; duration: string; priceRange: string; search: string }>>
  destinations: Array<{ id: string; slug: string; name: string; region: string }>
  tourTypes: string[]
  resetFilters: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            placeholder="Activities, destinations..."
            className="w-full rounded-xl border border-outline-variant bg-white py-3 pl-10 pr-4 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>
      </div>

      {/* Destination Filter */}
      <div className="space-y-2">
        <label className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          Destination
        </label>
        <div className="relative">
          <select
            value={filters.destination}
            onChange={e => setFilters(f => ({ ...f, destination: e.target.value }))}
            className="w-full appearance-none rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            <option value="all">All Destinations</option>
            {destinations.map(dest => (
              <option key={dest.slug} value={dest.slug}>{dest.name}</option>
            ))}
          </select>
          <Filter className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        </div>
      </div>

      {/* Tour Type Filter */}
      {tourTypes.length > 0 && (
        <div className="space-y-2">
          <label className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Experience Type
          </label>
          <div className="relative">
            <select
              value={filters.tourType}
              onChange={e => setFilters(f => ({ ...f, tourType: e.target.value }))}
              className="w-full appearance-none rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="all">All Types</option>
              {tourTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)} Tours</option>
              ))}
            </select>
            <Filter className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          </div>
        </div>
      )}

      {/* Duration Filter */}
      <div className="space-y-2">
        <label className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          Duration
        </label>
        <div className="relative">
          <select
            value={filters.duration}
            onChange={e => setFilters(f => ({ ...f, duration: e.target.value }))}
            className="w-full appearance-none rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
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
            value={filters.priceRange}
            onChange={e => setFilters(f => ({ ...f, priceRange: e.target.value }))}
            className="w-full appearance-none rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            <option value="all">All Prices</option>
            <option value="budget">Under €100</option>
            <option value="mid">€100 - €300</option>
            <option value="premium">€300+</option>
          </select>
          <Filter className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full rounded-xl border border-outline-variant bg-white py-3 font-label text-sm font-bold uppercase tracking-widest text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface"
      >
        Reset Filters
      </button>
    </div>
  )
}
