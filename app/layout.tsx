import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tropigo | Mauritius Travel',
  description: 'Curated villas and experiences in Mauritius',
  metadataBase: new URL('https://example.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className={`bg-background text-on-surface font-body`}>
        {children}
      </body>
    </html>
  )
}
