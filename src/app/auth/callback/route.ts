import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/account'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user?.email) {
      // Link existing customer record to auth user (guest who later signs up)
      const admin = createAdminClient()
      await admin
        .from('customers')
        .update({ supabase_user_id: data.user.id })
        .eq('email', data.user.email)
        .is('supabase_user_id', null)
    }
  }

  // Redirect — for password reset the page itself reads the session
  return NextResponse.redirect(new URL(next, request.url))
}
