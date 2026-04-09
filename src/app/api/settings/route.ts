import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('settings')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single()

    return NextResponse.json(data ?? {})
  } catch {
    return NextResponse.json({})
  }
}
