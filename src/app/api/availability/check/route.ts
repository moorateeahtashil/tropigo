import { NextRequest, NextResponse } from 'next/server'
import { assertAvailable } from '@/features/booking/availability'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const productId = url.searchParams.get('productId')
  const date = url.searchParams.get('date') || undefined
  const time = url.searchParams.get('time') || undefined
  const startDate = url.searchParams.get('startDate') || undefined
  const endDate = url.searchParams.get('endDate') || undefined

  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })

  const supabase = createAdminClient()
  const { data: product } = await supabase
    .from('products')
    .select('product_type')
    .eq('id', productId)
    .single()

  const isTrip = product?.product_type === 'trip'

  if (startDate && endDate) {
    return isTrip
      ? checkTripRange(productId, startDate, endDate)
      : checkActivityRange(productId, startDate, endDate)
  }

  // Single-date check
  try {
    if (isTrip) {
      await assertTripAvailable(productId, date)
    } else {
      await assertAvailable(productId, date, time)
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}

// ---------------------------------------------------------------
// Validate a specific date for a trip (used at cart-add time)
// ---------------------------------------------------------------
async function assertTripAvailable(productId: string, date?: string) {
  if (!date) return
  const supabase = createAdminClient()
  const dow = new Date(date + 'T00:00:00').getDay()

  const { data: schedules } = await supabase
    .from('trip_schedules')
    .select('id, start_time, max_capacity')
    .eq('trip_id', productId)
    .eq('day_of_week', dow)
    .eq('is_active', true)

  if (!schedules || schedules.length === 0) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    throw new Error(`This trip doesn't run on ${dayNames[dow]}.`)
  }

  // Check booking capacity
  const { data: bookingSlots } = await supabase
    .from('booking_slots')
    .select('start_time, booked_count, max_capacity')
    .eq('trip_id', productId)
    .eq('departure_date', date)

  // Check driver availability (if any drivers are configured)
  const driverDow = await getAvailableDriversForDow(supabase, dow)
  const hasDriverSystem = driverDow !== null

  for (const schedule of schedules) {
    const bookedSlot = bookingSlots?.find(s => s.start_time === schedule.start_time)
    const bookedCount = bookedSlot?.booked_count ?? 0
    if (bookedCount >= schedule.max_capacity) continue // slot full

    if (hasDriverSystem) {
      const driverAvailable = driverDow.some(d => coversTime(d.start_time, d.end_time, schedule.start_time))
      if (!driverAvailable) continue // no driver for this slot
    }

    return // found at least one available slot
  }

  throw new Error('No available departures for this date.')
}

// ---------------------------------------------------------------
// Range check for calendar display — trips
// ---------------------------------------------------------------
async function checkTripRange(productId: string, start: string, end: string) {
  const supabase = createAdminClient()

  const [{ data: schedules }, { data: bookingSlots }] = await Promise.all([
    supabase
      .from('trip_schedules')
      .select('id, day_of_week, start_time, max_capacity')
      .eq('trip_id', productId)
      .eq('is_active', true),
    supabase
      .from('booking_slots')
      .select('departure_date, start_time, booked_count, max_capacity')
      .eq('trip_id', productId)
      .gte('departure_date', start)
      .lte('departure_date', end),
  ])

  // Fetch driver weekly availability (all active drivers)
  const { data: driverSlots } = await supabase
    .from('driver_availability')
    .select('day_of_week, start_time, end_time')
    .eq('is_available', true)
    .in(
      'driver_id',
      await getActiveDriverIds(supabase),
    )

  const hasDriverSystem = (driverSlots?.length ?? 0) > 0

  const result: Record<string, Array<{
    time: string
    available: boolean
    max_capacity: number
    booked_count: number
  }>> = {}

  const current = new Date(start + 'T00:00:00')
  const endDt = new Date(end + 'T00:00:00')

  while (current <= endDt) {
    const dateStr = current.toISOString().split('T')[0]
    const dow = current.getDay()

    const daySchedules = schedules?.filter(s => s.day_of_week === dow) ?? []

    if (daySchedules.length === 0) {
      result[dateStr] = [] // trip doesn't run this day
    } else {
      result[dateStr] = daySchedules.map(schedule => {
        const booked = bookingSlots?.find(
          b => b.departure_date === dateStr && b.start_time === schedule.start_time,
        )
        const bookedCount = booked?.booked_count ?? 0
        const capacityOk = bookedCount < schedule.max_capacity

        // Check driver availability for this day/time
        let driverOk = true
        if (hasDriverSystem) {
          const driversThisDow = driverSlots!.filter(d => d.day_of_week === dow)
          driverOk = driversThisDow.some(d =>
            coversTime(d.start_time, d.end_time, schedule.start_time),
          )
        }

        return {
          time: schedule.start_time,
          available: capacityOk && driverOk,
          max_capacity: schedule.max_capacity,
          booked_count: bookedCount,
        }
      })
    }

    current.setDate(current.getDate() + 1)
  }

  return NextResponse.json({ slots: result })
}

