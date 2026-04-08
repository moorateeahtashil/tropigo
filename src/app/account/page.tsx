'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { User, LogOut, Mail, Phone, MapPin, Calendar, Package, Car, Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Booking {
  id: string
  ref: string
  status: string
  total_amount: number
  currency: string
  created_at: string
  items: {
    product_title: string
    product_type: string
    booking_date: string | null
    quantity: number
  }[]
}

export default function AccountPage() {
  const router = useRouter()
  const supabase = getBrowserSupabase()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchRef, setSearchRef] = useState('')
  const [lookingUp, setLookingUp] = useState(false)
  const [lookupResult, setLookupResult] = useState<Booking | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      if (session?.user) {
        await loadBookings(session.user.email)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function loadBookings(email?: string) {
    try {
      const url = `/api/account/bookings${email ? `?email=${encodeURIComponent(email)}` : ''}`
      const res = await fetch(url)
      if (res.ok) {
        const json = await res.json()
        setBookings(json.bookings || [])
      }
    } catch (err) {
      console.error('Failed to load bookings:', err)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setBookings([])
  }

  async function lookupBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!searchRef.trim()) return
    setLookingUp(true)
    setLookupResult(null)

    try {
      const res = await fetch(`/api/booking/lookup?ref=${encodeURIComponent(searchRef.trim())}`)
      const json = await res.json()
      if (res.ok) {
        setLookupResult(json.booking)
      }
    } catch (err) {
      console.error('Failed to lookup booking:', err)
    } finally {
      setLookingUp(false)
    }
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  }

  const productIcons: Record<string, React.ReactNode> = {
    activity: <Package className="h-4 w-4" />,
    airport_transfer: <Car className="h-4 w-4" />,
    package: <Package className="h-4 w-4" />,
  }

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        <h1 className="heading-display">My Account</h1>

        {/* Lookup by reference (always visible) */}
        <section className="mt-8 rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-ink">Look Up a Booking</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Enter your booking reference to view details.
          </p>
          <form onSubmit={lookupBooking} className="mt-4 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                placeholder="e.g., TRP-XXXXX"
                className="w-full rounded-lg border-sand-300 pl-9 shadow-sm focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            <Button type="submit" disabled={lookingUp || !searchRef.trim()}>
              {lookingUp ? 'Searching...' : 'Look Up'}
            </Button>
          </form>

          {lookupResult && (
            <div className="mt-4 rounded-xl border border-sand-200 bg-sand-50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-ink">{lookupResult.ref}</div>
                  <div className="text-sm text-ink-secondary">
                    {new Date(lookupResult.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                    statusColors[lookupResult.status] || 'bg-gray-100 text-gray-700',
                  )}
                >
                  {lookupResult.status}
                </span>
              </div>
              <div className="mt-3 border-t border-sand-200 pt-3">
                {lookupResult.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-ink-secondary">
                    {productIcons[item.product_type] || <Package className="h-4 w-4" />}
                    <span>{item.product_title}</span>
                    {item.booking_date && (
                      <span className="text-xs text-ink-muted">
                        ({item.booking_date})
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-right text-sm font-semibold text-ink">
                {lookupResult.currency} {lookupResult.total_amount.toFixed(2)}
              </div>
              <div className="mt-3 text-right">
                <Link
                  href={`/booking/${lookupResult.ref}`}
                  className="text-sm font-medium text-brand-700 hover:underline"
                >
                  View full details →
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Auth section */}
        {!user ? (
          <section className="mt-8 rounded-2xl border border-sand-200 bg-white p-8 shadow-card">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
                <User className="h-8 w-8 text-brand-700" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-ink">Sign In to Your Account</h2>
              <p className="mt-2 text-ink-secondary">
                Create an account or sign in to view your booking history and manage your trips.
              </p>
              <div className="mt-6 space-y-3">
                <SignInForm />
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Profile */}
            <section className="mt-8 rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
                    <User className="h-6 w-6 text-brand-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-ink">
                      {user.user_metadata?.full_name || 'Your Account'}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-sm text-ink-secondary">
                      {user.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </section>

            {/* Bookings */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-ink">Your Bookings</h2>
              {loading ? (
                <div className="mt-4 space-y-3">
                  <div className="h-24 animate-pulse rounded-2xl bg-sand-100" />
                  <div className="h-24 animate-pulse rounded-2xl bg-sand-100" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-8 text-center shadow-card">
                  <Calendar className="mx-auto h-10 w-10 text-ink-muted" />
                  <h3 className="mt-3 font-medium text-ink">No bookings yet</h3>
                  <p className="mt-1 text-sm text-ink-secondary">
                    Start exploring Mauritius and book your first experience.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <Button asChild size="sm">
                      <Link href="/activities">Activities</Link>
                    </Button>
                    <Button variant="outline" asChild size="sm">
                      <Link href="/transfers">Transfers</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {bookings.map((booking) => (
                    <li
                      key={booking.id}
                      className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card transition-shadow hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/booking/${booking.ref}`}
                            className="font-semibold text-ink hover:text-brand-700 hover:underline"
                          >
                            {booking.ref}
                          </Link>
                          <div className="mt-1 text-sm text-ink-secondary">
                            {new Date(booking.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                            statusColors[booking.status] || 'bg-gray-100 text-gray-700',
                          )}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="mt-3 space-y-1">
                        {booking.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-ink-secondary">
                            {productIcons[item.product_type]}
                            <span>{item.product_title}</span>
                            {item.booking_date && (
                              <span className="text-xs text-ink-muted">
                                • {item.booking_date}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-sand-100 pt-3">
                        <div className="text-sm text-ink-muted">
                          {booking.items.length} item{booking.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-lg font-bold text-ink">
                          {booking.currency} {booking.total_amount.toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

function SignInForm() {
  const supabase = getBrowserSupabase()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for a magic login link!')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={signIn} className="space-y-3">
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Sending...' : 'Send Magic Link'}
      </Button>
      {message && (
        <p className="text-sm text-ink-secondary">{message}</p>
      )}
    </form>
  )
}
