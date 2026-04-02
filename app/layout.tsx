import type { Metadata } from 'next'
import './globals.css'
import { EB_Garamond, Sora } from 'next/font/google'

const headline = EB_Garamond({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-headline' })
const body = Sora({ subsets: ['latin'], weight: ['300','400','600'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'Tropigo | Mauritius Travel',
  description: 'Curated villas and experiences in Mauritius',
  metadataBase: new URL('https://example.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className={`${headline.variable} ${body.variable} bg-background text-on-surface`}>
        {children}
      </body>
    </html>
  )
}

