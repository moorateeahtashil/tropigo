'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, UserCircle, LogOut, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { CurrencySwitcher } from '@/components/pricing/CurrencySwitcher'
import { getBrowserSupabase } from '@/lib/supabase/browser'

const NAV_LINKS = [
  { href: '/transfers', label: 'Transfers' },
  { href: '/trips', label: 'Trips' },
  { href: '/packages', label: 'Packages' },
]

function AccountButton({ scrolled, isHomepage }: { scrolled: boolean; isHomepage: boolean }) {
  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const supabase = getBrowserSupabase()
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    const supabase = getBrowserSupabase()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const textClass = scrolled || !isHomepage ? 'text-ink-secondary hover:bg-sand-100' : 'text-white hover:bg-white/10'
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : null

  if (!user) {
    return (
      <Link href="/account/login"
        className={cn('flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors', textClass)}>
        <UserCircle className="h-5 w-5" />
        <span className="hidden lg:inline">Sign In</span>
      </Link>
    )
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={cn('flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors', textClass)}>
        <div className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
          scrolled || !isHomepage ? 'bg-brand-100 text-brand-700' : 'bg-white/20 text-white',
        )}>
          {initials || <UserCircle className="h-4 w-4" />}
        </div>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-sand-200 bg-white py-1 shadow-lg">
            <div className="border-b border-sand-100 px-4 py-2.5">
              <p className="text-xs font-medium text-ink-muted">Signed in as</p>
              <p className="truncate text-sm font-semibold text-ink">{user.user_metadata?.full_name || user.email}</p>
            </div>
            <Link href="/account" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-secondary hover:bg-sand-50 hover:text-ink">
              <BookOpen className="h-4 w-4" />My Bookings
            </Link>
            <Link href="/account?tab=profile" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-secondary hover:bg-sand-50 hover:text-ink">
              <UserCircle className="h-4 w-4" />Profile
            </Link>
            <button onClick={signOut}
              className="flex w-full items-center gap-2.5 border-t border-sand-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" />Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

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
          <div className="hidden md:flex items-center gap-2">
            <AccountButton scrolled={scrolled} isHomepage={isHomepage} />
            <CartIcon scrolled={scrolled} isHomepage={isHomepage} />
            <CurrencySwitcher variant="select" className="text-xs" />
            <Button
              variant={scrolled || !isHomepage ? 'primary' : 'secondary'}
              size="sm"
              asChild
              className="rounded-full font-label text-xs uppercase tracking-widest"
            >
              <Link href="/trips">Book Now</Link>
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
            <Link href="/account"
              className="flex items-center gap-2 rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-secondary hover:bg-sand-50">
              <UserCircle className="h-4 w-4" />My Account
            </Link>
            <Button asChild size="md" className="w-full">
              <Link href="/trips">Book a Trip</Link>
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
