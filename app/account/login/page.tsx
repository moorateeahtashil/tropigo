"use client"

import Section from '@/components/ui/Section'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
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
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else window.location.href = '/account/orders'
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-outline-variant/10 p-6">
            <h1 className="font-headline text-2xl text-primary mb-4">Sign in</h1>
            {error && <div className="mb-3 text-sm text-error">{error}</div>}
            <form onSubmit={login} className="space-y-3">
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" required />
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" required />
              <Button className="w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
            </form>
            <div className="mt-4 text-sm flex justify-between">
              <a href="/account/signup" className="underline">Create account</a>
              <a href="/account/reset" className="underline">Forgot password?</a>
            </div>
          </div>
        </Section>
      </main>
      {/* @ts-expect-error Async Server Component */}
      <Footer />
    </div>
  )
}

