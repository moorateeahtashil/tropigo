"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import { use, useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = getSupabaseClient()
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => { (async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
    setProfile(data)
    const { data: book } = await supabase.from('bookings').select('id, booking_ref, status, payment_status, total_amount, currency, created_at').eq('user_id', id).order('created_at', { ascending:false })
    setOrders(book || [])
  })() }, [id])

  if (!profile) return null

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Customers', href:'/admin/customers' }, { label: profile.full_name || 'Customer' }]} />
      <PageHeader title={profile.full_name || 'Customer'} subtitle={profile.country || ''} />
      <div className="bg-white rounded-2xl border border-outline-variant/10 p-5">
        <div className="grid md:grid-cols-3 gap-3">
          <div><div className="text-[11px] uppercase tracking-widest text-outline">Email</div><div className="font-semibold">{profile.email || '—'}</div></div>
          <div><div className="text-[11px] uppercase tracking-widest text-outline">Phone</div><div className="font-semibold">{profile.phone || '—'}</div></div>
          <div><div className="text-[11px] uppercase tracking-widest text-outline">Country</div><div className="font-semibold">{profile.country || '—'}</div></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-outline-variant/10 p-5">
        <div className="text-lg font-bold mb-3">Orders</div>
        <Table>
          <THead>
            <tr>
              <TH>Ref</TH>
              <TH>Status</TH>
              <TH>Payment</TH>
              <TH>Total</TH>
              <TH>Created</TH>
            </tr>
          </THead>
          <TBody>
            {orders.map((r) => (
              <TR key={r.id}>
                <TD>{r.booking_ref}</TD>
                <TD>{r.status}</TD>
                <TD>{r.payment_status}</TD>
                <TD>{r.currency || 'MUR'} {Number(r.total_amount || 0).toLocaleString()}</TD>
                <TD>{new Date(r.created_at).toLocaleString()}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  )
}

