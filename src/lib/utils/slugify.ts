export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

export function generateUniqueSlug(title: string, suffix?: string): string {
  const base = slugify(title)
  if (suffix) return `${base}-${suffix}`
  return base
}
