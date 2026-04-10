'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabase = getBrowserSupabase()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4 pt-20 pb-16">
        <div className="w-full max-w-md">
          <Link href="/account/login"
            className="mb-6 flex items-center gap-2 text-sm text-ink-secondary hover:text-ink">
            <ArrowLeft className="h-4 w-4" />Back to Sign In
          </Link>

          {sent ? (
            <div className="rounded-2xl border border-green-200 bg-white p-10 text-center shadow-card">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h2 className="text-xl font-bold text-ink">Check your email</h2>
              <p className="mt-2 text-sm text-ink-secondary">
                We sent a password reset link to <strong>{email}</strong>.
                <br />It expires in 1 hour.
              </p>
              <Link href="/account/login"
                className="mt-6 inline-block rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
                  <Mail className="h-7 w-7 text-brand-700" />
                </div>
                <h1 className="text-2xl font-bold text-ink">Reset Password</h1>
                <p className="mt-1.5 text-sm text-ink-secondary">
                  Enter your email and we'll send you a reset link.
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
                  {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                  <button disabled={loading}
                    className="w-full rounded-xl bg-brand-700 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-800 disabled:opacity-50">
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
