import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/supabase/server'

// Admin-only: requires Authorization: Bearer <access_token>
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.toLowerCase().startsWith('bearer ')
    ? auth.slice(7).trim()
    : undefined

  if (!token) {
    return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 })
  }

  try {
    const supabase = getServerSupabase(token)
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ sections: data ?? [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

