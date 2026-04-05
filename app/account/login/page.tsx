"use client"

import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { getSupabaseClient } from '@/supabase/client'
import { useState } from 'react'

export default function LoginPage() {
  const supabase = getSupabaseClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) { setError(authError.message); setLoading(false); return }

      // Check if admin to redirect to the right place
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
        window.location.href = profile?.is_admin ? '/admin' : '/account/orders'
      } else {
        window.location.href = '/account/orders'
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Section>
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-outline-variant/10 p-8 shadow-sm">
        <h1 className="font-headline text-2xl text-primary mb-1">Sign in</h1>
        <p className="text-sm text-outline mb-6">Welcome back to Tropigo</p>
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-sm text-error">
            {error}
          </div>
        )}
        <form onSubmit={login} className="space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            className="w-full bg-white border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full bg-white border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
            required
          />
          <Button className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <div className="mt-5 text-sm flex justify-between text-outline">
          <a href="/account/signup" className="hover:text-primary transition-colors">Create account</a>
          <a href="/account/reset" className="hover:text-primary transition-colors">Forgot password?</a>
        </div>
      </div>
    </Section>
  )
}
