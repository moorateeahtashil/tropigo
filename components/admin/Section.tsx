export default function Section({ title, children, actions }: { title?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="admin-section">
      {(title || actions) && (
        <div className="admin-section-header">
          {title && <h3 className="admin-section-title">{title}</h3>}
          {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

