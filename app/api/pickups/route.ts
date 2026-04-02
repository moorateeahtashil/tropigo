import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tourId = searchParams.get('tourId') || ''
  if (!tourId) return NextResponse.json({ error: 'Missing tourId' }, { status: 400 })
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from('tours_pickup_options')
    .select('id,label,surcharge,position')
    .eq('tour_id', tourId)
    .eq('active', true)
    .order('position', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ pickups: data || [] })
}

