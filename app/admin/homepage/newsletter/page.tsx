"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea } from '@/components/admin/Forms'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Newsletter = { eyebrow?: string; title?: string; body?: string; cta_label?: string }

export default function AdminNewsletter() {
  const supabase = getSupabaseClient()
  const [sectionId, setSectionId] = useState<string | null>(null)
  const [data, setData] = useState<Newsletter>({})

  async function load() {
    const { data } = await supabase
      .from('homepage_sections')
      .select('*')
      .eq('section_type', 'custom')
      .eq('title', 'newsletter')
      .maybeSingle()
    if (data) {
      setSectionId(data.id)
      setData((data.data as Newsletter) || {})
    } else {
      setSectionId(null)
      setData({})
    }
  }
  useEffect(() => { load() }, [])

  async function save() {
    if (sectionId) {
      await supabase.from('homepage_sections').update({ data }).eq('id', sectionId)
    } else {
      const { data: created } = await supabase
        .from('homepage_sections')
        .insert({ section_type: 'custom', title: 'newsletter', data, published: true, position: 60 })
        .select()
        .single()
      if (created) setSectionId(created.id)
    }
    alert('Saved')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Homepage', href:'/admin/homepage' }, { label:'Newsletter' }]} />
      <PageHeader title="Newsletter Section" subtitle="Edit the newsletter call-to-action" actions={<Button onClick={save}>Save</Button>} />
      <div className="grid gap-4">
        <Field label="Eyebrow"><Input value={data.eyebrow || ''} onChange={(e)=>setData({...data, eyebrow:e.target.value})} /></Field>
        <Field label="Title"><Input value={data.title || ''} onChange={(e)=>setData({...data, title:e.target.value})} /></Field>
        <Field label="Body"><Textarea value={data.body || ''} onChange={(e)=>setData({...data, body:e.target.value})} /></Field>
        <Field label="CTA Label"><Input value={data.cta_label || ''} onChange={(e)=>setData({...data, cta_label:e.target.value})} /></Field>
      </div>
    </div>
  )
}

