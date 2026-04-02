"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input } from '@/components/admin/Forms'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Partner = { name?: string; logo_url: string; url?: string }

export default function AdminPartners() {
  const supabase = getSupabaseClient()
  const [sectionId, setSectionId] = useState<string | null>(null)
  const [items, setItems] = useState<Partner[]>([])

  async function load() {
    const { data } = await supabase
      .from('homepage_sections')
      .select('*')
      .eq('section_type', 'custom')
      .eq('title', 'partners')
      .maybeSingle()
    if (data) {
      setSectionId(data.id)
      setItems((data.data as Partner[]) || [])
    } else {
      setSectionId(null)
      setItems([])
    }
  }
  useEffect(() => { load() }, [])

  async function save() {
    if (sectionId) {
      await supabase.from('homepage_sections').update({ data: items }).eq('id', sectionId)
    } else {
      const { data } = await supabase
        .from('homepage_sections')
        .insert({ section_type: 'custom', title: 'partners', data: items, published: true, position: 50 })
        .select()
        .single()
      if (data) setSectionId(data.id)
    }
    alert('Saved')
  }

  function add() {
    setItems([...items, { name: 'New Partner', logo_url: '', url: '' }])
  }

  function remove(idx: number) {
    setItems(items.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label:'Homepage', href:'/admin/homepage' }, { label: 'Partners' }]} />
      <PageHeader title="Partner Logos" subtitle="Logos shown in the partners strip" actions={<Button onClick={save}>Save</Button>} />
      <div className="grid gap-4">
        {items.map((p, i) => (
          <div key={i} className="grid md:grid-cols-3 gap-3 items-end">
            <Field label="Name"><Input value={p.name || ''} onChange={(e)=>setItems(prev=>prev.map((x,idx)=>idx===i?{...x, name:e.target.value}:x))} /></Field>
            <Field label="Logo URL"><Input value={p.logo_url} onChange={(e)=>setItems(prev=>prev.map((x,idx)=>idx===i?{...x, logo_url:e.target.value}:x))} /></Field>
            <Field label="Link (optional)"><Input value={p.url || ''} onChange={(e)=>setItems(prev=>prev.map((x,idx)=>idx===i?{...x, url:e.target.value}:x))} /></Field>
            <div className="md:col-span-3 flex justify-end"><Button variant="outline" onClick={()=>remove(i)}>Remove</Button></div>
          </div>
        ))}
        <Button onClick={add}>Add Partner</Button>
      </div>
    </div>
  )
}

