export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-lowest">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  )
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-surface-container-low text-outline">{children}</thead>
}

export function TH({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 font-label text-[11px] font-extrabold uppercase tracking-widest">{children}</th>
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-outline-variant/10 text-sm text-on-surface">{children}</tbody>
}

export function TR({ children }: { children: React.ReactNode }) {
  return <tr className="group hover:bg-surface-container-low/60 transition-colors">{children}</tr>
}

export function TD({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <td className={`px-5 py-4 ${right ? 'text-right' : ''}`}>{children}</td>
}

