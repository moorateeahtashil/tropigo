"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Select, Switch } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Promo = { id: string; title: string; body: string | null; cta_label: string | null; cta_url: string | null; placement: string; active: boolean; priority: number }

export default function AdminPromos() {
  const supabase = getSupabaseClient()
  const [promos, setPromos] = useState<Promo[]>([])

  async function load() {
    const { data } = await supabase.from('promo_banners').select('*').order('priority', { ascending: true })
    setPromos(data || [])
  }
  useEffect(() => { load() }, [])

  async function create() {
    const { data } = await supabase
      .from('promo_banners')
      .insert({ title: 'New Promo', placement: 'inline', priority: (promos.at(-1)?.priority || 0) + 1, active: false })
      .select()
      .single()
    if (data) setPromos([...promos, data])
  }

  async function save(p: Promo) {
    await supabase.from('promo_banners').update(p).eq('id', p.id)
  }

  async function toggleActive(p: Promo) {
    await supabase.from('promo_banners').update({ active: !p.active }).eq('id', p.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Homepage', href: '/admin/homepage' }, { label: 'Promos' }]} />
      <PageHeader title="Deal Banners" subtitle="Promotional banners and CTAs" actions={<Button onClick={create}>New Promo</Button>} />
      <Table>
        <THead>
          <tr>
            <TH>Title</TH>
            <TH>Body</TH>
            <TH>CTA</TH>
            <TH>Placement</TH>
            <TH>Active</TH>
            <TH>Priority</TH>
            <TH>Save</TH>
          </tr>
        </THead>
        <TBody>
          {promos.map((p, i) => (
            <TR key={p.id}>
              <TD><Input value={p.title} onChange={(e)=>setPromos(prev=>prev.map(x=>x.id===p.id?{...x, title:e.target.value}:x))} /></TD>
              <TD><Input value={p.body ?? ''} onChange={(e)=>setPromos(prev=>prev.map(x=>x.id===p.id?{...x, body:e.target.value}:x))} /></TD>
              <TD>
                <div className="flex gap-2">
                  <Input placeholder="Label" value={p.cta_label ?? ''} onChange={(e)=>setPromos(prev=>prev.map(x=>x.id===p.id?{...x, cta_label:e.target.value}:x))} />
                  <Input placeholder="URL" value={p.cta_url ?? ''} onChange={(e)=>setPromos(prev=>prev.map(x=>x.id===p.id?{...x, cta_url:e.target.value}:x))} />
                </div>
              </TD>
              <TD>
                <Select value={p.placement} onChange={(e)=>setPromos(prev=>prev.map(x=>x.id===p.id?{...x, placement:(e.target as HTMLSelectElement).value}:x))}>
                  <option value="inline">inline</option>
                  <option value="homepage_hero">homepage_hero</option>
                  <option value="sitewide_top">sitewide_top</option>
                  <option value="footer">footer</option>
                </Select>
              </TD>
              <TD><Switch checked={p.active} onChange={()=>toggleActive(p)} /></TD>
              <TD><Input type="number" value={p.priority} onChange={(e)=>setPromos(prev=>prev.map(x=>x.id===p.id?{...x, priority: Number(e.target.value)}:x))} /></TD>
              <TD right><Button variant="ghost" onClick={()=>save(promos[i])}>Save</Button></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

