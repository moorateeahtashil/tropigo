import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Toaster } from '@/components/ui/Toaster'
import { ToastReader } from '@/components/ui/ToastReader'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900">
              <span className="text-indigo-600">Tropigo</span>
              <span className="ml-1 text-sm font-normal text-gray-400">Admin Panel</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
      <Toaster />
      <ToastReader />
    </div>
  )
}

