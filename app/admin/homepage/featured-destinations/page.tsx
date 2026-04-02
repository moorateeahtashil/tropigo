"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Switch } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Destination = { id: string; name: string; slug: string; featured: boolean; published: boolean }

export default function AdminFeaturedDestinations() {
  const supabase = getSupabaseClient()
  const [items, setItems] = useState<Destination[]>([])

  async function load() {
    const { data } = await supabase.from('destinations').select('id,name,slug,featured,published').order('position', { ascending: true })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function toggleFeatured(d: Destination) {
    await supabase.from('destinations').update({ featured: !d.featured }).eq('id', d.id)
    load()
  }

  async function togglePublished(d: Destination) {
    await supabase.from('destinations').update({ published: !d.published }).eq('id', d.id)
    load()
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Homepage', href: '/admin/homepage' }, { label: 'Featured Destinations' }]} />
      <PageHeader title="Featured Destinations" subtitle="Select destinations to highlight on the homepage" />
      <Table>
        <THead>
          <tr>
            <TH>Name</TH>
            <TH>Slug</TH>
            <TH>Featured</TH>
            <TH>Published</TH>
          </tr>
        </THead>
        <TBody>
          {items.map((d) => (
            <TR key={d.id}>
              <TD>{d.name}</TD>
              <TD>{d.slug}</TD>
              <TD><Switch checked={d.featured} onChange={()=>toggleFeatured(d)} /></TD>
              <TD><Switch checked={d.published} onChange={()=>togglePublished(d)} /></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

