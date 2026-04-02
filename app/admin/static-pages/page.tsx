"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import FilterBar from '@/components/admin/FilterBar'
import { Button, Input, Switch } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Row = { id: string; title: string; slug: string; published: boolean; position: number }

export default function AdminStaticPages() {
  const supabase = getSupabaseClient()
  const [rows, setRows] = useState<Row[]>([])
  const [q, setQ] = useState('')

  async function load() {
    let query = supabase.from('static_pages').select('id,title,slug,published,position').order('position', { ascending: true })
    if (q) query = query.ilike('title', `%${q}%`)
    const { data } = await query
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  async function create() {
    const { data } = await supabase.from('static_pages').insert({ title: 'New Page', slug: `page-${Date.now()}`, content: '# TBD', published: false }).select().single()
    if (data) setRows([...rows, data])
  }

  async function toggle(r: Row) {
    await supabase.from('static_pages').update({ published: !r.published }).eq('id', r.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Static Pages' }]} />
      <PageHeader title="Static Pages" subtitle="Content pages" actions={<Button onClick={create}>New Page</Button>} />
      <FilterBar>
        <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search title" />
        <Button variant="outline" onClick={load}>Search</Button>
      </FilterBar>
      <Table>
        <THead>
          <tr>
            <TH>Title</TH>
            <TH>Slug</TH>
            <TH>Published</TH>
            <TH>Actions</TH>
          </tr>
        </THead>
        <TBody>
          {rows.map((r) => (
            <TR key={r.id}>
              <TD>{r.title}</TD>
              <TD>{r.slug}</TD>
              <TD><Switch checked={r.published} onChange={()=>toggle(r)} /></TD>
              <TD right><Link className="underline" href={`/admin/static-pages/${r.id}`}>Edit</Link></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

