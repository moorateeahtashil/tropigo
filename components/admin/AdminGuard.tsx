"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getSupabaseClient } from '@/supabase/client'
import AdminShell from '@/components/admin/Shell'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseClient()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [status, setStatus] = useState<'loading' | 'authed' | 'denied'>('loading')

  // All hooks must be called before any conditional return
  useEffect(() => {
    if (isLoginPage) return
    ;(async () => {
      // getSession() reads from localStorage — no network request, no conflict
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.replace('/admin/login'); return }

      const isAdmin = session.user.app_metadata?.is_admin === true || session.user.app_metadata?.is_admin === 'true'
      if (isAdmin) {
        setStatus('authed')
      } else {
        await supabase.auth.signOut()
        window.location.replace('/admin/login')
      }
    })()
  }, [isLoginPage])

  // Login page: render with no shell, no auth check
  if (isLoginPage) return <>{children}</>

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
