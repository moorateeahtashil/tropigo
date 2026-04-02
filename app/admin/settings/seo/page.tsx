"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea } from '@/components/admin/Forms'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type SiteSettings = { id: string; seo_title_template?: string; default_meta_description?: string; default_og_image_url?: string }

export default function AdminSEO() {
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<SiteSettings | null>(null)

  async function load() {
    const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
    setRow(data as any)
  }
  useEffect(() => { load() }, [])

  async function save() {
    if (!row) return
    await supabase.from('site_settings').update({
      seo_title_template: row.seo_title_template,
      default_meta_description: row.default_meta_description,
      default_og_image_url: row.default_og_image_url,
    }).eq('id', row.id)
    alert('Saved')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Settings', href:'/admin/settings' }, { label:'SEO' }]} />
      <PageHeader title="SEO Defaults" subtitle="Title template, meta description, OG image" actions={<Button onClick={save}>Save</Button>} />
      <div className="grid gap-4">
        <Field label="Title Template"><Input value={row?.seo_title_template || ''} onChange={(e)=>setRow(prev=>prev?{...prev, seo_title_template:e.target.value}:prev)} /></Field>
        <Field label="Default Meta Description"><Textarea value={row?.default_meta_description || ''} onChange={(e)=>setRow(prev=>prev?{...prev, default_meta_description:e.target.value}:prev)} /></Field>
        <Field label="Default OG Image URL"><Input value={row?.default_og_image_url || ''} onChange={(e)=>setRow(prev=>prev?{...prev, default_og_image_url:e.target.value}:prev)} /></Field>
      </div>
    </div>
  )
}

