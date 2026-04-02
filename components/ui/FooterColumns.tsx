export default function FooterColumns({ groups }: { groups: { title: string; items: { label: string; href: string }[] }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {groups.map((g, i) => (
        <div key={i}>
          <h3 className="font-semibold tracking-widest text-[11px] uppercase mb-6 text-secondary">{g.title}</h3>
          <ul className="space-y-3 text-white/80 text-sm">
            {g.items.map((it, j) => (
              <li key={j}><a className="hover:text-white transition-colors" href={it.href}>{it.label}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

