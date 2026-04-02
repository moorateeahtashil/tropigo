"use client"

import Section from '@/components/ui/Section'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Button from '@/components/ui/Button'
import { getSupabaseClient } from '@/supabase/client'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const supabase = getSupabaseClient()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => { (async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setEmail(user.email || '')
    const { data } = await supabase.from('profiles').select('*').eq('id', user?.id || '').maybeSingle()
    if (data) {
      setFullName(data.full_name || '')
      setPhone(data.phone || '')
      setCountry(data.country || '')
    }
    setReady(true)
  })() }, [])

  async function save() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/account/login'; return }
    await supabase.from('profiles').upsert({ id: user.id, full_name: fullName, phone, country })
    alert('Saved')
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-outline-variant/10 p-6">
            <h1 className="font-headline text-2xl text-primary mb-4">Profile</h1>
            {!ready ? (
              <div className="text-sm text-outline">Loading…</div>
            ) : (
              <div className="space-y-3">
                <input value={email} disabled className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 text-sm" />
                <input value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Full name" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" />
                <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" />
                <input value={country} onChange={(e)=>setCountry(e.target.value)} placeholder="Country" className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm" />
                <Button className="w-full" onClick={save}>Save</Button>
                <a
                  href="#"
                  className="text-sm underline text-outline block text-center"
                  onClick={async (e)=>{ e.preventDefault(); await supabase.auth.signOut(); window.location.href='/'; }}
                >Sign out</a>
              </div>
            )}
          </div>
        </Section>
      </main>
      {/* @ts-expect-error Async Server Component */}
      <Footer />
    </div>
  )
}

