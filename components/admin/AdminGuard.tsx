"use client"

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseClient()
  const [ok, setOk] = useState<boolean | null>(null)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/account/login'; return }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
      if (data?.is_admin) setOk(true)
      else { setOk(false); window.location.href = '/'; }
    })()
  }, [])

  if (ok === null) return <div className="p-8 text-center text-outline">Checking access…</div>
  if (!ok) return null
  return <>{children}</>
}

