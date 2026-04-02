"use client"

import Section from '@/components/ui/Section'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Button from '@/components/ui/Button'
import { getSupabaseClient } from '@/supabase/client'
import { useEffect, useState } from 'react'

export default function UpdatePasswordPage() {
  const supabase = getSupabaseClient()
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const hash = window.location.hash
      if (hash.includes('type=recovery')) {
        // Supabase handles session from the link
      }
    })()
  }, [])

  async function update(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else setDone(true)
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-outline-variant/10 p-6">
            <h1 className="font-headline text-2xl text-primary mb-4">Set new password</h1>
            {done ? (
              <div className="text-sm text-on-surface-variant">Your password has been updated. You can now <a href="/account/login" className="underline">sign in</a>.</div>
            ) : (
              <form onSubmit={update} className="space-y-3">
                <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="New password" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" required />
                <Button className="w-full">Update password</Button>
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

