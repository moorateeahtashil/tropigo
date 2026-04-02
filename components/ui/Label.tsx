export default function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-label text-[10px] uppercase tracking-widest ${className || ''}`}>{children}</span>
  )
}

