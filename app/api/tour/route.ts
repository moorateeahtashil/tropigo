import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from('tours')
    .select('id,name,slug,summary,price_from,currency,hero_image_url')
    .eq('id', id)
    .eq('published', true)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tour: data })
}

