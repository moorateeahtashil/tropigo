"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea, Switch } from '@/components/admin/Forms'
import { use, useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function FaqDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<any>(null)

  useEffect(() => { (async () => {
    const { data } = await supabase.from('faqs').select('*').eq('id', id).maybeSingle()
    setRow(data)
  })() }, [id])

  async function save() {
    await supabase.from('faqs').update(row).eq('id', id)
    alert('Saved')
  }

  if (!row) return null

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'FAQs', href:'/admin/faqs' }, { label: row.question?.slice(0,32) || 'FAQ' }]} />
      <PageHeader title="FAQ" subtitle={row.category || ''} actions={<Button onClick={save}>Save</Button>} />
      <div className="grid gap-4">
        <Field label="Category"><Input value={row.category || ''} onChange={(e)=>setRow((r:any)=>({...r, category:e.target.value}))} /></Field>
        <Field label="Question"><Input value={row.question || ''} onChange={(e)=>setRow((r:any)=>({...r, question:e.target.value}))} /></Field>
        <Field label="Answer"><Textarea value={row.answer || ''} onChange={(e)=>setRow((r:any)=>({...r, answer:e.target.value}))} /></Field>
        <div className="flex items-center gap-3"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Published</span><Switch checked={!!row.published} onChange={(v)=>setRow((r:any)=>({...r, published:v}))} /></div>
      </div>
    </div>
  )
}

