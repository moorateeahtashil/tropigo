'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard, MapPin, Package, Car, DollarSign,
  Calendar, Star, BookOpen, MessageSquare, Home, Menu,
  Users, FileText, HelpCircle, Gift, Settings,
  ChevronDown, ChevronRight, Globe, UserCheck, Route, Shield,
  LogOut, ChevronUp, ChevronDown as ChevronDownIcon,
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
      { href: '/admin/trips', label: 'Trips', icon: <Route className="h-4 w-4" /> },
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
      { href: '/admin/users', label: 'Users', icon: <Shield className="h-4 w-4" /> },
      { href: '/admin/enquiries', label: 'Enquiries', icon: <MessageSquare className="h-4 w-4" /> },
      { href: '/admin/pricing', label: 'Pricing', icon: <DollarSign className="h-4 w-4" /> },
      { href: '/admin/reviews', label: 'Reviews', icon: <Star className="h-4 w-4" /> },
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
            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
          )}
        >
          <span className="flex items-center gap-2.5">
            {item.icon}
            {item.label}
          </span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDownIcon className="h-3.5 w-3.5" />}
        </button>
        {expanded && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-200 pl-4">
            {item.children.map(child => (
              <NavLink key={child.href || child.label} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const isActive = item.href && (
    item.href === '/admin'
      ? pathname === '/admin'
      : pathname.startsWith(item.href)
  )

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      )}
    >
      {item.icon}
      {item.label}
      {item.badge && (
        <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-5">
        <Link href="/admin" className="text-lg font-bold text-gray-900">
          <span className="text-indigo-600">Tropigo</span>
          <span className="ml-1 text-xs font-normal text-gray-400">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.href || item.label} item={item} />
        ))}
      </nav>

      {/* Back to site */}
      <div className="border-t border-gray-200 p-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" />
          Back to Website
        </Link>
      </div>
    </aside>
  )
}
