import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('id, title, product_type')
    .eq('status', 'published')
    .order('title', { ascending: true })

  if (error) {
    console.error('Failed to fetch activities:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
