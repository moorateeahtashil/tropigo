type Props = {
  src: string
  alt: string
  title: string
  subtitle?: string
  aspect?: string
}

export default function ImageBlock({ src, alt, title, subtitle, aspect = 'aspect-[4/3]' }: Props) {
  return (
    <div className={`group relative rounded-2xl overflow-hidden ${aspect}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6 text-white">
        <h3 className="font-headline text-2xl">{title}</h3>
        {subtitle && <p className="text-[10px] text-white/70 uppercase tracking-widest mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}

