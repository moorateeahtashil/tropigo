"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Select, Switch } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Item = { id: string; area: string; label: string; href: string; external: boolean; position: number; visible: boolean }

export default function AdminSettingsNavigation() {
  const supabase = getSupabaseClient()
  const [area, setArea] = useState('main')
  const [items, setItems] = useState<Item[]>([])

  async function load(a = area) {
    const { data } = await supabase
      .from('navigation_items')
      .select('id,area,label,href,external,position,visible')
      .eq('area', a)
      .order('position', { ascending: true })
    setItems(data || [])
  }
  useEffect(() => { load() }, [area])

  async function create() {
    const { data } = await supabase.from('navigation_items').insert({ area, label: 'New', href: '#', position: (items.at(-1)?.position || 0) + 1 }).select().single()
    if (data) setItems([...items, data])
  }

  async function save(it: Item) {
    await supabase.from('navigation_items').update(it).eq('id', it.id)
  }

  async function toggle(it: Item, key: 'visible' | 'external') {
    await supabase.from('navigation_items').update({ [key]: !it[key] as any }).eq('id', it.id)
    load()
  }

  async function move(it: Item, dir: -1 | 1) {
    const idx = items.findIndex(x => x.id === it.id)
    const swap = items[idx + dir]
    if (!swap) return
    await supabase.from('navigation_items').update({ position: swap.position }).eq('id', it.id)
    await supabase.from('navigation_items').update({ position: it.position }).eq('id', swap.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Settings', href:'/admin/settings' }, { label:'Navigation' }]} />
      <PageHeader title="Navigation Menus" subtitle="Main, utility, and footer navigation" actions={<Button onClick={create}>New Link</Button>} />
      <div className="pb-2"><Select value={area} onChange={(e)=>setArea((e.target as HTMLSelectElement).value)}>
        <option value="main">main</option>
        <option value="utility">utility</option>
        <option value="footer">footer</option>
      </Select></div>
      <Table>
        <THead>
          <tr>
            <TH>Label</TH>
            <TH>URL</TH>
            <TH>External</TH>
            <TH>Visible</TH>
            <TH>Order</TH>
            <TH>Save</TH>
          </tr>
        </THead>
        <TBody>
          {items.map((it, i) => (
            <TR key={it.id}>
              <TD><Input value={it.label} onChange={(e)=>setItems(prev=>prev.map(x=>x.id===it.id?{...x, label:e.target.value}:x))} /></TD>
              <TD><Input value={it.href} onChange={(e)=>setItems(prev=>prev.map(x=>x.id===it.id?{...x, href:e.target.value}:x))} /></TD>
              <TD><Switch checked={it.external} onChange={()=>toggle(it, 'external')} /></TD>
              <TD><Switch checked={it.visible} onChange={()=>toggle(it, 'visible')} /></TD>
              <TD>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={()=>move(it,-1)}>Up</Button>
                  <Button variant="outline" onClick={()=>move(it,1)}>Down</Button>
                </div>
              </TD>
              <TD right><Button variant="ghost" onClick={()=>save(items[i])}>Save</Button></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

