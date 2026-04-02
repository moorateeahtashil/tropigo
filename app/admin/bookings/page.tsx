"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import FilterBar from '@/components/admin/FilterBar'
import { Button, Input, Select } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Row = { id: string; booking_ref: string; status: string; payment_status: string; total_amount: number | null; currency: string | null; customer_email: string | null; created_at: string }

export default function AdminBookings() {
  const supabase = getSupabaseClient()
  const [rows, setRows] = useState<Row[]>([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [pay, setPay] = useState('')

  async function load() {
    let query = supabase
      .from('bookings')
      .select('id, booking_ref, status, payment_status, total_amount, currency, customer_email, created_at')
      .order('created_at', { ascending: false })
    if (q) query = query.or(`booking_ref.ilike.%${q}%,customer_email.ilike.%${q}%`)
    if (status) query = query.eq('status', status)
    if (pay) query = query.eq('payment_status', pay)
    const { data } = await query
    setRows(data || [])
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Bookings' }]} />
      <PageHeader title="Bookings" subtitle="Manage and review bookings" actions={<Button onClick={()=>load()}>Refresh</Button>} />
      <FilterBar>
        <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search ref/email" />
        <Select value={status} onChange={(e)=>setStatus((e.target as HTMLSelectElement).value)}>
          <option value="">All status</option>
          <option value="pending">pending</option>
          <option value="reserved">reserved</option>
          <option value="confirmed">confirmed</option>
          <option value="canceled">canceled</option>
          <option value="failed">failed</option>
        </Select>
        <Select value={pay} onChange={(e)=>setPay((e.target as HTMLSelectElement).value)}>
          <option value="">All payments</option>
          <option value="unpaid">unpaid</option>
          <option value="authorized">authorized</option>
          <option value="paid">paid</option>
        </Select>
        <Button variant="outline" onClick={load}>Apply</Button>
      </FilterBar>
      <Table>
        <THead>
          <tr>
            <TH>Ref</TH>
            <TH>Status</TH>
            <TH>Payment</TH>
            <TH>Total</TH>
            <TH>Customer</TH>
            <TH>Created</TH>
            <TH>Actions</TH>
          </tr>
        </THead>
        <TBody>
          {rows.map((r) => (
            <TR key={r.id}>
              <TD>{r.booking_ref}</TD>
              <TD>{r.status}</TD>
              <TD>{r.payment_status}</TD>
              <TD>{r.currency || 'MUR'} {Number(r.total_amount || 0).toLocaleString()}</TD>
              <TD>{r.customer_email || '—'}</TD>
              <TD>{new Date(r.created_at).toLocaleString()}</TD>
              <TD right>
                <Link className="underline" href={`/admin/bookings/${r.id}`}>View</Link>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}
