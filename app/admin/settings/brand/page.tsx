"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input } from '@/components/admin/Forms'
import ImagePicker from '@/components/admin/ImagePicker'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type SiteSettings = { id: string; brand_name?: string; logo_url?: string }

export default function AdminBrand() {
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<SiteSettings | null>(null)

  async function load() {
    const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
    setRow(data as any)
  }
  useEffect(() => { load() }, [])

  async function save() {
    if (!row) {
      await supabase.from('site_settings').insert({ brand_name: 'Tropigo' })
    } else {
      await supabase.from('site_settings').update({ brand_name: row.brand_name, logo_url: row.logo_url }).eq('id', row.id)
    }
    alert('Saved')
    load()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Settings', href:'/admin/settings' }, { label:'Brand' }]} />
      <PageHeader title="Brand" subtitle="Brand name and logo" actions={<Button onClick={save}>Save</Button>} />
      <div className="grid gap-4">
        <Field label="Brand Name"><Input value={row?.brand_name || ''} onChange={(e)=>setRow(prev=>prev?{...prev, brand_name:e.target.value}:prev)} /></Field>
        <Field label="Logo"><ImagePicker value={row?.logo_url} onChange={(url)=>setRow(prev=>prev?{...prev, logo_url:url}:prev)} /></Field>
      </div>
    </div>
  )
}

