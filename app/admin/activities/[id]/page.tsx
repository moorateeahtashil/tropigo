"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea, Switch } from '@/components/admin/Forms'
import ImagePicker from '@/components/admin/ImagePicker'
import { use, useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function EditCategory({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<any>(null)
  const [badges, setBadges] = useState<any[]>([])
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])

  async function load() {
    const [{ data }, { data: allBadges }, { data: links }] = await Promise.all([
      supabase.from('activity_categories').select('*').eq('id', id).single(),
      supabase.from('badges').select('id,label').order('position', { ascending: true }),
      supabase.from('activity_category_badges').select('badge_id').eq('category_id', id),
    ])
    setRow(data)
    setBadges(allBadges || [])
    setSelectedBadges((links || []).map((x: any) => x.badge_id))
  }
  useEffect(() => { load() }, [id])

  async function save() {
    await supabase.from('activity_categories').update(row).eq('id', id)
    const { data: existing } = await supabase.from('activity_category_badges').select('badge_id').eq('category_id', id)
    const current = new Set((existing || []).map((x: any) => x.badge_id))
    const next = new Set(selectedBadges)
    for (const b of selectedBadges) {
      if (!current.has(b)) await supabase.from('activity_category_badges').insert({ category_id: id, badge_id: b })
    }
    for (const b of Array.from(current)) {
      if (!next.has(b)) await supabase.from('activity_category_badges').delete().eq('category_id', id).eq('badge_id', b)
    }
    alert('Saved')
  }

  if (!row) return null

  return (
    <div className="space-y-6 max-w-5xl">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Activities', href:'/admin/activities' }, { label: row.name || 'Edit' }]} />
      <PageHeader title={row.name || 'Edit Category'} subtitle="Content, image, SEO" actions={<Button onClick={save}>Save</Button>} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="Name"><Input value={row.name || ''} onChange={(e)=>setRow((r:any)=>({...r, name:e.target.value}))} /></Field>
          <Field label="Slug"><Input value={row.slug || ''} onChange={(e)=>setRow((r:any)=>({...r, slug:e.target.value}))} /></Field>
          <Field label="Description"><Textarea value={row.description || ''} onChange={(e)=>setRow((r:any)=>({...r, description:e.target.value}))} /></Field>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Published</span><Switch checked={!!row.published} onChange={(v)=>setRow((r:any)=>({...r, published:v}))} /></div>
          </div>
          <Field label="Image"><ImagePicker value={row.image_url || ''} onChange={(url)=>setRow((r:any)=>({...r, image_url:url}))} /></Field>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Badges</div>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <label key={b.id} className={'px-3 py-1 rounded-full border cursor-pointer ' + (selectedBadges.includes(b.id) ? 'bg-secondary text-on-secondary' : 'bg-surface-container-lowest')}>
                  <input type="checkbox" className="hidden" checked={selectedBadges.includes(b.id)} onChange={(e)=>{
                    setSelectedBadges((prev)=> e.target.checked ? [...prev, b.id] : prev.filter(x=>x!==b.id))
                  }} />
                  {b.label}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">SEO</div>
            <Field label="SEO Title"><Input value={row.seo_title || ''} onChange={(e)=>setRow((r:any)=>({...r, seo_title:e.target.value}))} /></Field>
            <Field label="SEO Description"><Textarea value={row.seo_description || ''} onChange={(e)=>setRow((r:any)=>({...r, seo_description:e.target.value}))} /></Field>
            <Field label="SEO Image URL"><Input value={row.seo_image_url || ''} onChange={(e)=>setRow((r:any)=>({...r, seo_image_url:e.target.value}))} /></Field>
            <Field label="Canonical URL"><Input value={row.canonical_url || ''} onChange={(e)=>setRow((r:any)=>({...r, canonical_url:e.target.value}))} /></Field>
            <div className="flex items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Noindex</span><Switch checked={!!row.noindex} onChange={(v)=>setRow((r:any)=>({...r, noindex:v}))} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}

