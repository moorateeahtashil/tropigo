"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Switch } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Legal = { id: string; title: string; slug: string; position: number; published: boolean }

export default function AdminSettingsLegal() {
  const supabase = getSupabaseClient()
  const [pages, setPages] = useState<Legal[]>([])

  async function load() {
    const { data } = await supabase.from('legal_pages').select('id,title,slug,position,published').order('position', { ascending: true })
    setPages(data || [])
  }
  useEffect(() => { load() }, [])

  async function create() {
    const { data } = await supabase.from('legal_pages').insert({ title: 'New Page', slug: `page-${Date.now()}`, content: '# TBD', position: (pages.at(-1)?.position || 0) + 1, published: false }).select().single()
    if (data) setPages([...pages, data])
  }

  async function save(p: Legal) {
    await supabase.from('legal_pages').update(p).eq('id', p.id)
  }

  async function toggle(p: Legal) {
    await supabase.from('legal_pages').update({ published: !p.published }).eq('id', p.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Settings', href:'/admin/settings' }, { label:'Legal' }]} />
      <PageHeader title="Legal Pages" subtitle="Links appear in the footer" actions={<Button onClick={create}>New Page</Button>} />
      <Table>
        <THead>
          <tr>
            <TH>Title</TH>
            <TH>Slug</TH>
            <TH>Published</TH>
            <TH>Save</TH>
          </tr>
        </THead>
        <TBody>
          {pages.map((p, i) => (
            <TR key={p.id}>
              <TD><Input value={p.title} onChange={(e)=>setPages(prev=>prev.map(x=>x.id===p.id?{...x, title:e.target.value}:x))} /></TD>
              <TD><Input value={p.slug} onChange={(e)=>setPages(prev=>prev.map(x=>x.id===p.id?{...x, slug:e.target.value}:x))} /></TD>
              <TD><Switch checked={p.published} onChange={()=>toggle(p)} /></TD>
              <TD right><Button variant="ghost" onClick={()=>save(pages[i])}>Save</Button></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

