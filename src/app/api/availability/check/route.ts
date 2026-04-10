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

  // Check if this is a trip
  const supabase = createAdminClient()
  const { data: product } = await supabase
    .from('products')
    .select('product_type')
    .eq('id', productId)
    .single()

  const isTrip = product?.product_type === 'trip'

  // If checking a range (for calendar display)
  if (startDate && endDate) {
    return await checkDateRange(productId, startDate, endDate, isTrip)
  }

  // If checking specific date/time
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

/**
 * Check if a trip has any available departure for the given date.
 */
async function assertTripAvailable(productId: string, date?: string) {
  if (!date) return
  const supabase = createAdminClient()
  const dow = new Date(date).getUTCDay()

  const { data: schedules } = await supabase
    .from('trip_schedules')
    .select('*')
    .eq('trip_id', productId)
    .eq('day_of_week', dow)
    .eq('is_active', true)

  if (!schedules || schedules.length === 0) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    throw new Error(`No departures scheduled on ${dayNames[dow]}.`)
  }

  // Check booking slots — ensure not overbooked
  const { data: slots } = await supabase
    .from('booking_slots')
    .select('start_time, booked_count, max_capacity')
    .eq('trip_id', productId)
    .eq('departure_date', date)

  for (const schedule of schedules) {
    const bookedSlot = slots?.find(s => s.start_time === schedule.start_time)
    if (!bookedSlot || bookedSlot.booked_count < schedule.max_capacity) {
      return // This departure has space
    }
  }
  throw new Error('All departures for this date are fully booked.')
}

async function checkDateRange(productId: string, start: string, end: string, isTrip: boolean) {
  const supabase = createAdminClient()

  if (isTrip) {
    return await checkTripSlots(productId, start, end)
  }

  // Original non-trip availability check

  // Get all availability rules for this product
  const { data: rules } = await supabase
    .from('availability_rules')
    .select('*')
    .eq('product_id', productId)

  // Check driver availability for this product/date range
  // Gracefully falls back if driver system not set up yet
  let driverSlots: any = null
  try {
    const { data } = await supabase
      .rpc('get_driver_availability_for_range', {
        p_product_id: productId,
        p_start_date: start,
        p_end_date: end,
      })
    driverSlots = data
  } catch {
    // Driver functions don't exist yet - fall back to rules-only mode
    driverSlots = null
  }

  const hasDriverSystem = driverSlots !== null

  if (!rules || rules.length === 0) {
    // No rules = use driver availability only (or default if no drivers)
    const slots: Record<string, Array<{ time: string; available: boolean }>> = {}
    const current = new Date(start)
    const endDt = new Date(end)
    while (current <= endDt) {
      const dateStr = current.toISOString().split('T')[0]
      
      if (hasDriverSystem && driverSlots.length > 0) {
        const driverTimes = driverSlots.filter((d: any) => d.available_date === dateStr)
        if (driverTimes.length > 0) {
          slots[dateStr] = driverTimes.map((d: any) => ({
            time: d.start_time,
            available: d.available_count > 0,
          }))
        } else {
          slots[dateStr] = []
        }
      } else {
        // No driver system or no drivers = all dates available by default
        slots[dateStr] = [
          { time: '09:00', available: true },
          { time: '13:00', available: true },
        ]
      }
      current.setDate(current.getDate() + 1)
    }
    return NextResponse.json({ slots })
  }

  // Build slots from rules, constrained by driver availability if available
  const slots: Record<string, Array<{ time: string; available: boolean }>> = {}
  const current = new Date(start)
  const endDt = new Date(end)

  while (current <= endDt) {
    const dateStr = current.toISOString().split('T')[0]
    const dateRules = rules.filter(r => {
      if (!r.start_date && !r.end_date) return true
      if (r.start_date && r.end_date) return dateStr >= r.start_date && dateStr <= r.end_date
      if (r.start_date) return dateStr >= r.start_date
      if (r.end_date) return dateStr <= r.end_date
      return false
    })

    const driverTimes = hasDriverSystem ? driverSlots.filter((d: any) => d.available_date === dateStr) : []
    const isBlackout = dateRules.some(r => r.rule_type === 'blackout')
    const scheduleRules = dateRules.filter(r => r.rule_type === 'schedule')

    if (isBlackout) {
      slots[dateStr] = []
    } else if (scheduleRules.length > 0) {
      slots[dateStr] = scheduleRules.map(r => {
        const notes = typeof r.notes === 'string' ? JSON.parse(r.notes) : r.notes || {}
        const time = notes.time || '09:00'
        
        if (hasDriverSystem && driverTimes.length > 0) {
          const driverForTime = driverTimes.find((d: any) => d.start_time === time)
          const driverAvailable = !driverForTime || driverForTime.available_count > 0
          return { time, available: driverAvailable }
        }
        
        // No driver system = use rules only
        return { time, available: true }
      })
    } else {
      if (hasDriverSystem && driverTimes.length > 0) {
        slots[dateStr] = driverTimes.map((d: any) => ({
          time: d.start_time,
          available: d.available_count > 0,
        }))
      } else {
        slots[dateStr] = [
          { time: '09:00', available: true },
          { time: '13:00', available: true },
        ]
      }
    }

    current.setDate(current.getDate() + 1)
  }

  return NextResponse.json({ slots })
}

/**
 * Return available departure slots for a trip across a date range.
 * Uses trip_schedules table to determine which days/times the trip runs.
 */
async function checkTripSlots(productId: string, start: string, end: string) {
  const supabase = createAdminClient()

  // Fetch all active schedules for this trip
  const { data: schedules } = await supabase
    .from('trip_schedules')
    .select('*')
    .eq('trip_id', productId)
    .eq('is_active', true)

  // Fetch booking slots to check capacity
  const { data: bookingSlots } = await supabase
    .from('booking_slots')
    .select('*')
    .eq('trip_id', productId)
    .gte('departure_date', start)
    .lte('departure_date', end)

  const slots: Record<string, Array<{ time: string; available: boolean; max_capacity: number; booked_count: number }>> = {}
  const current = new Date(start)
  const endDt = new Date(end)

  while (current <= endDt) {
    const dateStr = current.toISOString().split('T')[0]
    const dow = current.getUTCDay()

    // Filter schedules for this day of week
    const daySchedules = schedules?.filter(s => s.day_of_week === dow) || []

    if (daySchedules.length === 0) {
      slots[dateStr] = []
    } else {
      slots[dateStr] = daySchedules.map(schedule => {
        const bookedSlot = bookingSlots?.find(
          s => s.start_time === schedule.start_time && s.departure_date === dateStr
        )
        const bookedCount = bookedSlot?.booked_count || 0
        const maxCap = schedule.max_capacity

        return {
          time: schedule.start_time,
          available: bookedCount < maxCap,
          max_capacity: maxCap,
          booked_count: bookedCount,
        }
      })
    }

    current.setDate(current.getDate() + 1)
  }

  return NextResponse.json({ slots })
}

