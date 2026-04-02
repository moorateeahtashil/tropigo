"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import FilterBar from '@/components/admin/FilterBar'
import { Button, Input } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function AdminCustomers() {
  const supabase = getSupabaseClient()
  const [rows, setRows] = useState<any[]>([])
  const [q, setQ] = useState('')

  async function load() {
    let query = supabase.from('profiles').select('id,full_name,phone,country').order('created_at', { ascending: false })
    if (q) query = query.ilike('full_name', `%${q}%`)
    const { data } = await query
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Customers' }]} />
      <PageHeader title="Customers" subtitle="Profiles and order history" actions={<Button onClick={load}>Refresh</Button>} />
      <FilterBar>
        <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search name" />
        <Button variant="outline" onClick={load}>Search</Button>
      </FilterBar>
      <Table>
        <THead>
          <tr>
            <TH>Name</TH>
            <TH>Phone</TH>
            <TH>Country</TH>
            <TH>Actions</TH>
          </tr>
        </THead>
        <TBody>
          {rows.map((r) => (
            <TR key={r.id}>
              <TD>{r.full_name || '—'}</TD>
              <TD>{r.phone || '—'}</TD>
              <TD>{r.country || '—'}</TD>
              <TD right><Link className="underline" href={`/admin/customers/${r.id}`}>View</Link></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

