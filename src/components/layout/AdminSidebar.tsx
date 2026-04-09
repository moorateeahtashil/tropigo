'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard, MapPin, Waves, Package, Car, DollarSign,
  Calendar, Star, BookOpen, MessageSquare, Home, Menu,
  Link2, Users, FileText, HelpCircle, Gift, Settings,
  ChevronDown, ChevronRight, Globe, UserCheck,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  href?: string
  label: string
  icon: React.ReactNode
  children?: NavItem[]
  badge?: string | number
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  {
    label: 'Catalog',
    icon: <Globe className="h-4 w-4" />,
    children: [
      { href: '/admin/activities', label: 'Activities', icon: <Waves className="h-4 w-4" /> },
      { href: '/admin/transfers', label: 'Transfers', icon: <Car className="h-4 w-4" /> },
      { href: '/admin/packages', label: 'Packages', icon: <Package className="h-4 w-4" /> },
      { href: '/admin/destinations', label: 'Destinations', icon: <MapPin className="h-4 w-4" /> },
      { href: '/admin/drivers', label: 'Drivers', icon: <UserCheck className="h-4 w-4" /> },
      { href: '/admin/availability', label: 'Availability', icon: <Calendar className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Commerce',
    icon: <BookOpen className="h-4 w-4" />,
    children: [
      { href: '/admin/bookings', label: 'Bookings', icon: <BookOpen className="h-4 w-4" /> },
      { href: '/admin/customers', label: 'Customers', icon: <Users className="h-4 w-4" /> },
      { href: '/admin/enquiries', label: 'Enquiries', icon: <MessageSquare className="h-4 w-4" /> },
      { href: '/admin/pricing', label: 'Pricing & Currencies', icon: <DollarSign className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Content',
    icon: <Home className="h-4 w-4" />,
    children: [
      { href: '/admin/content/homepage', label: 'Homepage', icon: <Home className="h-4 w-4" /> },
      { href: '/admin/content/faqs', label: 'FAQs', icon: <HelpCircle className="h-4 w-4" /> },
      { href: '/admin/content/testimonials', label: 'Testimonials', icon: <Star className="h-4 w-4" /> },
      { href: '/admin/content/promos', label: 'Promos', icon: <Gift className="h-4 w-4" /> },
      { href: '/admin/content/legal', label: 'Legal Pages', icon: <FileText className="h-4 w-4" /> },
      { href: '/admin/content/pages', label: 'Static Pages', icon: <FileText className="h-4 w-4" /> },
      { href: '/admin/navigation', label: 'Navigation', icon: <Menu className="h-4 w-4" /> },
    ],
  },
  { href: '/admin/reviews', label: 'Reviews', icon: <Star className="h-4 w-4" /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
]

function NavLink({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(() => {
    if (!item.children) return false
    return item.children.some(child => child.href && pathname.startsWith(child.href))
  })

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setExpanded(prev => !prev)}
          className={cn(
            'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors',
            'text-ink-muted hover:bg-sand-50 hover:text-ink',
          )}
        >
          <span className="flex items-center gap-2.5">
            <span className="opacity-60">{item.icon}</span>
            {item.label}
          </span>
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          )}
        </button>
        {expanded && (
          <div className="ml-3 mt-0.5 border-l border-sand-200 pl-3 space-y-0.5">
            {item.children.map(child => (
              <NavLink key={child.href ?? child.label} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const isActive = item.href === '/admin'
    ? pathname === '/admin'
    : item.href && pathname.startsWith(item.href)

  return (
    <Link
      href={item.href!}
      className={cn(
        'flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-brand-50 text-brand-700'
          : 'text-ink-muted hover:bg-sand-50 hover:text-ink',
      )}
    >
      <span className="flex items-center gap-2.5">
        <span className={cn(isActive ? 'text-brand-600' : 'opacity-60')}>
          {item.icon}
        </span>
        {item.label}
      </span>
      {item.badge != null && (
        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function AdminSidebar() {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-sand-200 bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-sand-200 px-4">
        <Link href="/admin" className="text-lg font-bold text-brand-950">
          <span className="font-serif italic">Tropi</span>go{' '}
          <span className="text-xs font-normal text-ink-muted">Admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.href ?? item.label} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sand-200 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-ink-muted hover:bg-sand-50 hover:text-ink transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          View public site
        </Link>
      </div>
    </aside>
  )
}
