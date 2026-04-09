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

    // Insert new schedules (filter out temp IDs)
    const newSchedules = schedules
      .filter(s => !s.id.startsWith('new-'))
      .map(s => ({
        trip_id: tripId,
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        max_capacity: s.max_capacity,
        is_active: s.is_active,
      }))

    if (newSchedules.length > 0) {
      await supabase.from('trip_schedules').insert(newSchedules)
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

  return NextResponse.json(data || [])
}
