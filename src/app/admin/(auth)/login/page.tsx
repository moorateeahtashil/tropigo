"use client"
import { useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getBrowserSupabase()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message === 'Invalid login credentials') {
        setError('Invalid email or password. Please try again.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    window.location.href = '/admin'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 p-6">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-brand-500 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-brand-400 blur-3xl" />
        </div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Tropigo Admin</h1>
          <p className="mt-2 text-sm text-white/60">Sign in to manage your content</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <form onSubmit={signIn} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@tropigo.mu"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-12 text-sm text-white placeholder-white/30 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-200">Login Failed</p>
                  <p className="mt-0.5 text-xs text-red-300/80">{error}</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              disabled={loading}
              className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/40">
          Authorized access only. All activity is monitored.
        </p>
      </div>
    </div>
  )
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
