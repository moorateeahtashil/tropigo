"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Switch } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Group = { id: string; key: string; title: string; items: any[]; position: number; published: boolean }

export default function AdminFooterGroups() {
  const supabase = getSupabaseClient()
  const [groups, setGroups] = useState<Group[]>([])

  async function load() {
    const { data } = await supabase.from('footer_groups').select('*').order('position', { ascending: true })
    setGroups(data || [])
  }
  useEffect(() => { load() }, [])

  async function create() {
    const { data } = await supabase.from('footer_groups').insert({ key: `group_${Date.now()}`, title: 'New Group', items: [], position: (groups.at(-1)?.position || 0) + 1, published: true }).select().single()
    if (data) setGroups([...groups, data])
  }

  async function save(g: Group) {
    await supabase.from('footer_groups').update({ title: g.title, items: g.items, published: g.published }).eq('id', g.id)
  }

  async function toggle(g: Group) {
    await supabase.from('footer_groups').update({ published: !g.published }).eq('id', g.id)
    load()
  }

  function addItem(i: number) {
    const next = [...groups]
    const items = (next[i].items || [])
    items.push({ label: 'New Link', href: '#' })
    next[i].items = items
    setGroups(next)
  }

  function updateItem(i: number, j: number, key: 'label'|'href', value: string) {
    const next = [...groups]
    next[i].items[j][key] = value
    setGroups(next)
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Settings', href:'/admin/settings' }, { label:'Footer' }]} />
      <PageHeader title="Footer Link Groups" subtitle="Columns shown in the footer" actions={<Button onClick={create}>New Group</Button>} />
      {groups.map((g, i) => (
        <div key={g.id} className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <Field label="Title"><Input value={g.title} onChange={(e)=>setGroups(prev=>prev.map(x=>x.id===g.id?{...x, title:e.target.value}:x))} /></Field>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Published</span>
              <Switch checked={g.published} onChange={()=>toggle(g)} />
              <Button variant="ghost" onClick={()=>save(groups[i])}>Save</Button>
            </div>
          </div>
          <Table>
            <THead>
              <tr>
                <TH>Label</TH>
                <TH>URL</TH>
              </tr>
            </THead>
            <TBody>
              {(g.items || []).map((it:any, j:number) => (
                <TR key={j}>
                  <TD><Input value={it.label} onChange={(e)=>updateItem(i,j,'label', e.target.value)} /></TD>
                  <TD><Input value={it.href} onChange={(e)=>updateItem(i,j,'href', e.target.value)} /></TD>
                </TR>
              ))}
              <TR>
                <TD colSpan={2}><Button variant="outline" onClick={()=>addItem(i)}>Add Link</Button></TD>
              </TR>
            </TBody>
          </Table>
        </div>
      ))}
    </div>
  )
}

