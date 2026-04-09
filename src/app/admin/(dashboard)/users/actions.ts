'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function listUsers() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, is_admin, created_at')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function toggleUserAdmin(userId: string, isAdmin: boolean) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('profiles')
    .update({ is_admin: isAdmin })
    .eq('id', userId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/users')
}

export async function createAdminUser(email: string, password: string, fullName?: string) {
  const supabase = createAdminClient()

  // Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || '' },
  })

  if (authError) {
    if (authError.message.includes('already')) {
      throw new Error('A user with this email already exists.')
    }
    throw new Error(authError.message)
  }

  if (authData.user) {
    // Ensure profile exists and grant admin
    await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: authData.user.email!,
        full_name: fullName || '',
        is_admin: true,
      }, { onConflict: 'id' })
  }

  revalidatePath('/admin/users')
}
