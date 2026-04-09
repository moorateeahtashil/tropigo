import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('availability_rules')
    .select('*')
    .eq('product_id', productId)
    .order('start_date', { ascending: true })

  if (error) {
    console.error('Failed to fetch availability:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform to frontend format
  const daysMap = new Map<string, any>()
  data?.forEach(rule => {
    const date = rule.start_date
    if (!daysMap.has(date)) {
      daysMap.set(date, {
        id: rule.id,
        date,
        is_available: rule.rule_type !== 'blackout',
        time_slots: [],
      })
    }
    if (rule.days_of_week?.length > 0) {
      // Handle recurring rules
    }
  })

  const result = Array.from(daysMap.values())

  // If no rules exist, return empty array
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { productId, availability } = body

  if (!productId || !availability) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = await createClient()

  // Delete existing rules for this product
  await supabase.from('availability_rules').delete().eq('product_id', productId)

  // Insert new rules
  const rulesToInsert = availability.flatMap((day: any) => {
    if (!day.is_available) {
      return {
        product_id: productId,
        rule_type: 'blackout',
        start_date: day.date,
        end_date: day.date,
      }
    }

    return day.time_slots.map((slot: any) => ({
      product_id: productId,
      rule_type: 'schedule',
      start_date: day.date,
      end_date: day.date,
      notes: JSON.stringify({ time: slot.time, max_participants: slot.max_participants }),
    }))
  })

  if (rulesToInsert.length > 0) {
    const { error } = await supabase.from('availability_rules').insert(rulesToInsert)
    if (error) {
      console.error('Failed to save availability:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
