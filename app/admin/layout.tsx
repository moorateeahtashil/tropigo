import AdminShell from '@/components/admin/Shell'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminShell title="Dashboard">{children}</AdminShell>
}

