"use client"

import Section from '@/components/ui/Section'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Button from '@/components/ui/Button'
import { getSupabaseClient } from '@/supabase/client'
import { useState } from 'react'

export default function ResetPage() {
  const supabase = getSupabaseClient()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const redirectTo = `${window.location.origin}/account/update-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-outline-variant/10 p-6">
            <h1 className="font-headline text-2xl text-primary mb-4">Reset password</h1>
            {sent ? (
              <div className="text-sm text-on-surface-variant">Check your email for a password reset link.</div>
            ) : (
              <form onSubmit={send} className="space-y-3">
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" required />
                <Button className="w-full">Send reset link</Button>
              </form>
            )}
            {error && <div className="mt-3 text-sm text-error">{error}</div>}
          </div>
        </Section>
      </main>
      {/* @ts-expect-error Async Server Component */}
      <Footer />
    </div>
  )
}

