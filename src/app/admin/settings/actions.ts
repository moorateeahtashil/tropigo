"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('settings')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single()
  return data
}

export async function updateSettings(patch: Partial<{ brand_name: string; contact_email: string; contact_phone: string; supported_currencies: string[]; default_currency: string }>) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('settings')
    .update(patch)
    .eq('id', '00000000-0000-0000-0000-000000000001')
  if (error) throw new Error(error.message)
  revalidatePath('/admin/settings')
}

