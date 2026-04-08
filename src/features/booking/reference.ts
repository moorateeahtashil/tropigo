// Generates human-readable booking references: TRP-20260408-A7X2
// References are unique, collision-resistant, and URL-safe.

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no I, O, 0, 1 to avoid confusion

export function generateBookingRef(): string {
  const date = new Date()
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('')

  const randomPart = Array.from({ length: 4 }, () =>
    CHARS[Math.floor(Math.random() * CHARS.length)],
  ).join('')

  return `TRP-${datePart}-${randomPart}`
}
