import Link from 'next/link'

export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[]
}) {
  return (
    <nav className="text-xs text-outline mb-2" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {it.href ? (
              <Link href={it.href} className="hover:text-primary font-medium">
                {it.label}
              </Link>
            ) : (
              <span className="text-primary font-semibold">{it.label}</span>
            )}
            {idx < items.length - 1 && <span className="text-outline/70">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

