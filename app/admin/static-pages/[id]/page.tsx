"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea, Switch } from '@/components/admin/Forms'
import { use, useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function StaticPageDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<any>(null)

  useEffect(() => { (async () => {
    const { data } = await supabase.from('static_pages').select('*').eq('id', id).maybeSingle()
    setRow(data)
  })() }, [id])

  async function save() {
    await supabase.from('static_pages').update(row).eq('id', id)
    alert('Saved')
  }

  if (!row) return null

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Static Pages', href:'/admin/static-pages' }, { label: row.title || 'Page' }]} />
      <PageHeader title={row.title || 'Page'} subtitle={row.slug} actions={<Button onClick={save}>Save</Button>} />
      <div className="grid gap-4">
        <Field label="Title"><Input value={row.title || ''} onChange={(e)=>setRow((r:any)=>({...r, title:e.target.value}))} /></Field>
        <Field label="Slug"><Input value={row.slug || ''} onChange={(e)=>setRow((r:any)=>({...r, slug:e.target.value}))} /></Field>
        <Field label="Content (Markdown)"><Textarea value={row.content || ''} onChange={(e)=>setRow((r:any)=>({...r, content:e.target.value}))} /></Field>
        <div className="flex items-center gap-3"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Published</span><Switch checked={!!row.published} onChange={(v)=>setRow((r:any)=>({...r, published:v}))} /></div>
      </div>
    </div>
  )
}

