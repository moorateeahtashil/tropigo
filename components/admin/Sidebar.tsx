"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/homepage', label: 'Homepage', icon: '🏠' },
  { href: '/admin/navigation', label: 'Navigation', icon: '🧭' },
  { href: '/admin/footer', label: 'Footer', icon: '🦶' },
  { href: '/admin/destinations', label: 'Destinations', icon: '🗺️' },
  { href: '/admin/activities', label: 'Activities', icon: '🏄' },
  { href: '/admin/tours', label: 'Tours', icon: '🛶' },
  { href: '/admin/availability', label: 'Availability', icon: '📅' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
  { href: '/admin/faqs', label: 'FAQs', icon: '❓' },
  { href: '/admin/legal', label: 'Legal', icon: '⚖️' },
  { href: '/admin/promos', label: 'Promos', icon: '🏷️' },
  { href: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
  { href: '/admin/contact', label: 'Contact', icon: '☎️' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { href: '/admin/bookings', label: 'Bookings', icon: '🧾' },
  { href: '/admin/users', label: 'Users', icon: '👤' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex h-dvh w-64 border-r border-outline-variant/30 bg-surface flex-col p-4 space-y-2 shrink-0 sticky top-0">
      <div className="mb-6 px-2">
        <h1 className="font-headline font-bold text-primary text-xl">Tropigo Admin</h1>
        <p className="font-label text-xs tracking-widest text-primary/70 uppercase">Content & Bookings</p>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ' +
                (active
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'text-primary/70 hover:bg-primary/5')
              }
            >
              <span aria-hidden>{item.icon}</span>
              <span className="font-label text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="pt-2 border-t border-outline-variant/20 text-xs text-outline">
        © {new Date().getFullYear()}
      </div>
    </aside>
  )
}
