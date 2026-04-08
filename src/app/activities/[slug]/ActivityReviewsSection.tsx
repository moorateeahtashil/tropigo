'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function ActivityReviewsSection({ productId }: { productId: string }) {
  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`).then(r => r.json()).then(d => setItems(d.reviews || []))
  }, [productId])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, author_name: name, author_email: email, rating, body })
      })
      if (res.ok) {
        setName(''); setEmail(''); setRating(5); setBody('')
        fetch(`/api/reviews?productId=${productId}`).then(r => r.json()).then(d => setItems(d.reviews || []))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-ink">Reviews</h2>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          {items.length === 0 ? (
            <p className="text-ink-secondary">No reviews yet.</p>
          ) : (
            <ul className="space-y-3">
              {items.map(r => (
                <li key={r.id} className="rounded-xl border border-sand-200 bg-white p-4 shadow-card">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    {r.verified_booking && (
                      <span className="rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700">Verified</span>
                    )}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-ink">{r.author_name}</div>
                  <div className="text-xs text-ink-muted">{new Date(r.created_at).toLocaleDateString()}</div>
                  {r.title && <div className="mt-1 font-medium text-ink">{r.title}</div>}
                  <p className="mt-2 text-ink-secondary">{r.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form onSubmit={submit} className="h-max rounded-2xl border border-sand-200 bg-white p-4 shadow-card">
          <h3 className="mb-2 font-medium text-ink">Leave a review</h3>
          <label className="block text-sm">
            <span className="mb-1 block">Name</span>
            <input value={name} onChange={e => setName(e.target.value)} required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          </label>
          <label className="mt-2 block text-sm">
            <span className="mb-1 block">Email (optional)</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          </label>
          <label className="mt-2 block text-sm">
            <span className="mb-1 block">Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRating(star)} className="p-0.5">
                  <Star className={cn('h-5 w-5', star <= rating ? 'fill-amber-500 text-amber-500' : 'text-sand-300')} />
                </button>
              ))}
            </div>
          </label>
          <label className="mt-2 block text-sm">
            <span className="mb-1 block">Review</span>
            <textarea value={body} onChange={e => setBody(e.target.value)} required rows={4} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          </label>
          <button disabled={submitting} className="mt-3 w-full rounded-xl bg-brand-700 px-3 py-2 text-white disabled:opacity-50">{submitting ? 'Sending…' : 'Submit review'}</button>
        </form>
      </div>
    </div>
  )
}
