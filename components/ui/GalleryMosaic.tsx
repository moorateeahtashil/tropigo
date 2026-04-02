export default function GalleryMosaic({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null
  const main = images[0]
  const rest = images.slice(1, 5)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={main} alt="hero" className="w-full h-[360px] lg:h-[480px] object-cover rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 lg:col-span-2">
        {rest.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt={`image ${i + 2}`} className="w-full h-[180px] object-cover rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

