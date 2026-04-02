"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import FilterBar from '@/components/admin/FilterBar'
import { Button, Input, Select } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Row = { id: string; name: string | null; email: string | null; status: string; created_at: string }

export default function AdminEnquiries() {
  const supabase = getSupabaseClient()
  const [rows, setRows] = useState<Row[]>([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')

  async function load() {
    let query = supabase.from('enquiries').select('id,name,email,status,created_at').order('created_at', { ascending: false })
    if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`)
    if (status) query = query.eq('status', status)
    const { data } = await query
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Enquiries' }]} />
      <PageHeader title="Enquiries" subtitle="Customer enquiries" actions={<Button onClick={load}>Refresh</Button>} />
      <FilterBar>
        <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search name/email" />
        <Select value={status} onChange={(e)=>setStatus((e.target as HTMLSelectElement).value)}>
          <option value="">All</option>
          <option value="new">new</option>
          <option value="responded">responded</option>
          <option value="archived">archived</option>
        </Select>
        <Button variant="outline" onClick={load}>Apply</Button>
      </FilterBar>
      <Table>
        <THead>
          <tr>
            <TH>Name</TH>
            <TH>Email</TH>
            <TH>Status</TH>
            <TH>Created</TH>
            <TH>Actions</TH>
          </tr>
        </THead>
        <TBody>
          {rows.map((r) => (
            <TR key={r.id}>
              <TD>{r.name || '—'}</TD>
              <TD>{r.email || '—'}</TD>
              <TD>{r.status}</TD>
              <TD>{new Date(r.created_at).toLocaleString()}</TD>
              <TD right><Link className="underline" href={`/admin/enquiries/${r.id}`}>View</Link></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

