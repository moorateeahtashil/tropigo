"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Select, Textarea } from '@/components/admin/Forms'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function EnquiryDetail({ params }: { params: { id: string } }) {
  const id = params.id
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<any>(null)

  async function load() {
    const { data } = await supabase.from('enquiries').select('*').eq('id', id).maybeSingle()
    setRow(data)
  }
  useEffect(() => { load() }, [id])

  async function save() {
    await supabase.from('enquiries').update({ status: row.status, notes: row.notes }).eq('id', id)
    alert('Saved')
  }

  if (!row) return null

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Enquiries', href:'/admin/enquiries' }, { label: row.email || 'Enquiry' }]} />
      <PageHeader title={row.name || row.email || 'Enquiry'} subtitle={row.email || ''} actions={<Button onClick={save}>Save</Button>} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-outline-variant/10 p-5">
            <Field label="Status">
              <Select value={row.status} onChange={(e)=>setRow((r:any)=>({...r, status:(e.target as HTMLSelectElement).value}))}>
                {['new','responded','archived'].map(s=> <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <div className="mt-3"><Field label="Message"><Textarea value={row.message || ''} onChange={(e)=>setRow((r:any)=>({...r, message:e.target.value}))} /></Field></div>
            <div className="mt-3"><Field label="Internal Notes"><Textarea value={row.notes || ''} onChange={(e)=>setRow((r:any)=>({...r, notes:e.target.value}))} /></Field></div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5">
            <div className="text-[11px] uppercase tracking-widest text-outline mb-2">Customer</div>
            <div className="text-sm flex items-center justify-between"><span>Name</span><span className="font-semibold">{row.name || '—'}</span></div>
            <div className="text-sm flex items-center justify-between"><span>Email</span><span>{row.email || '—'}</span></div>
            <div className="text-sm flex items-center justify-between"><span>Phone</span><span>{row.phone || '—'}</span></div>
            <div className="text-sm flex items-center justify-between"><span>Created</span><span>{new Date(row.created_at).toLocaleString()}</span></div>
          </div>
        </aside>
      </div>
    </div>
  )
}

