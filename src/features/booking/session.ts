import { createAdminClient } from '@/lib/supabase/admin'
import { getAllRatesFrom } from '@/features/pricing/convert'
import type { BookingSessionRow } from '@/types/database'

// ---------------------------------------------------------------
// Create a new booking session
// ---------------------------------------------------------------

export async function createBookingSession(params: {
  currency: string
  customerEmail?: string
}): Promise<BookingSessionRow> {
  const supabase = createAdminClient()

  // Snapshot exchange rates at session creation time
  const rates = await getAllRatesFrom(params.currency).catch(() => ({}))

  const { data, error } = await supabase
    .from('booking_sessions')
    .insert({
      currency: params.currency,
      customer_email: params.customerEmail ?? null,
      exchange_rates_snapshot: rates,
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single()

  if (error || !data) {
    throw new Error(`Failed to create booking session: ${error?.message}`)
  }

  return data as BookingSessionRow
}

// ---------------------------------------------------------------
// Fetch a session (validates it hasn't expired)
// ---------------------------------------------------------------

export async function getBookingSession(sessionId: string): Promise<BookingSessionRow | null> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('booking_sessions')
    .select('*')
    .eq('id', sessionId)
    .gt('expires_at', new Date().toISOString())
    .single()

  return (data as BookingSessionRow | null)
}

// ---------------------------------------------------------------
// Extend session TTL (on user activity)
// ---------------------------------------------------------------

export async function touchBookingSession(sessionId: string): Promise<void> {
  const supabase = createAdminClient()

  await supabase
    .from('booking_sessions')
    .update({
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    })
    .eq('id', sessionId)
}

// ---------------------------------------------------------------
// Cleanup expired sessions (run by cron)
// ---------------------------------------------------------------

export async function cleanExpiredSessions(): Promise<number> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('booking_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .select('id')

  return data?.length ?? 0
}
