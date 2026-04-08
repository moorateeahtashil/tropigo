"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function listMenus() {
  const supabase = createAdminClient()
  const { data } = await supabase.from('navigation_menus').select('*').order('label', { ascending: true })
  return data ?? []
}

export async function getMenu(id: string) {
  const supabase = createAdminClient()
  const { data: menu } = await supabase.from('navigation_menus').select('*').eq('id', id).single()
  const { data: items } = await supabase.from('navigation_items').select('*').eq('menu_id', id).order('position', { ascending: true })
  return { menu, items: items ?? [] }
}

export async function createMenu(input: { key: string; label: string }) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('navigation_menus').insert(input).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/navigation')
  return data
}

export async function addMenuItem(input: { menu_id: string; label: string; href: string; position?: number; link_type?: 'internal'|'external'|'anchor'; open_in_new_tab?: boolean; parent_id?: string | null }) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('navigation_items').insert({
    menu_id: input.menu_id,
    label: input.label,
    href: input.href,
    link_type: input.link_type || 'internal',
    open_in_new_tab: !!input.open_in_new_tab,
    position: input.position || 0,
    parent_id: input.parent_id || null,
  }).select().single()
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/navigation/${input.menu_id}`)
  return data
}

export async function updateMenuItem(id: string, menuId: string, input: Partial<{ label: string; href: string; link_type?: 'internal'|'external'|'anchor'; open_in_new_tab?: boolean; position?: number; parent_id?: string | null }>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('navigation_items').update(input).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/navigation/${menuId}`)
}

export async function deleteMenuItem(id: string, menuId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('navigation_items').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/navigation/${menuId}`)
}

export async function reorderMenu(menuId: string, orderedIds: string[]) {
  const supabase = createAdminClient()
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase.from('navigation_items').update({ position: i }).eq('id', orderedIds[i])
  }
  revalidatePath(`/admin/navigation/${menuId}`)
}
