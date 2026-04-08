import Link from 'next/link'
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup'

const FOOTER_LINKS = {
  Services: [
    { href: '/transfers', label: 'Airport Transfers' },
    { href: '/activities', label: 'Activities & Trips' },
    { href: '/packages', label: 'Holiday Packages' },
    { href: '/destinations', label: 'Destinations' },
  ],
  Support: [
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/enquiry', label: 'Enquiry Form' },
  ],
  Legal: [
    { href: '/legal/terms-and-conditions', label: 'Terms & Conditions' },
    { href: '/legal/privacy-policy', label: 'Privacy Policy' },
    { href: '/about', label: 'About Tropigo' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-sand-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-brand-950">
              <span className="font-serif italic">Tropi</span>go
            </div>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed">
              Premium Mauritius experiences — airport transfers, island activities, and curated holiday packages.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com/tropigo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-sand-200 text-ink-muted transition-colors hover:border-brand-200 hover:text-brand-600"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/tropigo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-sand-200 text-ink-muted transition-colors hover:border-brand-200 hover:text-brand-600"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 text-sm font-semibold text-ink">{group}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-10 border-t border-sand-100 pt-8">
          <div className="rounded-2xl bg-sand-50 p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div>
                <h3 className="text-lg font-semibold text-ink">Get Exclusive Deals & Travel Inspiration</h3>
                <p className="mt-1 text-sm text-ink-secondary">
                  Subscribe to our newsletter for special offers, insider guides, and Mauritius travel tips.
                </p>
              </div>
              <div>
                <NewsletterSignup variant="inline" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-sand-100 pt-8 sm:flex-row">
          <p className="text-sm text-ink-muted">
            © {new Date().getFullYear()} Tropigo. All rights reserved. Mauritius.
          </p>
          <p className="text-xs text-ink-faint">
            Licensed tour operator · hello@tropigo.mu
          </p>
        </div>
      </div>
    </footer>
  )
}
