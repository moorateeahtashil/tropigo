import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, reorderMenu } from '../actions'

export default async function MenuItemsPage({ params }: { params: { id: string } }) {
  const { menu, items } = await getMenu(params.id)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Menu: {menu.label}</h1>
      <form action={addAction.bind(null, menu.id)} className="rounded-2xl border border-sand-200 bg-white p-4 shadow-card">
        <h2 className="mb-2 font-semibold">Add Item</h2>
        <div className="grid gap-3 sm:grid-cols-5">
          <input name="label" placeholder="Label" className="rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          <input name="href" placeholder="/path or URL" className="rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          <select name="link_type" className="rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"><option value="internal">internal</option><option value="external">external</option><option value="anchor">anchor</option></select>
          <input name="position" type="number" placeholder="pos" className="rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          <button className="rounded-lg border border-sand-300 px-3 py-2 text-sm">Add</button>
        </div>
      </form>
      <form action={reorderAction.bind(null, menu.id)} className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
        <table className="w-full text-left text-sm" data-sortable>
          <thead className="bg-sand-50 text-ink-muted">
            <tr>
              <th className="px-4 py-2">Label</th>
              <th className="px-4 py-2">Href</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">New Tab</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="menuRows">
            {items.map((it:any)=> (
              <tr key={it.id} data-id={it.id} className="border-t border-sand-100">
                <td className="px-4 py-2">
                  <form action={updateAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={it.id} />
                    <input type="hidden" name="menu_id" value={menu.id} />
                    <input name="label" defaultValue={it.label} className="w-40 rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500" />
                    <input name="href" defaultValue={it.href} className="w-40 rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500" />
                    <select name="link_type" defaultValue={it.link_type} className="rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"><option value="internal">internal</option><option value="external">external</option><option value="anchor">anchor</option></select>
                    <input name="position" type="number" defaultValue={it.position || 0} className="w-16 rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500" />
                    <label className="flex items-center gap-2"><input name="open_in_new_tab" type="checkbox" defaultChecked={it.open_in_new_tab} className="h-4 w-4 rounded border-gray-300" /> New Tab</label>
                    <button className="rounded-lg border border-sand-300 px-2 py-1 text-xs">Save</button>
                  </form>
                </td>
                <td className="px-4 py-2 text-ink-secondary">{it.href}</td>
                <td className="px-4 py-2">{it.link_type}</td>
                <td className="px-4 py-2">{it.position}</td>
                <td className="px-4 py-2">{it.open_in_new_tab ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 text-right">
                  <form action={deleteAction} className="inline">
                    <input type="hidden" name="id" value={it.id} />
                    <input type="hidden" name="menu_id" value={menu.id} />
                    <button className="text-red-600 hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <input type="hidden" id="nav-ordered" name="ordered_ids" />
        <div className="p-3"><button id="nav-save" disabled className="rounded-lg border border-sand-300 px-3 py-2 text-sm disabled:opacity-50">Save order</button></div>
      </form>
    </div>
  )
}

async function addAction(menuId: string, formData: FormData) {
  'use server'
  await addMenuItem({
    menu_id: menuId,
    label: String(formData.get('label')||''),
    href: String(formData.get('href')||''),
    link_type: String(formData.get('link_type')||'internal') as any,
    position: Number(formData.get('position')||0),
  })
}

async function updateAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const menuId = String(formData.get('menu_id'))
  await updateMenuItem(id, menuId, {
    label: String(formData.get('label')||''),
    href: String(formData.get('href')||''),
    link_type: String(formData.get('link_type')||'internal') as any,
    position: Number(formData.get('position')||0),
    open_in_new_tab: formData.get('open_in_new_tab') === 'on',
  })
}

async function deleteAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const menuId = String(formData.get('menu_id'))
  await deleteMenuItem(id, menuId)
}

async function reorderAction(menuId: string, formData: FormData) {
  'use server'
  const ids = String(formData.get('ordered_ids') || '').split(',').filter(Boolean)
  if (ids.length) await reorderMenu(menuId, ids)
}
