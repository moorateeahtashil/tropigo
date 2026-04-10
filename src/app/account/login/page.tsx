'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getBrowserSupabase()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Invalid email or password.' : error.message)
      setLoading(false)
      return
    }

    // Refresh server-side session then navigate
    router.refresh()
    router.push('/account')
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4 pt-20 pb-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
              <LogIn className="h-7 w-7 text-brand-700" />
            </div>
            <h1 className="text-2xl font-bold text-ink">Sign In</h1>
            <p className="mt-1.5 text-sm text-ink-secondary">
              Welcome back — sign in to manage your bookings.
            </p>
          </div>

          <div className="rounded-2xl border border-sand-200 bg-white p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-ink">Password</label>
                  <Link href="/account/forgot-password" className="text-xs text-brand-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'} required value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password" autoComplete="current-password"
                    className="w-full rounded-xl border border-sand-300 bg-white py-2.5 pl-10 pr-10 text-sm text-ink placeholder-ink-muted shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

              <button disabled={loading}
                className="w-full rounded-xl bg-brand-700 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-800 disabled:opacity-50">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-ink-secondary">
            Don&apos;t have an account?{' '}
            <Link href="/account/signup" className="font-semibold text-brand-700 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
