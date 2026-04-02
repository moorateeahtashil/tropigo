import Link from 'next/link'
import { fetchNavigation, fetchSiteSettings } from '@/lib/server/settings'

export default async function Header() {
  const [settings, nav] = await Promise.all([fetchSiteSettings(), fetchNavigation('main')])
  const brand = settings?.brand_name || 'Tropigo'
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fbf9f4]/90 backdrop-blur-md border-b border-outline-variant/20">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 w-full">
        <Link href="/" className="font-headline text-xl font-bold tracking-[0.2em] text-[#001e40]">
          {brand.toUpperCase()}
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {nav.map((item) => (
            <Link key={item.id} href={item.href} className="text-xs tracking-widest uppercase text-primary hover:text-secondary transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
