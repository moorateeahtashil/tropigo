export default function CTA({
  eyebrow,
  title,
  body,
  primary,
  secondary,
}: {
  eyebrow?: string
  title: string
  body?: string
  primary?: React.ReactNode
  secondary?: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary text-on-primary p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(121,246,245,0.25),transparent_50%),radial-gradient(circle_at_80%_100%,rgba(215,227,255,0.2),transparent_50%)]" />
      <div className="relative">
        {eyebrow && <div className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-2">{eyebrow}</div>}
        <h3 className="font-headline text-2xl md:text-3xl mb-2">{title}</h3>
        {body && <p className="text-white/90 mb-4 max-w-2xl">{body}</p>}
        <div className="flex gap-3">{primary}{secondary}</div>
      </div>
    </div>
  )
}

