"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Select, Textarea } from '@/components/admin/Forms'
import { use, useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function BookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<any>(null)
  const [item, setItem] = useState<any>(null)

  async function load() {
    const { data } = await supabase.from('bookings').select('*').eq('id', id).maybeSingle()
    setRow(data)
    const { data: it } = await supabase.from('booking_items').select('*').eq('booking_id', id).maybeSingle()
    setItem(it)
  }
  useEffect(() => { load() }, [id])

  async function save() {
    await supabase.from('bookings').update({ status: row.status, payment_status: row.payment_status, notes: row.notes }).eq('id', id)
    alert('Saved')
  }

  if (!row) return null

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Bookings', href:'/admin/bookings' }, { label: row.booking_ref }]} />
      <PageHeader title={`Booking ${row.booking_ref}`} subtitle={row.customer_email || ''} actions={<Button onClick={save}>Save</Button>} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-outline-variant/10 p-5">
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Status">
                <Select value={row.status} onChange={(e)=>setRow((r:any)=>({...r, status:(e.target as HTMLSelectElement).value}))}>
                  {['pending','reserved','confirmed','canceled','failed','expired'].map(s=> <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Payment">
                <Select value={row.payment_status} onChange={(e)=>setRow((r:any)=>({...r, payment_status:(e.target as HTMLSelectElement).value}))}>
                  {['unpaid','authorized','paid','refunded','partially_refunded'].map(s=> <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
            </div>
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <Field label="Customer Name"><Input value={row.customer_name || ''} onChange={(e)=>setRow((r:any)=>({...r, customer_name:e.target.value}))} /></Field>
              <Field label="Customer Email"><Input value={row.customer_email || ''} onChange={(e)=>setRow((r:any)=>({...r, customer_email:e.target.value}))} /></Field>
            </div>
            <div className="mt-3">
              <Field label="Notes"><Textarea value={row.notes || ''} onChange={(e)=>setRow((r:any)=>({...r, notes:e.target.value}))} /></Field>
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5">
            <div className="text-[11px] uppercase tracking-widest text-outline mb-2">Booking Details</div>
            <div className="text-sm flex items-center justify-between"><span>Ref</span><span className="font-semibold">{row.booking_ref}</span></div>
            <div className="text-sm flex items-center justify-between"><span>Total</span><span className="font-semibold">{row.currency || 'MUR'} {Number(row.total_amount || 0).toLocaleString()}</span></div>
            {item && <div className="text-sm flex items-center justify-between"><span>Tour</span><span className="font-semibold">{item.title}</span></div>}
            {item && <div className="text-sm flex items-center justify-between"><span>Date</span><span>{item.starts_at ? new Date(item.starts_at).toLocaleString() : ''}</span></div>}
            {item && <div className="text-sm flex items-center justify-between"><span>Guests</span><span>{item.quantity}</span></div>}
          </div>
        </aside>
      </div>
    </div>
  )
}

