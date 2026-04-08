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
    <footer className="border-t border-outline-variant/20 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="font-headline text-3xl font-light text-primary">TROPIGO</p>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-on-surface-variant">
              Defining the pinnacle of tropical luxury for the discerning traveler. Our concierge team is available around the clock to ensure your stay is nothing short of extraordinary.
            </p>
            <div className="mt-8 flex gap-6">
              <a
                href="https://instagram.com/tropigo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary transition-colors hover:text-secondary"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/tropigo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary transition-colors hover:text-secondary"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="mailto:hello@tropigo.mu"
                className="text-primary transition-colors hover:text-secondary"
                aria-label="Email"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="mb-6 font-label text-[11px] font-bold uppercase tracking-widest text-primary">
              Explore
            </p>
            <ul className="space-y-4">
              {FOOTER_LINKS.Services.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-label text-xs tracking-wider text-primary/70 transition-all duration-200 hover:text-tertiary hover:underline hover:underline-offset-4 hover:translate-x-1 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-6 font-label text-[11px] font-bold uppercase tracking-widest text-primary">
              Concierge
            </p>
            <ul className="space-y-4">
              {FOOTER_LINKS.Support.concat(FOOTER_LINKS.Legal).map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-label text-xs tracking-wider text-primary/70 transition-all duration-200 hover:text-tertiary hover:underline hover:underline-offset-4 hover:translate-x-1 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-sand-100 pt-8">
          <div className="rounded-2xl bg-surface-container-low p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div>
                <h3 className="text-lg font-semibold text-ink">Get Exclusive Travel Inspiration</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Subscribe for special offers, insider guides, and Mauritius travel tips.
                </p>
              </div>
              <div>
                <NewsletterSignup variant="inline" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-sand-100 pt-8 sm:flex-row">
          <p className="text-sm text-on-surface-variant">
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
