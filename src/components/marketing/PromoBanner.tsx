import Link from 'next/link'
import { getActivePromoBanners } from '@/features/content/queries'
import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'

interface PromoBannerProps {
  placement?: 'sitewide_top' | 'homepage_hero' | 'footer' | 'inline'
  className?: string
}

export async function PromoBanner({ placement = 'sitewide_top', className }: PromoBannerProps) {
  const banners = await getActivePromoBanners(placement)

  if (banners.length === 0) return null

  // Show only the highest priority banner
  const banner = banners[0]

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        className,
      )}
      style={{
        backgroundColor: banner.background_color || '#0f766e',
        color: banner.text_color || '#ffffff',
      }}
      data-promo-banner={banner.id}
    >
      <div className="container-page flex items-center justify-center gap-4 py-3 text-center text-sm sm:justify-between sm:text-left">
        <div className="flex-1">
          {banner.title && (
            <span className="font-semibold">{banner.title}</span>
          )}
          {banner.body && (
            <span className="ml-2 opacity-90">{banner.body}</span>
          )}
        </div>
        {banner.cta_label && banner.cta_url && (
          <Link
            href={banner.cta_url}
            className="flex-shrink-0 rounded-full bg-white px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/90"
            style={{
              color: banner.background_color || '#0f766e',
            }}
          >
            {banner.cta_label}
          </Link>
        )}
      </div>
    </div>
  )
}

// Client component with dismiss functionality
'use client'

import { useState } from 'react'

export function DismissablePromoBanner({
  banner,
  className,
}: {
  banner: {
    id: string
    title: string
    body: string | null
    cta_label: string | null
    cta_url: string | null
    background_color: string
    text_color: string
  }
  className?: string
}) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        backgroundColor: banner.background_color || '#0f766e',
        color: banner.text_color || '#ffffff',
      }}
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-white/20"
        aria-label="Dismiss promotion"
        style={{ color: banner.text_color || '#ffffff' }}
      >
        <X className="h-4 w-4" />
      </button>
      <div className="container-page flex items-center justify-center gap-4 py-3 pr-10 text-center text-sm sm:justify-between sm:text-left">
        <div className="flex-1">
          {banner.title && (
            <span className="font-semibold">{banner.title}</span>
          )}
          {banner.body && (
            <span className="ml-2 opacity-90">{banner.body}</span>
          )}
        </div>
        {banner.cta_label && banner.cta_url && (
          <Link
            href={banner.cta_url}
            className="flex-shrink-0 rounded-full bg-white px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/90"
            style={{
              color: banner.background_color || '#0f766e',
            }}
          >
            {banner.cta_label}
          </Link>
        )}
      </div>
    </div>
  )
}
