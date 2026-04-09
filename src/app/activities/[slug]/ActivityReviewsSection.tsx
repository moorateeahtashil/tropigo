'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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
      <h2 className="mb-6 text-2xl font-semibold text-primary">Reviews</h2>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {items.length === 0 ? (
            <p className="text-on-surface-variant">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <ul className="space-y-4">
              {items.map(r => (
                <li key={r.id} className="rounded-xl border border-outline-variant/20 bg-white p-5 shadow-card">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    {r.verified_booking && (
                      <span className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Verified</span>
                    )}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-ink">{r.author_name}</div>
                  <div className="text-xs text-on-surface-variant">{new Date(r.created_at).toLocaleDateString()}</div>
                  {r.title && <div className="mt-1 font-medium text-ink">{r.title}</div>}
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{r.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form onSubmit={submit} className="h-max space-y-4 rounded-2xl border border-outline-variant/20 bg-white p-5 shadow-card">
          <h3 className="text-lg font-semibold text-primary">Leave a review</h3>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRating(star)} className="p-1 transition-transform hover:scale-110">
                  <Star className={cn('h-6 w-6', star <= rating ? 'fill-amber-500 text-amber-500' : 'text-sand-300')} />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            label="Your review"
            value={body}
            onChange={e => setBody(e.target.value)}
            required
            rows={4}
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Sending...' : 'Submit review'}
          </Button>
        </form>
      </div>
    </div>
  )
}
