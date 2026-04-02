import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/supabase/server'

export async function GET() {
  try {
    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('id, section_type, title, subtitle, data, position')
      .order('position', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ sections: data ?? [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

