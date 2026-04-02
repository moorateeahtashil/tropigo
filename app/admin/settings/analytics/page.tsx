"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea } from '@/components/admin/Forms'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type SiteSettings = { id: string; ga4_id?: string; meta?: any }

export default function AdminAnalytics() {
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<SiteSettings | null>(null)
  const [meta, setMeta] = useState('')

  async function load() {
    const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
    setRow(data as any)
    setMeta(JSON.stringify((data?.meta ?? {}), null, 2))
  }
  useEffect(() => { load() }, [])

  async function save() {
    if (!row) return
    let parsed: any = {}
    try { parsed = meta ? JSON.parse(meta) : {} } catch {}
    await supabase.from('site_settings').update({ ga4_id: row.ga4_id, meta: parsed }).eq('id', row.id)
    alert('Saved')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Settings', href:'/admin/settings' }, { label:'Analytics' }]} />
      <PageHeader title="Analytics & Integrations" subtitle="GA4 and other integration placeholders" actions={<Button onClick={save}>Save</Button>} />
      <div className="grid gap-4">
        <Field label="GA4 ID"><Input value={row?.ga4_id || ''} onChange={(e)=>setRow(prev=>prev?{...prev, ga4_id:e.target.value}:prev)} /></Field>
        <Field label="Meta JSON (placeholders)"><Textarea value={meta} onChange={(e)=>setMeta(e.target.value)} /></Field>
      </div>
    </div>
  )
}

