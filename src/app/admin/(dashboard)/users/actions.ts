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
