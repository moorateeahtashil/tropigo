export default function Badge({ children, tone = 'secondary', className }: { children: React.ReactNode; tone?: 'secondary'|'primary'|'neutral'; className?: string }) {
  const toneCls =
    tone === 'secondary' ? 'bg-secondary/15 text-secondary' : tone === 'primary' ? 'bg-primary/10 text-primary' : 'bg-outline-variant/20 text-on-surface-variant'
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${toneCls} ${className || ''}`}>
      {children}
    </span>
  )
}

