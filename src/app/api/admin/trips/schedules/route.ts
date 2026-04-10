import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const { tripId, schedules } = await req.json()

    if (!tripId || !Array.isArray(schedules)) {
      return NextResponse.json({ error: 'Missing tripId or schedules' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Delete all existing schedules for this trip
    await supabase.from('trip_schedules').delete().eq('trip_id', tripId)

    // Insert all current schedules — including newly added ones (temp IDs are irrelevant, we don't use them)
    const rows = schedules.map(s => ({
      trip_id: tripId,
      day_of_week: s.day_of_week,
      start_time: s.start_time,
      max_capacity: s.max_capacity,
      is_active: s.is_active,
    }))

    if (rows.length > 0) {
      const { error } = await supabase.from('trip_schedules').insert(rows)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tripId = searchParams.get('tripId')

  if (!tripId) {
    return NextResponse.json({ error: 'Missing tripId' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('trip_schedules')
    .select('*')
    .eq('trip_id', tripId)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  return NextResponse.json(data || [])
}
