"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Switch } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Tour = { id: string; name: string; slug: string; price_from: number | null; currency: string | null; featured: boolean; published: boolean }

export default function AdminFeaturedTours() {
  const supabase = getSupabaseClient()
  const [tours, setTours] = useState<Tour[]>([])

  async function load() {
    const { data } = await supabase.from('tours').select('id,name,slug,price_from,currency,featured,published').order('position', { ascending: true })
    setTours(data || [])
  }
  useEffect(() => { load() }, [])

  async function toggleFeatured(t: Tour) {
    await supabase.from('tours').update({ featured: !t.featured }).eq('id', t.id)
    load()
  }

  async function togglePublished(t: Tour) {
    await supabase.from('tours').update({ published: !t.published }).eq('id', t.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Homepage', href: '/admin/homepage' }, { label: 'Featured Tours' }]} />
      <PageHeader title="Featured Tours" subtitle="Select tours to highlight on the homepage" />
      <Table>
        <THead>
          <tr>
            <TH>Name</TH>
            <TH>Slug</TH>
            <TH>Price</TH>
            <TH>Featured</TH>
            <TH>Published</TH>
          </tr>
        </THead>
        <TBody>
          {tours.map((t) => (
            <TR key={t.id}>
              <TD>{t.name}</TD>
              <TD>{t.slug}</TD>
              <TD>{t.currency} {t.price_from ?? ''}</TD>
              <TD><Switch checked={t.featured} onChange={()=>toggleFeatured(t)} /></TD>
              <TD><Switch checked={t.published} onChange={()=>togglePublished(t)} /></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

