export function Tabs({ tabs, active }: { tabs: { key: string; label: string }[]; active: string }) {
  return (
    <div className="flex gap-2 bg-surface-container-low p-2 rounded-xl border border-outline-variant/20">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={
            'px-4 py-2 rounded-lg text-sm ' +
            (t.key === active ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-outline hover:bg-surface-container-high')
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

