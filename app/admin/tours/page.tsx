"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import FilterBar from '@/components/admin/FilterBar'
import { Button, Input, Switch } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Row = { id: string; name: string; slug: string; price_from: number | null; currency: string | null; published: boolean; featured: boolean }

export default function AdminTours() {
  const supabase = getSupabaseClient()
  const [rows, setRows] = useState<Row[]>([])

  async function load() {
    const { data } = await supabase.from('tours').select('id,name,slug,price_from,currency,published,featured').order('position', { ascending: true })
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  async function create() {
    const { data } = await supabase
      .from('tours')
      .insert({ name: 'New Tour', slug: `tour-${Date.now()}`, price_from: 0, currency: 'MUR', published: false })
      .select().single()
    if (data) setRows([...rows, data])
  }

  async function save(r: Row) {
    await supabase.from('tours').update({ name: r.name, slug: r.slug }).eq('id', r.id)
  }

  async function toggle(r: Row, key: 'published'|'featured') {
    await supabase.from('tours').update({ [key]: !r[key] as any }).eq('id', r.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Tours' }]} />
      <PageHeader title="Tours" subtitle="Manage tours, images, categories" actions={<Button onClick={create}>New Tour</Button>} />
      <FilterBar>
        <div className="text-sm text-outline">{rows.length} tours</div>
      </FilterBar>
      <Table>
        <THead>
          <tr>
            <TH>Name</TH>
            <TH>Slug</TH>
            <TH>Price From</TH>
            <TH>Featured</TH>
            <TH>Published</TH>
            <TH>Actions</TH>
          </tr>
        </THead>
        <TBody>
          {rows.map((r, i) => (
            <TR key={r.id}>
              <TD><Input value={r.name} onChange={(e)=>setRows(prev=>prev.map(x=>x.id===r.id?{...x, name:e.target.value}:x))} onBlur={()=>save(rows[i])} /></TD>
              <TD><Input value={r.slug} onChange={(e)=>setRows(prev=>prev.map(x=>x.id===r.id?{...x, slug:e.target.value}:x))} onBlur={()=>save(rows[i])} /></TD>
              <TD>{r.currency} {r.price_from ?? ''}</TD>
              <TD><Switch checked={r.featured} onChange={()=>toggle(r,'featured')} /></TD>
              <TD><Switch checked={r.published} onChange={()=>toggle(r,'published')} /></TD>
              <TD right><Link className="underline" href={`/admin/tours/${r.id}`}>Edit</Link></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}
