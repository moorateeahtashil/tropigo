export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm">{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-4 border-b border-outline-variant/10">{children}</div>
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="p-5">{children}</div>
}

