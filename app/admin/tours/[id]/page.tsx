"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea, Select, Switch } from '@/components/admin/Forms'
import ImagePicker from '@/components/admin/ImagePicker'
import { useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type IdLabel = { id: string; name: string }

export default function EditTour({ params }: { params: { id: string } }) {
  const id = params.id
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<any>(null)
  const [destinations, setDestinations] = useState<IdLabel[]>([])
  const [categories, setCategories] = useState<IdLabel[]>([])
  const [allBadges, setAllBadges] = useState<IdLabel[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [gallery, setGallery] = useState<string[]>([])

  async function load() {
    const [{ data: tour }, { data: dests }, { data: cats }, { data: badges }, { data: catLinks }, { data: badgeLinks }] = await Promise.all([
      supabase.from('tours').select('*').eq('id', id).single(),
      supabase.from('destinations').select('id,name').order('name'),
      supabase.from('activity_categories').select('id,name').order('name'),
      supabase.from('badges').select('id,label as name').order('position'),
      supabase.from('tours_activity_categories').select('category_id').eq('tour_id', id),
      supabase.from('tour_badges').select('badge_id').eq('tour_id', id),
    ])
    setRow(tour)
    setDestinations((dests || []) as any)
    setCategories((cats || []) as any)
    setAllBadges((badges || []) as any)
    setSelectedCategories((catLinks || []).map((x: any) => x.category_id))
    setSelectedBadges((badgeLinks || []).map((x: any) => x.badge_id))
    setGallery(tour?.gallery_urls || [])
  }
  useEffect(() => { load() }, [id])

  function updateGallery(idx: number, url: string) {
    setGallery((prev) => prev.map((g, i) => (i === idx ? url : g)))
  }
  function addImage(url: string) { setGallery((prev) => [...prev, url]) }
  function removeImage(idx: number) { setGallery((prev) => prev.filter((_, i) => i !== idx)) }

  async function save() {
    const payload = { ...row, gallery_urls: gallery }
    await supabase.from('tours').update(payload).eq('id', id)
    // Sync categories
    const { data: existingCats } = await supabase.from('tours_activity_categories').select('category_id').eq('tour_id', id)
    const currentCats = new Set((existingCats || []).map((x: any) => x.category_id))
    const nextCats = new Set(selectedCategories)
    for (const c of selectedCategories) {
      if (!currentCats.has(c)) await supabase.from('tours_activity_categories').insert({ tour_id: id, category_id: c })
    }
    for (const c of Array.from(currentCats)) {
      if (!nextCats.has(c)) await supabase.from('tours_activity_categories').delete().eq('tour_id', id).eq('category_id', c)
    }
    // Sync badges
    const { data: existingBadges } = await supabase.from('tour_badges').select('badge_id').eq('tour_id', id)
    const currentBadges = new Set((existingBadges || []).map((x: any) => x.badge_id))
    const nextBadges = new Set(selectedBadges)
    for (const b of selectedBadges) {
      if (!currentBadges.has(b)) await supabase.from('tour_badges').insert({ tour_id: id, badge_id: b })
    }
    for (const b of Array.from(currentBadges)) {
      if (!nextBadges.has(b)) await supabase.from('tour_badges').delete().eq('tour_id', id).eq('badge_id', b)
    }
    alert('Saved')
  }

  if (!row) return null

  return (
    <div className="space-y-6 max-w-[1100px]">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Tours', href:'/admin/tours' }, { label: row.name || 'Edit' }]} />
      <PageHeader title={row.name || 'Edit Tour'} subtitle="Content, pricing, images, SEO" actions={<Button onClick={save}>Save</Button>} />
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column: basics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Title"><Input value={row.name || ''} onChange={(e)=>setRow((r:any)=>({...r, name:e.target.value}))} /></Field>
              <Field label="Slug"><Input value={row.slug || ''} onChange={(e)=>setRow((r:any)=>({...r, slug:e.target.value}))} /></Field>
              <Field label="Destination">
                <Select value={row.destination_id || ''} onChange={(e)=>setRow((r:any)=>({...r, destination_id:(e.target as HTMLSelectElement).value || null}))}>
                  <option value="">—</option>
                  {destinations.map((d)=> <option key={d.id} value={d.id}>{d.name}</option>)}
                </Select>
              </Field>
              <Field label="Duration"><Input value={row.duration || ''} onChange={(e)=>setRow((r:any)=>({...r, duration:e.target.value}))} /></Field>
              <Field label="Transport"><Input value={row.transport || ''} onChange={(e)=>setRow((r:any)=>({...r, transport:e.target.value}))} /></Field>
              <Field label="Difficulty"><Input value={row.difficulty || ''} onChange={(e)=>setRow((r:any)=>({...r, difficulty:e.target.value}))} /></Field>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Field label="Short Description"><Textarea value={row.summary || ''} onChange={(e)=>setRow((r:any)=>({...r, summary:e.target.value}))} /></Field>
              <Field label="Long Description"><Textarea value={row.description || ''} onChange={(e)=>setRow((r:any)=>({...r, description:e.target.value}))} /></Field>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Pricing</div>
            <div className="grid md:grid-cols-4 gap-4">
              <Field label="Price From"><Input type="number" value={row.price_from ?? 0} onChange={(e)=>setRow((r:any)=>({...r, price_from:Number(e.target.value)}))} /></Field>
              <Field label="Currency"><Input value={row.currency || 'MUR'} onChange={(e)=>setRow((r:any)=>({...r, currency:e.target.value}))} /></Field>
              <div className="flex items-center gap-3 mt-6"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">On Sale</span><Switch checked={!!row.sale_active} onChange={(v)=>setRow((r:any)=>({...r, sale_active:v}))} /></div>
              <Field label="Sale Price"><Input type="number" value={row.sale_price ?? ''} onChange={(e)=>setRow((r:any)=>({...r, sale_price:Number(e.target.value)}))} /></Field>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Inclusions & Exclusions</div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Inclusions (one per line)"><Textarea value={(row.inclusions?.join?.('\n')) || ''} onChange={(e)=>setRow((r:any)=>({...r, inclusions:e.target.value.split('\n').filter(Boolean)}))} /></Field>
              <Field label="Exclusions (one per line)"><Textarea value={(row.exclusions?.join?.('\n')) || ''} onChange={(e)=>setRow((r:any)=>({...r, exclusions:e.target.value.split('\n').filter(Boolean)}))} /></Field>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Itinerary & Notices</div>
            <Field label="Itinerary (one item per line)"><Textarea value={(row.itinerary?.join?.('\n')) || ''} onChange={(e)=>setRow((r:any)=>({...r, itinerary:e.target.value.split('\n').filter(Boolean)}))} /></Field>
            <Field label="Notices"><Textarea value={row.notices || ''} onChange={(e)=>setRow((r:any)=>({...r, notices:e.target.value}))} /></Field>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Gallery</div>
            <Field label="Hero Image"><ImagePicker value={row.hero_image_url || ''} onChange={(url)=>setRow((r:any)=>({...r, hero_image_url:url}))} /></Field>
            {gallery.map((g, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_auto] gap-2 items-end mt-2">
                <Input value={g} onChange={(e)=>updateGallery(idx, e.target.value)} />
                <Button variant="outline" onClick={()=>removeImage(idx)}>Remove</Button>
              </div>
            ))}
            <ImagePicker onChange={(url)=>addImage(url)} />
          </div>
        </div>

        {/* Right column: taxonomy & SEO */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Categories</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <label key={c.id} className={'px-3 py-1 rounded-full border cursor-pointer ' + (selectedCategories.includes(c.id) ? 'bg-secondary text-on-secondary' : 'bg-surface-container-lowest')}>
                  <input type="checkbox" className="hidden" checked={selectedCategories.includes(c.id)} onChange={(e)=>{
                    setSelectedCategories((prev)=> e.target.checked ? [...prev, c.id] : prev.filter(x=>x!==c.id))
                  }} />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Badges</div>
            <div className="flex flex-wrap gap-2">
              {allBadges.map((b) => (
                <label key={b.id} className={'px-3 py-1 rounded-full border cursor-pointer ' + (selectedBadges.includes(b.id) ? 'bg-secondary text-on-secondary' : 'bg-surface-container-lowest')}>
                  <input type="checkbox" className="hidden" checked={selectedBadges.includes(b.id)} onChange={(e)=>{
                    setSelectedBadges((prev)=> e.target.checked ? [...prev, b.id] : prev.filter(x=>x!==b.id))
                  }} />
                  {b.name}
                </label>
              ))}
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Publish & Flags</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Active</span><Switch checked={!!row.is_active} onChange={(v)=>setRow((r:any)=>({...r, is_active:v}))} /></div>
              <div className="flex items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Featured</span><Switch checked={!!row.featured} onChange={(v)=>setRow((r:any)=>({...r, featured:v}))} /></div>
              <div className="flex items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Published</span><Switch checked={!!row.published} onChange={(v)=>setRow((r:any)=>({...r, published:v}))} /></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">SEO</div>
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

