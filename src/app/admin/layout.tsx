import { requireAdmin } from '@/features/admin/guards'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="grid h-screen grid-cols-[240px_1fr] bg-sand-50">
      <AdminSidebar />
      <div className="flex min-h-0 flex-col">
        <header className="flex h-14 items-center border-b border-sand-200 bg-white px-4">
          <div className="text-sm text-ink-secondary">Admin</div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

