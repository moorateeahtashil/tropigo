'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Mail, Lock, Eye, EyeOff, User, UserPlus, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const supabase = getBrowserSupabase()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: `${firstName} ${lastName}`.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // If email confirmation is disabled in Supabase, user is immediately signed in
    if (data.session) {
      window.location.href = '/account'
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4 pt-20 pb-16">
          <div className="w-full max-w-md text-center">
            <div className="rounded-2xl border border-green-200 bg-white p-10 shadow-card">
              <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-500" />
              <h2 className="text-2xl font-bold text-ink">Check your email</h2>
              <p className="mt-3 text-ink-secondary">
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
              </p>
              <Link href="/account/login"
                className="mt-6 inline-block rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
                Back to Sign In
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4 pt-20 pb-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
              <UserPlus className="h-7 w-7 text-brand-700" />
            </div>
            <h1 className="text-2xl font-bold text-ink">Create Account</h1>
            <p className="mt-1.5 text-sm text-ink-secondary">
              Join Tropigo to track your bookings and manage your trips.
            </p>
          </div>

          <div className="rounded-2xl border border-sand-200 bg-white p-8 shadow-card">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">First Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                    <input
                      type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                      placeholder="Jane" autoComplete="given-name"
                      className="w-full rounded-xl border border-sand-300 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder-ink-muted shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Last Name</label>
                  <input
                    type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                    placeholder="Smith" autoComplete="family-name"
                    className="w-full rounded-xl border border-sand-300 bg-white py-2.5 px-4 text-sm text-ink placeholder-ink-muted shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" autoComplete="email"
                    className="w-full rounded-xl border border-sand-300 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder-ink-muted shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'} required value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters" autoComplete="new-password"
                    className="w-full rounded-xl border border-sand-300 bg-white py-2.5 pl-10 pr-10 text-sm text-ink placeholder-ink-muted shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-ink-muted">Minimum 8 characters</p>
              </div>

              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

              <button disabled={loading}
                className="w-full rounded-xl bg-brand-700 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-800 disabled:opacity-50">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-ink-secondary">
            Already have an account?{' '}
            <Link href="/account/login" className="font-semibold text-brand-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
