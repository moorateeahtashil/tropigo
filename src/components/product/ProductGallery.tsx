'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface MediaItem {
  url: string
  alt?: string | null
  is_cover?: boolean
  media_type?: string
}

interface ProductGalleryProps {
  media: MediaItem[]
  title?: string
  className?: string
}

export function ProductGallery({ media, title, className }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  if (!media || media.length === 0) return null

  const mainImage = media[selectedIndex] || media[0]

  function handlePrev() {
    setSelectedIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
  }

  function handleNext() {
    setSelectedIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
  }

  function openLightbox(index: number) {
    setSelectedIndex(index)
    setIsLightboxOpen(true)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Main image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-sand-100">
        <Image
          src={mainImage.url}
          alt={mainImage.alt || title || ''}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Navigation arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Expand button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white"
          aria-label="Expand image"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Image counter */}
        {media.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
            {selectedIndex + 1} / {media.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-sand-100 transition-all',
                selectedIndex === index ? 'ring-2 ring-brand-500 ring-offset-2' : 'opacity-70 hover:opacity-100',
              )}
            >
              <Image
                src={item.url}
                alt={item.alt || ''}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image */}
          <div className="relative h-[80vh] w-[90vw]">
            <Image
              src={mainImage.url}
              alt={mainImage.alt || title || ''}
              fill
              className="object-contain"
            />
          </div>

          {/* Navigation */}
          {media.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-sm text-white">
            {selectedIndex + 1} / {media.length}
          </div>
        </div>
      )}
    </div>
  )
}
