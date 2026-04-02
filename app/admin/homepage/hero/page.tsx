"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea, Switch } from '@/components/admin/Forms'
import ImagePicker from '@/components/admin/ImagePicker'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type HeroData = {
  eyebrow?: string
  title?: string
  body?: string
  background_image_url?: string
  primary_cta_label?: string
  primary_cta_url?: string
  secondary_cta_label?: string
  secondary_cta_url?: string
}

export default function AdminHero() {
  const supabase = getSupabaseClient()
  const [sectionId, setSectionId] = useState<string | null>(null)
  const [data, setData] = useState<HeroData>({})
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data: sections } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'hero')
        .limit(1)
        .maybeSingle()
      if (sections) {
        setSectionId(sections.id)
        setData((sections.data as HeroData) || {})
        setPublished(!!sections.published)
      }
      setLoading(false)
    })()
  }, [])

  async function save() {
    setLoading(true)
    try {
      if (sectionId) {
        const { error } = await supabase.from('homepage_sections').update({ data, published }).eq('id', sectionId)
        if (error) throw error
      } else {
        const { error, data: created } = await supabase
          .from('homepage_sections')
          .insert({ section_type: 'hero', title: 'hero', data, position: 0, published })
          .select()
          .single()
        if (error) throw error
        setSectionId(created.id)
      }
      alert('Saved')
    } catch (e: any) {
      alert(e.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Homepage', href: '/admin/homepage' }, { label: 'Hero' }]} />
      <PageHeader title="Homepage Hero" subtitle="Edit hero copy, background image, and CTAs" actions={<Button onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save'}</Button>} />
      <div className="grid gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Published</span>
          <Switch checked={published} onChange={setPublished} />
        </div>
        <Field label="Eyebrow"><Input value={data.eyebrow || ''} onChange={(e)=>setData({...data, eyebrow: e.target.value})} /></Field>
        <Field label="Title"><Input value={data.title || ''} onChange={(e)=>setData({...data, title: e.target.value})} /></Field>
        <Field label="Body"><Textarea value={data.body || ''} onChange={(e)=>setData({...data, body: e.target.value})} /></Field>
        <Field label="Background Image"><ImagePicker value={data.background_image_url} onChange={(url)=>setData({...data, background_image_url: url})} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Primary CTA Label"><Input value={data.primary_cta_label || ''} onChange={(e)=>setData({...data, primary_cta_label: e.target.value})} /></Field>
          <Field label="Primary CTA URL"><Input value={data.primary_cta_url || ''} onChange={(e)=>setData({...data, primary_cta_url: e.target.value})} /></Field>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Secondary CTA Label"><Input value={data.secondary_cta_label || ''} onChange={(e)=>setData({...data, secondary_cta_label: e.target.value})} /></Field>
          <Field label="Secondary CTA URL"><Input value={data.secondary_cta_url || ''} onChange={(e)=>setData({...data, secondary_cta_url: e.target.value})} /></Field>
        </div>
      </div>
    </div>
  )
}

