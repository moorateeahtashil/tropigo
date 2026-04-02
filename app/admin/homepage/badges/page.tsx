"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Select } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'
import { Switch, Input } from '@/components/admin/Forms'

type Badge = { id: string; label: string; description: string | null; icon_url: string | null; position: number; published: boolean; context?: string }

export default function AdminBadges() {
  const supabase = getSupabaseClient()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('badges').select('*').order('position', { ascending: true })
    setBadges(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function togglePublish(b: Badge) {
    const { error } = await supabase.from('badges').update({ published: !b.published }).eq('id', b.id)
    if (!error) load()
  }

  async function save(b: Badge) {
    await supabase.from('badges').update({ label: b.label, description: b.description, icon_url: b.icon_url }).eq('id', b.id)
  }

  async function create() {
    const { data } = await supabase.from('badges').insert({ label: 'New Badge', description: '', position: (badges.at(-1)?.position || 0) + 1, published: false }).select().single()
    if (data) setBadges([...badges, data])
  }

  async function move(b: Badge, dir: -1 | 1) {
    const idx = badges.findIndex(x => x.id === b.id)
    const swap = badges[idx + dir]
    if (!swap) return
    await supabase.from('badges').update({ position: swap.position }).eq('id', b.id)
    await supabase.from('badges').update({ position: b.position }).eq('id', swap.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Homepage', href: '/admin/homepage' }, { label: 'Badges' }]} />
      <PageHeader title="Trust Badges" subtitle="Short highlights displayed on the homepage" actions={<Button onClick={create}>New Badge</Button>} />
      <Table>
        <THead>
          <tr>
            <TH>Label</TH>
            <TH>Description</TH>
            <TH>Icon URL</TH>
            <TH>Context</TH>
            <TH>Published</TH>
            <TH>Order</TH>
            <TH>Actions</TH>
          </tr>
        </THead>
        <TBody>
          {badges.map((b, i) => (
            <TR key={b.id}>
              <TD><Input value={b.label} onChange={(e)=>setBadges(prev=>prev.map(x=>x.id===b.id?{...x, label:e.target.value}:x))} onBlur={()=>save(badges[i])} /></TD>
              <TD><Input value={b.description ?? ''} onChange={(e)=>setBadges(prev=>prev.map(x=>x.id===b.id?{...x, description:e.target.value}:x))} onBlur={()=>save(badges[i])} /></TD>
              <TD><Input value={b.icon_url ?? ''} onChange={(e)=>setBadges(prev=>prev.map(x=>x.id===b.id?{...x, icon_url:e.target.value}:x))} onBlur={()=>save(badges[i])} /></TD>
              <TD>
                <Select value={b.context || 'sitewide'} onChange={(e)=>setBadges(prev=>prev.map(x=>x.id===b.id?{...x, context:(e.target as HTMLSelectElement).value}:x))}>
                  <option value="sitewide">sitewide</option>
                  <option value="homepage">homepage</option>
                  <option value="tour">tour</option>
                  <option value="destination">destination</option>
                </Select>
              </TD>
              <TD><Switch checked={b.published} onChange={()=>togglePublish(b)} /></TD>
              <TD>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={()=>move(b,-1)}>Up</Button>
                  <Button variant="outline" onClick={()=>move(b,1)}>Down</Button>
                </div>
              </TD>
              <TD right>
                <Button variant="ghost" onClick={()=>save(badges[i])}>Save</Button>
              </TD>
            </TR>
          ))}
          {!loading && badges.length===0 && (
            <TR><TD colSpan={6}>No badges yet.</TD></TR>
          )}
        </TBody>
      </Table>
    </div>
  )
}
