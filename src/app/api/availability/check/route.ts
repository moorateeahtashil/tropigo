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

  if (!rules || rules.length === 0) {
    // No rules = all dates available with default times
    const slots: Record<string, Array<{ time: string; available: boolean }>> = {}
    const current = new Date(start)
    const endDt = new Date(end)
    while (current <= endDt) {
      const dateStr = current.toISOString().split('T')[0]
      slots[dateStr] = [
        { time: '09:00', available: true },
        { time: '13:00', available: true },
      ]
      current.setDate(current.getDate() + 1)
    }
    return NextResponse.json({ slots })
  }

  // Build slots from rules
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

    const isBlackout = dateRules.some(r => r.rule_type === 'blackout')
    const scheduleRules = dateRules.filter(r => r.rule_type === 'schedule')

    if (isBlackout) {
      slots[dateStr] = []
    } else if (scheduleRules.length > 0) {
      slots[dateStr] = scheduleRules.map(r => {
        const notes = typeof r.notes === 'string' ? JSON.parse(r.notes) : r.notes || {}
        return {
          time: notes.time || '09:00',
          available: true,
        }
      })
    } else {
      // Default slots if no schedule rules
      slots[dateStr] = [
        { time: '09:00', available: true },
        { time: '13:00', available: true },
      ]
    }

    current.setDate(current.getDate() + 1)
  }

  return NextResponse.json({ slots })
}

