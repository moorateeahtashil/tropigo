export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary">{title}</h1>
        {subtitle && <p className="text-sm text-outline mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

