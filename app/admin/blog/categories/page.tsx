"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Input, Switch } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function AdminBlogCategories() {
  const supabase = getSupabaseClient()
  const [rows, setRows] = useState<any[]>([])
  const [q, setQ] = useState('')

  async function load() {
    let query = supabase.from('blog_categories').select('id,name,slug,published,position').order('position', { ascending:true })
    if (q) query = query.ilike('name', `%${q}%`)
    const { data } = await query
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  async function create() {
    const { data } = await supabase.from('blog_categories').insert({ name: 'New Category', slug: `cat-${Date.now()}` }).select().single()
    if (data) setRows([...rows, data])
  }

  async function toggle(r:any) {
    await supabase.from('blog_categories').update({ published: !r.published }).eq('id', r.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Blog', href:'/admin/blog' }, { label:'Categories' }]} />
      <PageHeader title="Blog Categories" actions={<Button onClick={create}>New Category</Button>} />
      <div className="flex gap-2"><Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search" /><Button variant="outline" onClick={load}>Search</Button></div>
      <Table>
        <THead>
          <tr>
            <TH>Name</TH>
            <TH>Slug</TH>
            <TH>Published</TH>
          </tr>
        </THead>
        <TBody>
          {rows.map((r) => (
            <TR key={r.id}>
              <TD>{r.name}</TD>
              <TD>{r.slug}</TD>
              <TD><Switch checked={r.published} onChange={()=>toggle(r)} /></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

