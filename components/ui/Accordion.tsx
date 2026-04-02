"use client"

import { useState } from 'react'

export default function Accordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="divide-y divide-outline-variant/20 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
      {items.map((it, idx) => (
        <div key={idx}>
          <button
            type="button"
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <span className="font-semibold text-primary">{it.title}</span>
            <span className="text-outline">{open === idx ? '−' : '+'}</span>
          </button>
          {open === idx && <div className="px-5 pb-5 text-sm text-on-surface-variant">{it.content}</div>}
        </div>
      ))}
    </div>
  )
}

