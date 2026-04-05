"use client"

import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { getSupabaseClient } from '@/supabase/client'
import { useState } from 'react'

export default function SignupPage() {
  const supabase = getSupabaseClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function signup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else window.location.href = '/account/orders'
  }

  return (
    <Section>
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-outline-variant/10 p-6">
            <h1 className="font-headline text-2xl text-primary mb-4">Create account</h1>
            {error && <div className="mb-3 text-sm text-error">{error}</div>}
            <form onSubmit={signup} className="space-y-3">
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" required />
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" required />
              <Button className="w-full" disabled={loading}>{loading ? 'Creating…' : 'Sign up'}</Button>
            </form>
            <div className="mt-4 text-sm"><a href="/account/login" className="underline">Already have an account? Sign in</a></div>
          </div>
    </Section>
  )
}

