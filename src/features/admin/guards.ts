import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------
// Use in admin Server Components or Server Actions to gate access.
// Redirects to /admin/login if not authenticated or not an admin.
// ---------------------------------------------------------------

export async function requireAdmin(): Promise<{ userId: string; email: string }> {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, email')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/admin/login?error=unauthorized')
  }

  return { userId: user.id, email: profile.email }
}

// ---------------------------------------------------------------
// For admin API route handlers that need to return JSON errors
// ---------------------------------------------------------------

export async function getAdminUser(): Promise<{ userId: string; email: string } | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, email')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return null
  return { userId: user.id, email: profile.email }
}
