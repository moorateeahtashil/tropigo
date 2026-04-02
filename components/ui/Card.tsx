export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-outline-variant/10 shadow-sm ${className || ''}`}>{children}</div>
}

export function CardMedia({ src, alt, aspect = 'aspect-[4/3]', overlay = true }: { src: string; alt: string; aspect?: string; overlay?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${aspect}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />}
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className || ''}`}>{children}</div>
}

