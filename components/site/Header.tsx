"use client"

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fbf9f4]/90 backdrop-blur-md border-b border-outline-variant/20">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 w-full">
        <Link href="/" className="font-headline text-xl font-bold tracking-[0.2em] text-[#001e40]">
          TROPIGO
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <HeaderLink href="#">Villas</HeaderLink>
          <HeaderLink href="#">Experiences</HeaderLink>
          <HeaderLink href="#">Journeys</HeaderLink>
          <HeaderLink href="#">About</HeaderLink>
        </div>
        <div className="md:hidden">
          <button className="px-3 py-2 border border-outline-variant rounded-lg" onClick={() => setOpen(!open)}>
            Menu
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-2">
          <MobileLink href="#">Villas</MobileLink>
          <MobileLink href="#">Experiences</MobileLink>
          <MobileLink href="#">Journeys</MobileLink>
          <MobileLink href="#">About</MobileLink>
        </div>
      )}
    </nav>
  )
}

function HeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-xs tracking-widest uppercase text-primary hover:text-secondary transition-colors">
      {children}
    </Link>
  )
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="py-2 text-sm tracking-widest uppercase text-primary">
      {children}
    </Link>
  )
}
