"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getSupabaseClient } from '@/supabase/client'

function Icon({ d, className = 'nav-icon' }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const icons: Record<string, string> = {
  dashboard:    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  destinations: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  activities:   'M13 10V3L4 14h7v7l9-11h-7z',
  tours:        'M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 10v11M16 10v11M12 10v11',
  availability: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  bookings:     'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  enquiries:    'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  customers:    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  homepage:     'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
  blog:         'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  pages:        'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  navigation:   'M4 6h16M4 12h16M4 18h16',
  footer:       'M4 6h16M4 10h16M4 14h16M4 18h16',
  promos:       'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  coupons:      'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  testimonials: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  faqs:         'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  legal:        'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  settings:     'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  users:        'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  contact:      'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  signout:      'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
}

const groups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { href: '/admin/destinations', label: 'Destinations', icon: 'destinations' },
      { href: '/admin/activities',   label: 'Activities',   icon: 'activities'   },
      { href: '/admin/tours',        label: 'Tours',        icon: 'tours'        },
      { href: '/admin/availability', label: 'Availability', icon: 'availability' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/admin/bookings',  label: 'Bookings',  icon: 'bookings'  },
      { href: '/admin/enquiries', label: 'Enquiries', icon: 'enquiries' },
      { href: '/admin/customers', label: 'Customers', icon: 'customers' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/homepage',     label: 'Homepage',   icon: 'homepage'   },
      { href: '/admin/blog',         label: 'Blog',       icon: 'blog'       },
      { href: '/admin/static-pages', label: 'Pages',      icon: 'pages'      },
      { href: '/admin/navigation',   label: 'Navigation', icon: 'navigation' },
      { href: '/admin/footer',       label: 'Footer',     icon: 'footer'     },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { href: '/admin/promos',       label: 'Promotions',   icon: 'promos'       },
      { href: '/admin/coupons',      label: 'Coupons',      icon: 'coupons'      },
      { href: '/admin/testimonials', label: 'Testimonials', icon: 'testimonials' },
    ],
  },
  {
    label: 'Configure',
    items: [
      { href: '/admin/faqs',     label: 'FAQs',     icon: 'faqs'     },
      { href: '/admin/legal',    label: 'Legal',    icon: 'legal'    },
      { href: '/admin/contact',  label: 'Contact',  icon: 'contact'  },
      { href: '/admin/settings', label: 'Settings', icon: 'settings' },
      { href: '/admin/users',    label: 'Users',    icon: 'users'    },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const supabase = getSupabaseClient()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <aside className="admin-sidebar hidden md:flex">
      {/* Brand */}
      <div className="admin-brand">
        <div className="admin-brand-mark">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v1m0 16v1M4.22 4.22l.71.71m13.65 13.65.71.71M3 12H4m16 0h1M4.22 19.78l.71-.71M18.36 5.64l.71-.71" />
          </svg>
        </div>
        <div>
          <p className="admin-brand-text">Tropigo</p>
          <p className="admin-brand-sub">Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">
        {groups.map((group) => (
          <div key={group.label} className="admin-nav-section">
            <span className="admin-nav-label">{group.label}</span>
            {group.items.map((item) => {
              const active = isActive(item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link${active ? ' active' : ''}`}
                >
                  <Icon d={icons[item.icon]} />
                  <span>{item.label}</span>
                  {active && <span className="admin-nav-dot" />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="admin-signout">
        <button onClick={signOut} className="admin-signout-btn">
          <Icon d={icons.signout} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}
