'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const supabase = getBrowserSupabase()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  // Supabase puts the session in the URL hash after the callback redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
      else router.replace('/account/login')
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/account'), 2500)
  }

  if (!ready) return null

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4 pt-20 pb-16">
        <div className="w-full max-w-md">
          {done ? (
            <div className="rounded-2xl border border-green-200 bg-white p-10 text-center shadow-card">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h2 className="text-xl font-bold text-ink">Password updated!</h2>
              <p className="mt-2 text-sm text-ink-secondary">Redirecting to your account…</p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
                  <Lock className="h-7 w-7 text-brand-700" />
                </div>
                <h1 className="text-2xl font-bold text-ink">Set New Password</h1>
                <p className="mt-1.5 text-sm text-ink-secondary">Choose a strong password for your account.</p>
              </div>
              <div className="rounded-2xl border border-sand-200 bg-white p-8 shadow-card">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">New Password</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'} required value={password}
                        onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters"
                        className="w-full rounded-xl border border-sand-300 bg-white py-2.5 pl-10 pr-10 text-sm text-ink placeholder-ink-muted shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <button type="button" onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Confirm Password</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'} required value={confirm}
                        onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password"
                        className="w-full rounded-xl border border-sand-300 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder-ink-muted shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                  {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                  <button disabled={loading}
                    className="w-full rounded-xl bg-brand-700 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-800 disabled:opacity-50">
                    {loading ? 'Saving…' : 'Update Password'}
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
