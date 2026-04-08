import Link from 'next/link'

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
      <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
        <p className="text-ink-secondary">Welcome to Tropigo Admin. Start with the catalog:</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link className="rounded-xl bg-brand-700 px-3 py-1.5 text-white" href="/admin/destinations">Manage Destinations</Link>
          <Link className="rounded-xl bg-sand-100 px-3 py-1.5 text-ink" href="/admin/activities">Activities</Link>
          <Link className="rounded-xl bg-sand-100 px-3 py-1.5 text-ink" href="/admin/transfers">Transfers</Link>
          <Link className="rounded-xl bg-sand-100 px-3 py-1.5 text-ink" href="/admin/packages">Packages</Link>
        </div>
      </div>
    </div>
  )
}

