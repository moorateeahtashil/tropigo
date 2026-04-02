export default function Section({ title, children, actions }: { title?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="space-y-3 mb-8">
      {(title || actions) && (
        <div className="flex items-center justify-between">
          {title && <h3 className="font-headline text-lg text-primary">{title}</h3>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

