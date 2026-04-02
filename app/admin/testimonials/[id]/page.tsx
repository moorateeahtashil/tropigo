"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea, Switch } from '@/components/admin/Forms'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function TestimonialDetail({ params }: { params: { id: string } }) {
  const id = params.id
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<any>(null)

  useEffect(() => { (async () => {
    const { data } = await supabase.from('testimonials').select('*').eq('id', id).maybeSingle()
    setRow(data)
  })() }, [id])

  async function save() {
    await supabase.from('testimonials').update(row).eq('id', id)
    alert('Saved')
  }

  if (!row) return null

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Testimonials', href:'/admin/testimonials' }, { label: row.author_name }]} />
      <PageHeader title={row.author_name} subtitle={row.author_location || ''} actions={<Button onClick={save}>Save</Button>} />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Author"><Input value={row.author_name || ''} onChange={(e)=>setRow((r:any)=>({...r, author_name:e.target.value}))} /></Field>
        <Field label="Location"><Input value={row.author_location || ''} onChange={(e)=>setRow((r:any)=>({...r, author_location:e.target.value}))} /></Field>
        <Field label="Quote"><Textarea value={row.quote || ''} onChange={(e)=>setRow((r:any)=>({...r, quote:e.target.value}))} /></Field>
        <Field label="Rating"><Input type="number" value={row.rating || 5} onChange={(e)=>setRow((r:any)=>({...r, rating:Number(e.target.value)}))} /></Field>
        <div className="flex items-center gap-3"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Published</span><Switch checked={!!row.published} onChange={(v)=>setRow((r:any)=>({...r, published:v}))} /></div>
      </div>
    </div>
  )
}

