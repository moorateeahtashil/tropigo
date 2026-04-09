import Link from 'next/link'
import { listMenus, createMenu } from './actions'

export const dynamic = 'force-dynamic'

export default async function NavigationMenus() {
  const rows = await listMenus()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Navigation Menus</h1>
        <form action={createAction} className="flex items-center gap-2">
          <input name="key" placeholder="key" className="rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          <input name="label" placeholder="label" className="rounded-lg border-sand-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          <button className="rounded-lg border border-sand-300 px-3 py-2 text-sm">Create</button>
        </form>
      </div>
      <div className="rounded-2xl border border-sand-200 bg-white p-4 shadow-card">
        <ul className="space-y-2 text-sm">
          {rows.map((m:any)=> (
            <li key={m.id}>
              <Link href={`/admin/navigation/${m.id}`} className="text-brand-700 hover:underline">{m.label}</Link>
              <span className="text-ink-muted"> — {m.key}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

async function createAction(formData: FormData) {
  'use server'
  await createMenu({ key: String(formData.get('key')||''), label: String(formData.get('label')||'') })
}

