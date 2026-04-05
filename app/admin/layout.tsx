import AdminGuard from '@/components/admin/AdminGuard'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>
}
