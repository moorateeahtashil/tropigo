"use client"

import { getSupabaseClient } from '@/supabase/client'
import { useState } from 'react'

export default function AdminLoginPage() {
  const supabase = getSupabaseClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [step, setStep] = useState<string | null>(null)

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setStep(null)
    try {
      setStep('Signing in…')
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) { setError(authError.message); setLoading(false); setStep(null); return }

      const user = data.user
      if (!user) { setError('Could not retrieve user after login.'); setLoading(false); setStep(null); return }

      setStep('Checking permissions…')
      const isAdmin = user.app_metadata?.is_admin === true || user.app_metadata?.is_admin === 'true'
      if (!isAdmin) {
        await supabase.auth.signOut()
        setError(`Access denied — admin accounts only. (app_metadata.is_admin = ${JSON.stringify(user.app_metadata?.is_admin ?? 'not set')})`)
        setLoading(false)
        setStep(null)
        return
      }

      setStep('Redirecting…')
      window.location.replace('/admin')
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.')
      setLoading(false)
      setStep(null)
    }
  }

  return (
    <div className="admin-login-root">
      {/* Left panel */}
      <div className="admin-login-panel">
        {/* Subtle dot grid background */}
        <div className="admin-login-panel-bg" aria-hidden>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" style={{ color: 'var(--a-border)' }} />
          </svg>
          {/* Amber glow */}
          <div style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(240,160,48,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Brand */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="admin-brand-mark" style={{ width: 36, height: 36, borderRadius: 10 }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v1m0 16v1M4.22 4.22l.71.71m13.65 13.65.71.71M3 12H4m16 0h1M4.22 19.78l.71-.71M18.36 5.64l.71-.71" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--a-text)', letterSpacing: '-0.01em' }}>Tropigo</p>
            <p style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--a-text-faint)' }}>Admin Portal</p>
          </div>
        </div>

        {/* Middle copy */}
        <div style={{ position: 'relative' }}>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--a-text)', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Manage your<br />island experiences
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--a-text-muted)', lineHeight: 1.6, marginBottom: 28 }}>
            Full control over tours, bookings, content and customers — all from one place.
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { value: '5',  label: 'Live tours'    },
              { value: '4',  label: 'Destinations'  },
              { value: '∞',  label: 'Experiences'   },
            ].map((s) => (
              <div key={s.label} style={{
                background: 'var(--a-surface-raised)',
                border: '1px solid var(--a-border)',
                borderRadius: 10,
                padding: '12px 10px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--a-text)', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--a-text-faint)', marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ position: 'relative', fontSize: '0.75rem', color: 'var(--a-text-faint)' }}>
          © {new Date().getFullYear()} Tropigo
        </p>
      </div>

      {/* Form column */}
      <div className="admin-login-form-col">
        <div className="admin-login-card">
          {/* Mobile brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }} className="lg-hide-brand">
            <div className="admin-brand-mark" style={{ width: 32, height: 32 }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v1m0 16v1M4.22 4.22l.71.71m13.65 13.65.71.71M3 12H4m16 0h1M4.22 19.78l.71-.71M18.36 5.64l.71-.71" />
              </svg>
            </div>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--a-text)' }}>Tropigo Admin</span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--a-text)', letterSpacing: '-0.02em', marginBottom: 6 }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--a-text-muted)' }}>
              Sign in to your admin account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 14px',
              borderRadius: 8,
              background: 'var(--a-error-bg)',
              border: '1px solid rgba(248,113,113,0.2)',
              marginBottom: 20,
            }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--a-error)', flexShrink: 0, marginTop: 1 }}>
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ fontSize: '0.8125rem', color: 'var(--a-error)', lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div className="admin-field">
              <span className="admin-label">Email address</span>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--a-text-faint)', width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="admin@tropigo.com"
                  autoComplete="email"
                  required
                  className="admin-input"
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="admin-field">
              <span className="admin-label">Password</span>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--a-text-faint)', width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="admin-input"
                  style={{ paddingLeft: 34, paddingRight: 38 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--a-text-faint)', padding: 2,
                  }}
                >
                  {showPw ? (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="admin-btn admin-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', marginTop: 4 }}
            >
              {loading ? (
                <>
                  <svg width="14" height="14" style={{ animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" style={{ opacity: 0.25 }} />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" style={{ opacity: 0.75 }} />
                  </svg>
                  {step ?? 'Signing in…'}
                </>
              ) : (
                <>
                  Sign in to dashboard
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--a-text-faint)', marginTop: 24 }}>
            Guest account?{' '}
            <a href="/account/login" style={{ color: 'var(--a-text-muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Sign in here
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 1024px) { .lg-hide-brand { display: none !important; } }
      `}</style>
    </div>
  )
}
