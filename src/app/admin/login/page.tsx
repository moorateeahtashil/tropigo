"use client"
import { useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const supabase = getBrowserSupabase()
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/admin` } })
    if (error) setMessage(error.message)
    else setMessage('Check your email for a login link.')
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-50 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
        <div className="mb-4 text-center">
          <Link href="/" className="text-lg font-bold text-brand-950"><span className="font-serif italic">Tropi</span>go Admin</Link>
        </div>
        <form onSubmit={signIn} className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink">Admin Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          </label>
          <button disabled={loading} className="w-full rounded-xl bg-brand-700 px-3 py-2 text-white disabled:opacity-50">{loading ? 'Sending…' : 'Send magic link'}</button>
          {message && <p className="text-sm text-ink-secondary">{message}</p>}
        </form>
        <p className="mt-4 text-center text-xs text-ink-muted">Your account must have admin privileges.</p>
      </div>
    </div>
  )
}

