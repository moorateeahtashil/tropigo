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
      <div style={{ minHeight: '100dvh', background: 'var(--a-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--a-text-faint)', fontSize: '0.875rem', fontFamily: 'var(--font-body, Sora, sans-serif)' }}>
          <svg width="16" height="16" style={{ animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" style={{ opacity: 0.25 }} />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" style={{ opacity: 0.75 }} />
          </svg>
          Checking access…
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return <AdminShell>{children}</AdminShell>
}
