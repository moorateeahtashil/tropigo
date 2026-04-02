"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import FilterBar from '@/components/admin/FilterBar'
import { Button, Input, Switch } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Row = { id: string; name: string; slug: string; featured: boolean; position: number; published: boolean }

export default function AdminDestinations() {
  const supabase = getSupabaseClient()
  const [rows, setRows] = useState<Row[]>([])

  async function load() {
    const { data } = await supabase.from('destinations').select('id,name,slug,featured,position,published').order('position', { ascending: true })
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  async function create() {
    const { data } = await supabase
      .from('destinations')
      .insert({ name: 'New Destination', slug: `dest-${Date.now()}`, position: (rows.at(-1)?.position || 0) + 1, published: false })
      .select()
      .single()
    if (data) setRows([...rows, data])
  }

  async function save(r: Row) {
    await supabase.from('destinations').update({ name: r.name, slug: r.slug }).eq('id', r.id)
  }

  async function toggle(r: Row, key: 'featured' | 'published') {
    await supabase.from('destinations').update({ [key]: !r[key] as any }).eq('id', r.id)
    load()
  }

  async function move(r: Row, dir: -1 | 1) {
    const idx = rows.findIndex(x => x.id === r.id)
    const swap = rows[idx + dir]
    if (!swap) return
    await supabase.from('destinations').update({ position: swap.position }).eq('id', r.id)
    await supabase.from('destinations').update({ position: r.position }).eq('id', swap.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Destinations' }]} />
      <PageHeader title="Destinations" subtitle="Manage destinations and SEO" actions={<Button onClick={create}>New Destination</Button>} />
      <FilterBar>
        <div className="text-sm text-outline">{rows.length} destinations</div>
      </FilterBar>
      <Table>
        <THead>
          <tr>
            <TH>Name</TH>
            <TH>Slug</TH>
            <TH>Featured</TH>
            <TH>Position</TH>
            <TH>Published</TH>
            <TH>Actions</TH>
          </tr>
        </THead>
        <TBody>
          {rows.map((r, i) => (
            <TR key={r.id}>
              <TD><Input value={r.name} onChange={(e)=>setRows(prev=>prev.map(x=>x.id===r.id?{...x, name:e.target.value}:x))} onBlur={()=>save(rows[i])} /></TD>
              <TD><Input value={r.slug} onChange={(e)=>setRows(prev=>prev.map(x=>x.id===r.id?{...x, slug:e.target.value}:x))} onBlur={()=>save(rows[i])} /></TD>
              <TD><Switch checked={r.featured} onChange={()=>toggle(r,'featured')} /></TD>
              <TD>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={()=>move(r,-1)}>Up</Button>
                  <Button variant="outline" onClick={()=>move(r,1)}>Down</Button>
                </div>
              </TD>
              <TD><Switch checked={r.published} onChange={()=>toggle(r,'published')} /></TD>
              <TD right>
                <Link href={`/admin/destinations/${r.id}`} className="underline">Edit</Link>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}
