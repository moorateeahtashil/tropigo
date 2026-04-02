"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea, Switch } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Testimonial = { id: string; author_name: string; author_location: string | null; quote: string; rating: number | null; published: boolean; position: number }

export default function AdminTestimonials() {
  const supabase = getSupabaseClient()
  const [items, setItems] = useState<Testimonial[]>([])

  async function load() {
    const { data } = await supabase.from('testimonials').select('*').order('position', { ascending: true })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function create() {
    const { data } = await supabase
      .from('testimonials')
      .insert({ author_name: 'New Author', quote: 'Sample quote', rating: 5, position: (items.at(-1)?.position || 0) + 1, published: false })
      .select()
      .single()
    if (data) setItems([...items, data])
  }

  async function save(t: Testimonial) {
    await supabase.from('testimonials').update(t).eq('id', t.id)
  }

  async function togglePublished(t: Testimonial) {
    await supabase.from('testimonials').update({ published: !t.published }).eq('id', t.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Homepage', href: '/admin/homepage' }, { label: 'Testimonials' }]} />
      <PageHeader title="Testimonials" subtitle="Guest feedback for social proof" actions={<Button onClick={create}>New Testimonial</Button>} />
      <Table>
        <THead>
          <tr>
            <TH>Author</TH>
            <TH>Location</TH>
            <TH>Quote</TH>
            <TH>Rating</TH>
            <TH>Published</TH>
            <TH>Save</TH>
          </tr>
        </THead>
        <TBody>
          {items.map((t, i) => (
            <TR key={t.id}>
              <TD><Input value={t.author_name} onChange={(e)=>setItems(prev=>prev.map(x=>x.id===t.id?{...x, author_name:e.target.value}:x))} /></TD>
              <TD><Input value={t.author_location ?? ''} onChange={(e)=>setItems(prev=>prev.map(x=>x.id===t.id?{...x, author_location:e.target.value}:x))} /></TD>
              <TD><Textarea value={t.quote} onChange={(e)=>setItems(prev=>prev.map(x=>x.id===t.id?{...x, quote:e.target.value}:x))} /></TD>
              <TD><Input type="number" value={t.rating ?? 5} onChange={(e)=>setItems(prev=>prev.map(x=>x.id===t.id?{...x, rating:Number(e.target.value)}:x))} /></TD>
              <TD><Switch checked={t.published} onChange={()=>togglePublished(t)} /></TD>
              <TD right><Button variant="ghost" onClick={()=>save(items[i])}>Save</Button></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

