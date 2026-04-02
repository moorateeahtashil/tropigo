"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import FilterBar from '@/components/admin/FilterBar'
import { Button, Input, Switch, Select } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function AdminBlog() {
  const supabase = getSupabaseClient()
  const [rows, setRows] = useState<any[]>([])
  const [q, setQ] = useState('')

  async function load() {
    let query = supabase.from('blog_posts').select('id,title,slug,published,published_at').order('published_at', { ascending: false })
    if (q) query = query.ilike('title', `%${q}%`)
    const { data } = await query
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  async function create() {
    const { data } = await supabase.from('blog_posts').insert({ title: 'New Article', slug: `article-${Date.now()}`, content: '...' }).select().single()
    if (data) setRows([data, ...rows])
  }

  async function toggle(r: any) {
    await supabase.from('blog_posts').update({ published: !r.published }).eq('id', r.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Blog' }]} />
      <PageHeader title="Blog" subtitle="Travel guides and articles" actions={<Button onClick={create}>New Article</Button>} />
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
              <TD right><Link className="underline" href={`/admin/blog/${r.id}`}>Edit</Link></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

