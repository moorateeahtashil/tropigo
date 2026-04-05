export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`admin-card${className ? ' ' + className : ''}`}>{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="admin-card-header">{children}</div>
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="admin-card-body">{children}</div>
}

