'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import {
  User, LogOut, Mail, Phone, Globe, Calendar, Package, Car, Search,
  Edit2, Check, X, BookOpen, UserCircle, Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Tab = 'bookings' | 'profile' | 'lookup'

interface Booking {
  id: string; ref: string; status: string; total_amount: number; currency: string; created_at: string
  items: { product_title: string; product_type: string; booking_date: string | null; quantity: number }[]
}

interface Profile {
  first_name: string; last_name: string; email: string; phone: string | null; country: string | null
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

const PRODUCT_ICONS: Record<string, React.ReactNode> = {
  activity: <Package className="h-4 w-4" />,
  airport_transfer: <Car className="h-4 w-4" />,
  package: <Package className="h-4 w-4" />,
  trip: <Calendar className="h-4 w-4" />,
}

export default function AccountPage() {
  const supabase = getBrowserSupabase()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('bookings')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-700" />
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="container-page flex min-h-screen flex-col items-center justify-center pt-20 pb-16">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
              <User className="h-8 w-8 text-brand-700" />
            </div>
            <h1 className="text-2xl font-bold text-ink">My Account</h1>
            <p className="mt-2 text-ink-secondary">Sign in to view your bookings and manage your profile.</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/account/login"
                className="rounded-xl bg-brand-700 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">
                Sign In
              </Link>
              <Link href="/account/signup"
                className="rounded-xl border border-sand-300 bg-white py-3 text-sm font-semibold text-ink transition hover:bg-sand-50">
                Create Account
              </Link>
            </div>
            <div className="mt-8 border-t border-sand-200 pt-8">
              <p className="text-sm text-ink-secondary">Have a booking reference?</p>
              <Link href="#lookup" onClick={() => {}}
                className="mt-2 inline-block text-sm font-medium text-brand-700 hover:underline">
                Look up a booking →
              </Link>
            </div>
          </div>
          <div className="mt-12 w-full max-w-lg" id="lookup">
            <LookupSection />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">
              {user.user_metadata?.full_name || user.email}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-secondary">
              <Mail className="h-3.5 w-3.5" />{user.email}
            </p>
          </div>
          <button onClick={signOut}
            className="flex items-center gap-2 rounded-xl border border-sand-200 bg-white px-4 py-2 text-sm font-medium text-ink-secondary shadow-sm hover:bg-sand-50">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 rounded-xl border border-sand-200 bg-sand-50 p-1 w-fit">
          {([
            { key: 'bookings', label: 'My Bookings', icon: <BookOpen className="h-4 w-4" /> },
            { key: 'profile', label: 'Profile', icon: <UserCircle className="h-4 w-4" /> },
            { key: 'lookup', label: 'Lookup', icon: <Search className="h-4 w-4" /> },
          ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                tab === t.key ? 'bg-white text-ink shadow-sm' : 'text-ink-secondary hover:text-ink',
              )}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {tab === 'bookings' && <BookingsTab userEmail={user.email} />}
          {tab === 'profile' && <ProfileTab user={user} />}
          {tab === 'lookup' && <LookupSection />}
        </div>
      </main>
      <Footer />
    </>
  )
}

// ─── Bookings Tab ────────────────────────────────────────────────────────────

function BookingsTab({ userEmail }: { userEmail: string }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/account/bookings?email=${encodeURIComponent(userEmail)}`)
      .then(r => r.json())
      .then(j => setBookings(j.bookings ?? []))
      .finally(() => setLoading(false))
  }, [userEmail])

  if (loading) return (
    <div className="space-y-3">
      {[0, 1, 2].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-sand-100" />)}
    </div>
  )

  if (bookings.length === 0) return (
    <div className="rounded-2xl border border-sand-200 bg-white p-10 text-center shadow-card">
      <Calendar className="mx-auto h-10 w-10 text-ink-muted" />
      <h3 className="mt-3 font-semibold text-ink">No bookings yet</h3>
      <p className="mt-1 text-sm text-ink-secondary">Start exploring Mauritius!</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Link href="/trips" className="rounded-xl bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800">Browse Trips</Link>
        <Link href="/activities" className="rounded-xl border border-sand-200 bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-sand-50">Activities</Link>
      </div>
    </div>
  )

  return (
    <ul className="space-y-3">
      {bookings.map(b => (
        <li key={b.id} className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card transition-shadow hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <Link href={`/booking/${b.ref}`} className="font-semibold text-ink hover:text-brand-700 hover:underline">
                {b.ref}
              </Link>
              <p className="mt-0.5 text-sm text-ink-secondary">
                {new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium capitalize', STATUS_COLORS[b.status] ?? 'bg-gray-100 text-gray-700')}>
              {b.status}
            </span>
          </div>
          <div className="mt-3 space-y-1">
            {b.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-ink-secondary">
                {PRODUCT_ICONS[item.product_type] ?? <Package className="h-4 w-4" />}
                <span>{item.product_title}</span>
                {item.booking_date && <span className="text-xs text-ink-muted">• {item.booking_date}</span>}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-sand-100 pt-3">
            <span className="text-sm text-ink-muted">{b.items.length} item{b.items.length !== 1 ? 's' : ''}</span>
            <span className="text-lg font-bold text-ink">{b.currency} {b.total_amount.toFixed(2)}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────

function ProfileTab({ user }: { user: any }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Profile>({
    first_name: '', last_name: '', email: user.email, phone: '', country: '',
  })

  useEffect(() => {
    fetch('/api/account/profile')
      .then(r => r.json())
      .then(j => {
        if (j.profile) {
          setProfile(j.profile)
          setForm({ ...j.profile })
        } else {
          // Pre-fill from auth metadata
          const name = user.user_metadata?.full_name || ''
          const [first, ...rest] = name.split(' ')
          setForm(f => ({ ...f, first_name: first || '', last_name: rest.join(' ') || '' }))
        }
      })
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const j = await res.json()
    if (j.profile) {
      setProfile(j.profile)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  const COUNTRIES = [
    '', 'France', 'United Kingdom', 'Germany', 'South Africa', 'India',
    'China', 'Australia', 'United States', 'Mauritius', 'Reunion', 'Other',
  ]

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Personal Details</h2>
        {!editing && (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-lg border border-sand-200 px-3 py-1.5 text-sm font-medium text-ink-secondary hover:bg-sand-50">
            <Edit2 className="h-3.5 w-3.5" />Edit
          </button>
        )}
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <Check className="h-4 w-4" />Saved
          </span>
        )}
      </div>

      {editing ? (
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">First Name</label>
              <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                required className="w-full rounded-xl border border-sand-300 px-3.5 py-2.5 text-sm text-ink shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Last Name</label>
              <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                required className="w-full rounded-xl border border-sand-300 px-3.5 py-2.5 text-sm text-ink shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Email</label>
            <input value={form.email} disabled
              className="w-full rounded-xl border border-sand-200 bg-sand-50 px-3.5 py-2.5 text-sm text-ink-secondary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Phone (optional)</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input type="tel" value={form.phone ?? ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+230 5xxx xxxx"
                className="w-full rounded-xl border border-sand-300 py-2.5 pl-10 pr-4 text-sm text-ink shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Country (optional)</label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <select value={form.country ?? ''} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                className="w-full rounded-xl border border-sand-300 py-2.5 pl-10 pr-4 text-sm text-ink shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500">
                {COUNTRIES.map(c => <option key={c} value={c}>{c || '— Select country —'}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50">
              <Check className="h-4 w-4" />{saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setEditing(false)}
              className="flex items-center gap-2 rounded-xl border border-sand-200 px-5 py-2.5 text-sm font-medium text-ink-secondary hover:bg-sand-50">
              <X className="h-4 w-4" />Cancel
            </button>
          </div>
        </form>
      ) : (
        <dl className="space-y-4">
          {[
            { icon: <User className="h-4 w-4" />, label: 'Name', value: profile ? `${profile.first_name} ${profile.last_name}`.trim() : user.user_metadata?.full_name || '—' },
            { icon: <Mail className="h-4 w-4" />, label: 'Email', value: user.email },
            { icon: <Phone className="h-4 w-4" />, label: 'Phone', value: profile?.phone || '—' },
            { icon: <Globe className="h-4 w-4" />, label: 'Country', value: profile?.country || '—' },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-3">
              <div className="mt-0.5 text-ink-muted">{row.icon}</div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">{row.label}</dt>
                <dd className="text-sm text-ink">{row.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

// ─── Lookup Section ───────────────────────────────────────────────────────────

function LookupSection() {
  const [ref, setRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Booking | null>(null)
  const [notFound, setNotFound] = useState(false)

  async function lookup(e: React.FormEvent) {
    e.preventDefault()
    if (!ref.trim()) return
    setLoading(true)
    setResult(null)
    setNotFound(false)
    const res = await fetch(`/api/booking/lookup?ref=${encodeURIComponent(ref.trim())}`)
    const j = await res.json()
    if (res.ok && j.booking) setResult(j.booking)
    else setNotFound(true)
    setLoading(false)
  }

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
      <h2 className="mb-1 text-lg font-semibold text-ink">Look Up a Booking</h2>
      <p className="mb-4 text-sm text-ink-secondary">Enter your booking reference to view details without signing in.</p>
      <form onSubmit={lookup} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input value={ref} onChange={e => setRef(e.target.value)} placeholder="TRP-XXXXX"
            className="w-full rounded-xl border border-sand-300 py-2.5 pl-10 pr-4 text-sm text-ink shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
        </div>
        <button type="submit" disabled={loading || !ref.trim()}
          className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50">
          {loading ? '…' : 'Search'}
        </button>
      </form>

      {notFound && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">No booking found with that reference.</p>
      )}

      {result && (
        <div className="mt-4 rounded-xl border border-sand-200 bg-sand-50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-ink">{result.ref}</p>
              <p className="text-sm text-ink-secondary">{new Date(result.created_at).toLocaleDateString()}</p>
            </div>
            <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium capitalize', STATUS_COLORS[result.status] ?? 'bg-gray-100 text-gray-700')}>
              {result.status}
            </span>
          </div>
          <div className="mt-3 space-y-1 border-t border-sand-200 pt-3">
            {result.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-ink-secondary">
                {PRODUCT_ICONS[item.product_type] ?? <Package className="h-4 w-4" />}
                <span>{item.product_title}</span>
                {item.booking_date && <span className="text-xs text-ink-muted">({item.booking_date})</span>}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">{result.currency} {result.total_amount.toFixed(2)}</span>
            <Link href={`/booking/${result.ref}`} className="text-sm font-medium text-brand-700 hover:underline">
              View details →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
