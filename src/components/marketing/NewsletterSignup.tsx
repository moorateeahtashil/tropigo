'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'
import { CheckCircle, Mail, Loader2 } from 'lucide-react'

interface NewsletterSignupProps {
  variant?: 'inline' | 'footer' | 'modal' | 'standalone'
  className?: string
}

export function NewsletterSignup({ variant = 'inline', className }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        setError(json?.error || 'Failed to subscribe')
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        className={cn(
          'rounded-xl border border-green-200 bg-green-50 p-4',
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">You&apos;re subscribed!</p>
            <p className="text-sm text-green-700">
              Watch your inbox for exclusive deals and travel inspiration.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit} className={cn('space-y-2', className)}>
        <div className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
          />
          <Button
            type="submit"
            size="sm"
            disabled={submitting}
            className="bg-white text-brand-800 hover:bg-white/90 px-4 py-3"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
          </Button>
        </div>
        {error && <p className="text-xs text-red-200">{error}</p>}
      </form>
    )
  }

  if (variant === 'standalone') {
    return (
      <div className={cn('mx-auto max-w-md', className)}>
        <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
              <Mail className="h-6 w-6 text-brand-700" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-ink">Get Exclusive Deals</h3>
            <p className="mt-1 text-sm text-ink-secondary">
              Subscribe to our newsletter for special offers, travel tips, and insider guides to Mauritius.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe Now
                </>
              )}
            </Button>
            <p className="text-xs text-ink-muted">
              No spam, unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    )
  }

  // Default inline variant
  return (
    <form onSubmit={handleSubmit} className={cn('space-y-2', className)}>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1"
        />
        <Button type="submit" disabled={submitting} className="px-5">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
        </Button>
      </div>
      <p className="text-xs text-ink-muted">
        Get exclusive deals & travel inspiration. No spam.
      </p>
    </form>
  )
}
