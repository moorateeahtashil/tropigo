"use client"

import Section from '@/components/ui/Section'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import { getSupabaseClient } from '@/supabase/client'
import { useEffect, useState } from 'react'

export default function OrdersPage() {
  const supabase = getSupabaseClient()
  const [rows, setRows] = useState<any[] | null>(null)

  useEffect(() => { (async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/account/login'; return }
    const { data } = await supabase
      .from('bookings')
      .select('id, booking_ref, status, payment_status, total_amount, currency, created_at')
      .order('created_at', { ascending: false })
    setRows(data || [])
  })() }, [])

  return (
    <div className="min-h-dvh flex flex-col">
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-outline-variant/10 p-6">
            <h1 className="font-headline text-2xl text-primary mb-4">Your Orders</h1>
            {!rows ? (
              <div className="text-sm text-outline">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="text-sm text-on-surface-variant">No orders yet.</div>
            ) : (
              <div className="divide-y divide-outline-variant/10">
                {rows.map((r) => (
                  <div key={r.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-primary">{r.booking_ref}</div>
                      <div className="text-sm text-outline">{new Date(r.created_at).toLocaleString()} • {r.status} / {r.payment_status}</div>
                    </div>
                    <div className="font-bold">{r.currency || 'MUR'} {Number(r.total_amount || 0).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>
      </main>
      {/* @ts-expect-error Async Server Component */}
      <Footer />
    </div>
  )
}

