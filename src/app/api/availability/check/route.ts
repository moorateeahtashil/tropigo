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

  // If checking a range (for calendar display)
  if (startDate && endDate) {
    return await checkDateRange(productId, startDate, endDate)
  }

  // If checking specific date/time
  try {
    await assertAvailable(productId, date, time)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}

async function checkDateRange(productId: string, start: string, end: string) {
  const supabase = createAdminClient()

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

