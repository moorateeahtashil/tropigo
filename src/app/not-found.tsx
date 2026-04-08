'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Compass, ArrowLeft, Home, Waves, Anchor } from 'lucide-react'

const SUGGESTED_LINKS = [
  { href: '/transfers', label: 'Airport Transfers', icon: Anchor },
  { href: '/activities', label: 'Activities', icon: Waves },
  { href: '/packages', label: 'Packages', icon: Compass },
  { href: '/destinations', label: 'Destinations', icon: MapPin },
]

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/activities?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Animated background elements */}
      {mounted && (
        <>
          <div
            className="pointer-events-none absolute h-96 w-96 rounded-full bg-secondary/5 blur-3xl transition-transform duration-1000"
            style={{
              left: mousePos.x - 192,
              top: mousePos.y - 192,
            }}
          />
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-1/4 h-64 w-64 animate-pulse rounded-full bg-primary/5" />
            <div className="absolute -right-32 bottom-1/4 h-64 w-64 animate-pulse rounded-full bg-secondary/5" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/3 left-1/3 h-48 w-48 animate-pulse rounded-full bg-tertiary/5" style={{ animationDelay: '2s' }} />
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        {/* Large 404 with icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <span className="heading-display text-[180px] font-bold leading-none text-primary/10 md:text-[240px]">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-24 w-24 text-secondary/40 md:h-32 md:w-32" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="heading-display mb-4 text-4xl text-primary md:text-5xl">
          Page Not Found
        </h1>
        <p className="mb-8 text-lg text-on-surface-variant">
          Looks like you&apos;ve wandered off the beaten path. Let&apos;s get you back to paradise.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mx-auto mb-12 max-w-md">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities, transfers, destinations..."
              className="w-full rounded-2xl border border-outline-variant bg-white py-4 pl-12 pr-32 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-secondary px-4 py-2 font-label text-xs uppercase tracking-widest text-on-secondary transition-all hover:brightness-110"
            >
              Search
            </button>
          </div>
        </form>

        {/* Suggested links */}
        <div className="mb-12">
          <p className="mb-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Popular Destinations
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SUGGESTED_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-outline-variant/20 bg-white p-4 transition-all hover:-translate-y-1 hover:border-secondary hover:shadow-lg"
              >
                <link.icon className="h-6 w-6 text-secondary transition-transform group-hover:scale-110" />
                <span className="text-xs font-medium text-on-surface">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-label text-sm uppercase tracking-widest text-on-primary transition-all hover:bg-on-primary-fixed"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Homepage
        </Link>

        {/* Fun message */}
        <p className="mt-8 text-xs text-on-surface-variant/60">
          🌴 Even in paradise, sometimes we take wrong turns. No worries, we&apos;ll guide you back!
        </p>
      </div>
    </div>
  )
}
