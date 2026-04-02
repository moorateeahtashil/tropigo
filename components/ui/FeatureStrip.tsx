export default function FeatureStrip({ items }: { items: { icon: React.ReactNode; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-secondary text-xl" aria-hidden>{it.icon}</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{it.label}</span>
        </div>
      ))}
    </div>
  )
}

