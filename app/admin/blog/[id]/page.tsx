"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea, Select, Switch } from '@/components/admin/Forms'
import ImagePicker from '@/components/admin/ImagePicker'
import { use, useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function BlogPostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<any>(null)
  const [cats, setCats] = useState<any[]>([])

  useEffect(() => { (async () => {
    const [{ data }, { data: c }] = await Promise.all([
      supabase.from('blog_posts').select('*').eq('id', id).maybeSingle(),
      supabase.from('blog_categories').select('id,name').order('name')
    ])
    setRow(data)
    setCats(c || [])
  })() }, [id])

  async function save() {
    await supabase.from('blog_posts').update(row).eq('id', id)
    alert('Saved')
  }

  if (!row) return null

  return (
    <div className="space-y-6 max-w-[900px]">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Blog', href:'/admin/blog' }, { label: row.title || 'Article' }]} />
      <PageHeader title={row.title || 'Article'} subtitle={row.slug} actions={<Button onClick={save}>Save</Button>} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Field label="Title"><Input value={row.title || ''} onChange={(e)=>setRow((r:any)=>({...r, title:e.target.value}))} /></Field>
          <Field label="Slug"><Input value={row.slug || ''} onChange={(e)=>setRow((r:any)=>({...r, slug:e.target.value}))} /></Field>
          <Field label="Excerpt"><Textarea value={row.excerpt || ''} onChange={(e)=>setRow((r:any)=>({...r, excerpt:e.target.value}))} /></Field>
          <Field label="Content (Markdown)"><Textarea value={row.content || ''} onChange={(e)=>setRow((r:any)=>({...r, content:e.target.value}))} /></Field>
          <Field label="Cover Image"><ImagePicker value={row.cover_image_url || ''} onChange={(url)=>setRow((r:any)=>({...r, cover_image_url:url}))} /></Field>
        </div>
        <aside className="space-y-4">
          <Field label="Category">
            <Select value={row.category_id || ''} onChange={(e)=>setRow((r:any)=>({...r, category_id:(e.target as HTMLSelectElement).value || null}))}>
              <option value="">—</option>
              {cats.map((c)=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-widest text-outline">SEO</div>
            <Field label="SEO Title"><Input value={row.seo_title || ''} onChange={(e)=>setRow((r:any)=>({...r, seo_title:e.target.value}))} /></Field>
            <Field label="SEO Description"><Textarea value={row.seo_description || ''} onChange={(e)=>setRow((r:any)=>({...r, seo_description:e.target.value}))} /></Field>
            <Field label="SEO Image URL"><Input value={row.seo_image_url || ''} onChange={(e)=>setRow((r:any)=>({...r, seo_image_url:e.target.value}))} /></Field>
            <Field label="Canonical URL"><Input value={row.canonical_url || ''} onChange={(e)=>setRow((r:any)=>({...r, canonical_url:e.target.value}))} /></Field>
            <div className="flex items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Noindex</span><Switch checked={!!row.noindex} onChange={(v)=>setRow((r:any)=>({...r, noindex:v}))} /></div>
            <div className="flex items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Published</span><Switch checked={!!row.published} onChange={(v)=>setRow((r:any)=>({...r, published:v}))} /></div>
          </div>
        </aside>
      </div>
    </div>
  )
}

