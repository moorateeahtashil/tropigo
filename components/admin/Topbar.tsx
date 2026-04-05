"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getSupabaseClient } from '@/supabase/client'

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// Build readable breadcrumb from pathname
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
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const e = user.email || ''
      setEmail(e)
      setInitials(e.charAt(0).toUpperCase())
    })
  }, [])

  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-5 shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm min-w-0">
        {breadcrumb.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronIcon />}
            {i === breadcrumb.length - 1 ? (
              <span className="text-zinc-100 font-semibold truncate">{title || crumb.label}</span>
            ) : (
              <a href={crumb.href} className="text-zinc-500 hover:text-zinc-300 transition-colors truncate">
                {crumb.label}
              </a>
            )}
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search */}
        <div className="relative hidden lg:block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Quick search…"
            className="pl-9 pr-4 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 w-52"
          />
        </div>

        {/* Bell */}
        <button className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
          <BellIcon />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-800" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-zinc-200 leading-none">{email || 'Admin'}</p>
            <p className="text-[10px] text-sky-400 font-medium mt-0.5">Super Admin</p>
          </div>
        </div>

        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View site
        </a>
      </div>
    </header>
  )
}
