"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getSupabaseClient } from '@/supabase/client'
import AdminShell from '@/components/admin/Shell'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseClient()
  const pathname = usePathname()
  const [status, setStatus] = useState<'loading' | 'authed' | 'denied'>('loading')

  // Login page: render with no shell, no auth check
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/admin/login'; return }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
      if (data?.is_admin) {
        setStatus('authed')
      } else {
        await supabase.auth.signOut()
        window.location.href = '/admin/login'
      }
    })()
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-dvh bg-zinc-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500 text-sm">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Checking access…
        </div>
      </div>
    )
  }

  return <AdminShell>{children}</AdminShell>
}
