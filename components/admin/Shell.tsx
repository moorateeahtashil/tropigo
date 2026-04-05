import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'

export default function AdminShell({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="admin-root">
      <Sidebar />
      <div className="admin-main-col">
        <Topbar title={title} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}
