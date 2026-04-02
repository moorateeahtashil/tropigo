export default function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
      {children}
    </div>
  )
}

