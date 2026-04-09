'use client'

import { useEffect, useState } from 'react'

export function IslandLoader() {
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + Math.random() * 20 + 5
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8">
        {/* Spinning loader */}
        <div className="relative h-20 w-20">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-outline-variant/20" />
          
          {/* Spinning primary ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin"
            style={{ animationDuration: '1s' }}
          />
          
          {/* Inner spinning ring (reverse) */}
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-secondary border-l-secondary animate-spin"
            style={{
              animationDuration: '1.5s',
              animationDirection: 'reverse',
            }}
          />
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="font-headline text-2xl font-semibold text-primary">
            Tropigo
          </h2>
          <p className="mt-2 font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
            Loading...
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-48 overflow-hidden rounded-full bg-outline-variant/20">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
