export default function TestimonialCard({
  quote,
  author,
  location,
  rating = 5,
}: {
  quote: string
  author: string
  location?: string
  rating?: number
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6">
      <div className="text-secondary mb-2">{'★'.repeat(rating)}{'☆'.repeat(Math.max(0, 5 - rating))}</div>
      <p className="text-on-surface mb-4 leading-relaxed">{quote}</p>
      <div className="text-sm text-outline">
        <span className="font-bold text-primary">{author}</span>
        {location ? ` • ${location}` : ''}
      </div>
    </div>
  )
}

