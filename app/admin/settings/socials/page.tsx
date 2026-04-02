"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input } from '@/components/admin/Forms'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Social = { name?: string; url: string }
type SiteSettings = { id: string; socials?: any }

export default function AdminSocials() {
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<SiteSettings | null>(null)
  const [items, setItems] = useState<Social[]>([])

  async function load() {
    const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
    setRow(data as any)
    setItems(((data?.socials as any[]) || []).map((x) => ({ name: x.name, url: x.url })))
  }
  useEffect(() => { load() }, [])

  function add() { setItems([...items, { name: 'New', url: '' }]) }
  function remove(i: number) { setItems(items.filter((_, idx) => idx !== i)) }

  async function save() {
    if (!row) return
    await supabase.from('site_settings').update({ socials: items }).eq('id', row.id)
    alert('Saved')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Settings', href:'/admin/settings' }, { label:'Social Links' }]} />
      <PageHeader title="Social Links" subtitle="Links in footer and elsewhere" actions={<Button onClick={save}>Save</Button>} />
      <div className="grid gap-4">
        {items.map((s, i) => (
          <div key={i} className="grid md:grid-cols-3 gap-3 items-end">
            <Field label="Name"><Input value={s.name || ''} onChange={(e)=>setItems(prev=>prev.map((x,idx)=>idx===i?{...x, name:e.target.value}:x))} /></Field>
            <Field label="URL"><Input value={s.url} onChange={(e)=>setItems(prev=>prev.map((x,idx)=>idx===i?{...x, url:e.target.value}:x))} /></Field>
            <div className="flex justify-end"><Button variant="outline" onClick={()=>remove(i)}>Remove</Button></div>
          </div>
        ))}
        <Button onClick={add}>Add Link</Button>
      </div>
    </div>
  )
}

