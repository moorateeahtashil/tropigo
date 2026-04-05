"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getSupabaseClient } from '@/supabase/client'

function useBreadcrumb(pathname: string) {
  const parts = pathname.replace('/admin', '').split('/').filter(Boolean)
  if (parts.length === 0) return [{ label: 'Dashboard', href: '/admin' }]
  return [
    { label: 'Admin', href: '/admin' },
    ...parts.map((p, i) => ({
      label: p.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      href: '/admin/' + parts.slice(0, i + 1).join('/'),
    })),
  ]
}

export default function Topbar({ title }: { title?: string }) {
  const supabase = getSupabaseClient()
  const pathname = usePathname()
  const breadcrumb = useBreadcrumb(pathname)
  const [email, setEmail] = useState<string | null>(null)
  const [initials, setInitials] = useState('A')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const e = session?.user?.email || ''
      if (!e) return
      setEmail(e)
      setInitials(e.charAt(0).toUpperCase())
    })
  }, [])

  return (
    <header className="admin-topbar">
      {/* Breadcrumb */}
      <nav className="admin-breadcrumb">
        {breadcrumb.map((crumb, i) => (
          <span key={crumb.href} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            {i > 0 && (
              <span className="admin-breadcrumb-sep">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </span>
            )}
            {i === breadcrumb.length - 1 ? (
              <span className="admin-breadcrumb-current">{title || crumb.label}</span>
            ) : (
              <a href={crumb.href}>{crumb.label}</a>
            )}
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div className="admin-topbar-actions">
        {/* Search */}
        <div className="admin-search">
          <svg className="admin-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Quick search…" />
        </div>

        {/* Notifications */}
        <button className="admin-icon-btn" aria-label="Notifications">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <div className="admin-topbar-divider" />

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="admin-avatar">{initials}</div>
          <div className="admin-user-info">
            <span className="admin-user-email">{email || 'Admin'}</span>
            <span className="admin-user-role">Super Admin</span>
          </div>
        </div>

        {/* View site */}
        <a href="/" target="_blank" rel="noopener" className="admin-view-site">
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View site
        </a>
      </div>
    </header>
  )
}
