"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Select, Switch } from '@/components/admin/Forms'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function CouponDetail({ params }: { params: { id: string } }) {
  const id = params.id
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<any>(null)

  useEffect(() => { (async () => {
    const { data } = await supabase.from('coupons').select('*').eq('id', id).maybeSingle()
    setRow(data)
  })() }, [id])

  async function save() {
    await supabase.from('coupons').update(row).eq('id', id)
    alert('Saved')
  }

  if (!row) return null

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Coupons', href:'/admin/coupons' }, { label: row.code }]} />
      <PageHeader title={`Coupon ${row.code}`} subtitle={row.description || ''} actions={<Button onClick={save}>Save</Button>} />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Code"><Input value={row.code || ''} onChange={(e)=>setRow((r:any)=>({...r, code:e.target.value}))} /></Field>
        <Field label="Description"><Input value={row.description || ''} onChange={(e)=>setRow((r:any)=>({...r, description:e.target.value}))} /></Field>
        <Field label="Kind">
          <Select value={row.discount_kind} onChange={(e)=>setRow((r:any)=>({...r, discount_kind:(e.target as HTMLSelectElement).value}))}>
            <option value="percent">percent</option>
            <option value="fixed">fixed</option>
          </Select>
        </Field>
        <Field label="Value"><Input type="number" value={row.discount_value || 0} onChange={(e)=>setRow((r:any)=>({...r, discount_value:Number(e.target.value)}))} /></Field>
        <Field label="Starts"><Input type="datetime-local" value={row.starts_at ? new Date(row.starts_at).toISOString().slice(0,16) : ''} onChange={(e)=>setRow((r:any)=>({...r, starts_at: new Date((e.target as HTMLInputElement).value).toISOString()}))} /></Field>
        <Field label="Ends"><Input type="datetime-local" value={row.ends_at ? new Date(row.ends_at).toISOString().slice(0,16) : ''} onChange={(e)=>setRow((r:any)=>({...r, ends_at: new Date((e.target as HTMLInputElement).value).toISOString()}))} /></Field>
        <div className="flex items-center gap-3"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Active</span><Switch checked={!!row.active} onChange={(v)=>setRow((r:any)=>({...r, active:v}))} /></div>
      </div>
    </div>
  )
}

