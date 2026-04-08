'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { CheckCircle, Send } from 'lucide-react'

function EnquiryForm() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId') || undefined

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          related_product_id: productId || null,
        }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        setError(json?.error || 'Failed to submit enquiry')
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="heading-display">Enquiry Form</h1>
          <p className="mt-4 text-ink-secondary">
            Have a question or special request? Fill out the form below and our team will get back to you within 24 hours.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
              <h2 className="mt-4 text-xl font-semibold text-green-800">Enquiry Sent!</h2>
              <p className="mt-2 text-green-700">
                Thank you for your enquiry. We will respond to your email shortly.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSubmitted(false)
                  setForm({ name: '', email: '', phone: '', subject: '', message: '' })
                }}
              >
                Submit Another Enquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ink">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-ink">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  placeholder="+230 5xxx xxxx"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-ink">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  placeholder="e.g., Group booking for 10 people"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ink">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  placeholder="Tell us more about your enquiry..."
                />
              </div>

              {productId && (
                <input type="hidden" name="related_product_id" value={productId} />
              )}

              <Button type="submit" size="lg" disabled={submitting} className="w-full">
                {submitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Enquiry
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function EnquiryPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="container-page pt-28 pb-16">
          <div className="mx-auto max-w-2xl">
            <h1 className="heading-display">Enquiry Form</h1>
            <div className="mt-8 h-64 animate-pulse rounded-2xl bg-sand-100" />
          </div>
        </main>
        <Footer />
      </>
    }>
      <EnquiryForm />
    </Suspense>
  )
}
