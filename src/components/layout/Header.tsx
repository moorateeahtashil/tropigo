'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { CurrencySwitcher } from '@/components/pricing/CurrencySwitcher'

const NAV_LINKS = [
  { href: '/transfers', label: 'Transfers' },
  { href: '/activities', label: 'Activities' },
  { href: '/packages', label: 'Packages' },
  { href: '/destinations', label: 'Destinations' },
]

function CartIcon({ scrolled, isHomepage }: { scrolled: boolean; isHomepage: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const res = await fetch('/api/booking/cart')
        const json = await res.json()
        const items = json.items || []
        setCount(items.reduce((sum: number, i: any) => sum + i.quantity, 0))
      } catch {
        // Silently fail
      }
    }
    loadCartCount()

    // Listen for cart changes
    const handler = () => loadCartCount()
    window.addEventListener('cart-change', handler)
    return () => window.removeEventListener('cart-change', handler)
  }, [])

  return (
    <Link
      href="/cart"
      className={cn(
        'relative rounded-lg p-2 transition-colors',
        scrolled || !isHomepage
          ? 'text-ink-secondary hover:bg-sand-100'
          : 'text-white hover:bg-white/10',
      )}
      aria-label="View cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  )
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isHomepage = pathname === '/'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || !isHomepage
          ? 'bg-white/95 backdrop-blur-md border-b border-sand-200 shadow-sm'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'font-headline text-xl font-bold tracking-[0.2em] transition-colors',
              scrolled || !isHomepage ? 'text-primary' : 'text-white',
            )}
          >
            TROPIGO
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  pathname.startsWith(link.href)
                    ? scrolled || !isHomepage
                      ? 'bg-brand-50 text-brand-700'
                      : 'bg-white/20 text-white'
                    : scrolled || !isHomepage
                    ? 'text-ink-secondary hover:bg-sand-50 hover:text-ink'
                    : 'text-white/80 hover:bg-white/10 hover:text-white',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <CartIcon scrolled={scrolled} isHomepage={isHomepage} />
            <CurrencySwitcher variant="select" className="text-xs" />
            <Button
              variant={scrolled || !isHomepage ? 'primary' : 'secondary'}
              size="sm"
              asChild
              className="rounded-full font-label text-xs uppercase tracking-widest"
            >
              <Link href="/transfers">Book Now</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(prev => !prev)}
            className={cn(
              'md:hidden rounded-lg p-2 transition-colors',
              scrolled || !isHomepage
                ? 'text-ink-secondary hover:bg-sand-100'
                : 'text-white hover:bg-white/10',
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-sand-200 bg-white px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  pathname.startsWith(link.href)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-secondary hover:bg-sand-50 hover:text-ink',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-sand-100 pt-4">
            <div className="flex items-center gap-3">
              <CartIcon scrolled={false} isHomepage={false} />
              <CurrencySwitcher variant="pill" />
            </div>
            <Button asChild size="md" className="w-full">
              <Link href="/transfers">Book Airport Transfer</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

// Extend button to accept asChild
declare module '@/components/ui/button' {
  interface ButtonProps {
    asChild?: boolean
  }
}