// ---------------------------------------------------------------
// Range check for calendar display — activities / transfers
// ---------------------------------------------------------------
async function checkActivityRange(productId: string, start: string, end: string) {
  const supabase = createAdminClient()

  const { data: rules } = await supabase
    .from('availability_rules')
    .select('*')
    .eq('product_id', productId)

  const slots: Record<string, Array<{ time: string; available: boolean }>> = {}
  const current = new Date(start + 'T00:00:00')
  const endDt = new Date(end + 'T00:00:00')

  while (current <= endDt) {
    const dateStr = current.toISOString().split('T')[0]
    const dow = current.getDay() // 0=Sun

    if (!rules || rules.length === 0) {
      // No rules = always available with default slots
      slots[dateStr] = [{ time: '09:00', available: true }, { time: '13:00', available: true }]
      current.setDate(current.getDate() + 1)
      continue
    }

    const applicable = rules.filter(r => {
      if (r.start_date && dateStr < r.start_date) return false
      if (r.end_date && dateStr > r.end_date) return false
      return true
    })

    const isBlackout = applicable.some(r => r.rule_type === 'blackout')
    if (isBlackout) {
      slots[dateStr] = []
      current.setDate(current.getDate() + 1)
      continue
    }

    const scheduleRules = applicable.filter(r => r.rule_type === 'schedule')
    if (scheduleRules.length > 0) {
      const daySchedules = scheduleRules.filter(r =>
        !r.days_of_week?.length || r.days_of_week.includes(dow),
      )
      slots[dateStr] = daySchedules.length > 0
        ? [{ time: '09:00', available: true }]
        : []
    } else {
      slots[dateStr] = [{ time: '09:00', available: true }, { time: '13:00', available: true }]
    }

    current.setDate(current.getDate() + 1)
  }

  return NextResponse.json({ slots })
}

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

/**
 * Returns true if a driver's availability window covers the given departure time.
 * Both times are "HH:MM" strings — lexicographic comparison works for 24h format.
 */
function coversTime(start: string, end: string | null, departure: string): boolean {
  if (departure < start) return false
  if (end && departure >= end) return false
  return true
}

/** Fetch IDs of all active drivers. Returns [] if none. */
async function getActiveDriverIds(supabase: ReturnType<typeof createAdminClient>): Promise<string[]> {
  const { data } = await supabase
    .from('drivers')
    .select('id')
    .eq('is_active', true)
  return (data ?? []).map(d => d.id)
}

/**
 * Get all driver_availability rows for a given day-of-week, across active drivers.
 * Returns null if no drivers exist (system not configured).
 */
async function getAvailableDriversForDow(
  supabase: ReturnType<typeof createAdminClient>,
  dow: number,
): Promise<Array<{ start_time: string; end_time: string | null }> | null> {
  const activeIds = await getActiveDriverIds(supabase)
  if (activeIds.length === 0) return null // no driver system

  const { data } = await supabase
    .from('driver_availability')
    .select('start_time, end_time')
    .in('driver_id', activeIds)
    .eq('day_of_week', dow)
    .eq('is_available', true)

  return data ?? []
}
