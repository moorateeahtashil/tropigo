import Link from 'next/link'
import { getSettings } from '@/features/content/queries'
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup'

const FOOTER_LINKS = {
  Services: [
    { href: '/transfers', label: 'Airport Transfers' },
    { href: '/trips', label: 'Guided Trips' },
    { href: '/packages', label: 'Holiday Packages' },
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

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    facebook: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    twitter: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    tripadvisor: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
  }
  return <>{icons[name] || null}</>
}

export async function Footer() {
  const settings = await getSettings()
  const socials = (settings as any)?.socials || {}
  const brandName = (settings as any)?.brand_name || 'Tropigo'
  const tagline = (settings as any)?.tagline || 'Discover Mauritius, Your Way'
  const contactEmail = (settings as any)?.contact_email || 'hello@tropigo.mu'
  const contactPhone = (settings as any)?.contact_phone || ''
  const address = (settings as any)?.address || {}

  const socialLinks = [
    { name: 'instagram', href: socials.instagram, label: 'Instagram' },
    { name: 'facebook', href: socials.facebook, label: 'Facebook' },
    { name: 'twitter', href: socials.twitter, label: 'Twitter' },
    { name: 'tripadvisor', href: socials.tripadvisor, label: 'TripAdvisor' },
  ].filter(s => s.href)

  return (
    <footer className="border-t border-outline-variant/20 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="font-headline text-3xl font-light text-primary">{brandName.toUpperCase()}</p>
            <p className="mt-3 text-sm text-on-surface-variant">{tagline}</p>

            {/* Address */}
            {address.street && (
              <address className="mt-4 not-italic text-sm text-on-surface-variant">
                {[address.street, address.city, address.region, address.country].filter(Boolean).join(', ')}
              </address>
            )}

            {/* Contact */}
            {(contactEmail || contactPhone) && (
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
                {contactEmail && (
                  <a href={`mailto:${contactEmail}`} className="hover:text-tertiary transition-colors">
                    {contactEmail}
                  </a>
                )}
                {contactPhone && (
                  <a href={`tel:${contactPhone}`} className="hover:text-tertiary transition-colors">
                    {contactPhone}
                  </a>
                )}
              </div>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex gap-6">
                {socialLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary transition-colors hover:text-secondary"
                    aria-label={link.label}
                  >
                    <SocialIcon name={link.name} />
                  </a>
                ))}
              </div>
            )}
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
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <p className="text-xs text-ink-faint">
            Licensed tour operator{contactEmail ? ` · ${contactEmail}` : ''}
          </p>
        </div>
      </div>
    </footer>
  )
}
