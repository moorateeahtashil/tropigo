import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})


export const metadata: Metadata = {
  title: {
    default: 'Tropigo — Mauritius Tours, Transfers & Experiences',
    template: '%s | Tropigo',
  },
  description:
    'Discover the best of Mauritius with Tropigo. Book private airport transfers, island day trips, activities, and curated holiday packages.',
  keywords: ['Mauritius', 'tours', 'airport transfer', 'activities', 'holidays', 'Île aux Cerfs'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tropigo.mu',
    siteName: 'Tropigo',
    title: 'Tropigo — Discover Mauritius, Your Way',
    description: 'Premium Mauritius experiences: airport transfers, island activities, and curated packages.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Tropigo — Mauritius' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tropigo — Mauritius Tours & Transfers',
    description: 'Premium Mauritius experiences.',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tropigo.mu'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable}`}>
      <body className="min-h-screen bg-sand-50 font-sans antialiased">
        {children}
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            classNames: {
              toast: 'font-sans rounded-xl shadow-elevated',
            },
          }}
        />
      </body>
    </html>
  )
}
