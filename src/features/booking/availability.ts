import { createAdminClient } from '@/lib/supabase/admin'

function dayOfWeek(dateStr: string): number {
  // ISO: 1=Mon..7=Sun
  const d = new Date(dateStr)
  const day = d.getUTCDay()
  return day === 0 ? 7 : day
}

export async function assertAvailable(productId: string, bookingDate?: string, bookingTime?: string) {
  if (!bookingDate) return
  const supabase = createAdminClient()
  const { data: rules } = await supabase
    .from('availability_rules')
    .select('*')
    .eq('product_id', productId)

  if (!rules || rules.length === 0) return

  const now = new Date()
  const dt = new Date(bookingDate + (bookingTime ? `T${bookingTime}` : 'T00:00:00'))
  const dow = dayOfWeek(bookingDate)

  for (const r of rules) {
    const inDateRange = (!r.start_date || bookingDate >= r.start_date) && (!r.end_date || bookingDate <= r.end_date)
    const matchesDow = !r.days_of_week || r.days_of_week.length === 0 || r.days_of_week.includes(dow)
    if (r.rule_type === 'blackout') {
      if (inDateRange && matchesDow) {
        throw new Error('Selected date is unavailable (blackout).')
      }
    } else if (r.rule_type === 'schedule') {
      // Only allow if within schedule ranges
      if (!(inDateRange && matchesDow)) {
        throw new Error('Selected date is outside the activity schedule.')
      }
    } else if (r.rule_type === 'cutoff') {
      const diffHours = (dt.getTime() - now.getTime()) / 3_600_000
      if (diffHours < (r.min_advance_hours ?? 24)) {
        throw new Error(`Must book at least ${r.min_advance_hours ?? 24} hours in advance.`)
      }
      if (r.max_advance_days && diffHours > r.max_advance_days * 24) {
        throw new Error(`Bookings allowed only up to ${r.max_advance_days} days in advance.`)
      }
    }
  }
}

