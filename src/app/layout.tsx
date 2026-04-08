import type { Metadata } from 'next'
import { Sora, EB_Garamond } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})


export const metadata: Metadata = {
  title: {
    default: 'Tropigo — Mauritius Tours, Transfers & Experiences',
    template: '%s | Tropigo',
  },
  description:
    'Discover the best of Mauritius with Tropigo. Book private airport transfers, island day trips, activities, and curated holiday packages.',
  keywords: ['Mauritius', 'tours', 'airport transfer', 'activities', 'holidays', 'Île aux Cerfs'],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
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
    <html lang="en" className={`${sora.variable} ${ebGaramond.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
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
