import AdminShell from '@/components/admin/Shell'
import AdminGuard from '@/components/admin/AdminGuard'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell title="Dashboard">{children}</AdminShell>
    </AdminGuard>
  )
}
