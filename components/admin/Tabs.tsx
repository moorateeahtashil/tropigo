export function Tabs({ tabs, active, onChange }: { tabs: { key: string; label: string }[]; active: string; onChange?: (key: string) => void }) {
  return (
    <div className="admin-tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange?.(t.key)}
          className={`admin-tab${t.key === active ? ' active' : ''}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

