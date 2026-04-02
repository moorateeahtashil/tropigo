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
    <div className="min-h-dvh bg-surface text-on-surface flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title={title} />
        <main className="p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

