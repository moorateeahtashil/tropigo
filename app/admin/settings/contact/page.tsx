"use client"

import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea, Switch } from '@/components/admin/Forms'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

type Contact = { id: string; emails?: string[]; phones?: string[]; whatsapp?: string; address?: any; hours?: any; published: boolean }

export default function AdminSettingsContact() {
  const supabase = getSupabaseClient()
  const [row, setRow] = useState<Contact | null>(null)
  const [emails, setEmails] = useState('')
  const [phones, setPhones] = useState('')
  const [addr, setAddr] = useState('')
  const [hours, setHours] = useState('')

  async function load() {
    const { data } = await supabase.from('contact_settings').select('*').limit(1).maybeSingle()
    if (data) {
      setRow(data as any)
      setEmails((data.emails || []).join(', '))
      setPhones((data.phones || []).join(', '))
      setAddr(JSON.stringify(data.address || {}, null, 2))
      setHours(JSON.stringify(data.hours || {}, null, 2))
    } else {
      setRow(null)
      setEmails('')
      setPhones('')
      setAddr('')
      setHours('')
    }
  }
  useEffect(() => { load() }, [])

  async function save() {
    const payload = {
      emails: emails.split(',').map((s)=>s.trim()).filter(Boolean),
      phones: phones.split(',').map((s)=>s.trim()).filter(Boolean),
      whatsapp: row?.whatsapp || '',
      address: addr ? JSON.parse(addr) : {},
      hours: hours ? JSON.parse(hours) : {},
      published: row?.published ?? true,
    }
    if (!row) {
      await supabase.from('contact_settings').insert(payload)
    } else {
      await supabase.from('contact_settings').update(payload).eq('id', row.id)
    }
    alert('Saved')
    load()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label:'Admin', href:'/admin' }, { label:'Settings', href:'/admin/settings' }, { label:'Contact' }]} />
      <PageHeader title="Contact" subtitle="Support email, phone, and WhatsApp" actions={<Button onClick={save}>Save</Button>} />
      <div className="grid gap-4">
        <Field label="Support Email(s)"><Input placeholder="comma-separated" value={emails} onChange={(e)=>setEmails(e.target.value)} /></Field>
        <Field label="Phone(s)"><Input placeholder="comma-separated" value={phones} onChange={(e)=>setPhones(e.target.value)} /></Field>
        <Field label="WhatsApp"><Input placeholder="+230 ..." value={row?.whatsapp || ''} onChange={(e)=>setRow(prev=>prev?{...prev, whatsapp:e.target.value}:prev)} /></Field>
        <Field label="Address (JSON)"><Textarea placeholder="{" value={addr} onChange={(e)=>setAddr(e.target.value)} /></Field>
        <Field label="Hours (JSON)"><Textarea placeholder="{" value={hours} onChange={(e)=>setHours(e.target.value)} /></Field>
        <div className="flex items-center gap-3"><span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Published</span><Switch checked={row?.published ?? true} onChange={(v)=>setRow(prev=>prev?{...prev, published:v}:prev)} /></div>
      </div>
    </div>
  )
}

