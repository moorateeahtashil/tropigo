"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { refreshAllRates } from '@/features/pricing/convert'

export async function listCurrencyRates() {
  const supabase = createAdminClient()
  const { data } = await supabase.from('currency_rates').select('*').order('from_currency', { ascending: true })
  return data ?? []
}

export async function getSupportedCurrencies(): Promise<string[]> {
  const supabase = createAdminClient()
  const { data } = await supabase.from('settings').select('supported_currencies').eq('id','00000000-0000-0000-0000-000000000001').single()
  return data?.supported_currencies ?? ['EUR','USD','GBP','MUR']
}

export async function refreshRatesAction() {
  const supported = await getSupportedCurrencies()
  await refreshAllRates(supported, 'EUR')
  revalidatePath('/admin/pricing')
  redirect('/admin/pricing?toast=success&toast_title=Currency+rates+refreshed')
}

export async function updateCurrencyRate(id: string, rate: number) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('currency_rates')
    .update({ rate, fetched_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/pricing')
}

