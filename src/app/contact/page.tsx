"use client"
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setName(''); setEmail(''); setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        <h1 className="heading-display text-4xl">Contact Us</h1>
        <form onSubmit={submit} className="mt-8 max-w-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} required className="mt-1 w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          </div>
          <button disabled={status==='sending'} className="rounded-xl bg-brand-700 px-4 py-2 text-white transition-colors hover:bg-brand-800 disabled:opacity-50">
            {status==='sending' ? 'Sending…' : 'Send'}
          </button>
          {status==='sent' && <p className="text-green-700">Thanks! We’ll get back to you soon.</p>}
          {status==='error' && <p className="text-red-700">Something went wrong. Please try again.</p>}
        </form>
      </main>
      <Footer />
    </>
  )
}

