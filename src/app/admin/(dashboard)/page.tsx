import { getDashboardStats } from './actions'
import Link from 'next/link'
import { Route, Car, Package, Users, BookOpen, DollarSign, TrendingUp, Calendar, Star, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    { label: 'Total Trips', value: stats.totalTrips, icon: Route, color: 'text-brand-600', bg: 'bg-brand-50', change: '+3 this month' },
    { label: 'Total Transfers', value: stats.totalTransfers, icon: Car, color: 'text-blue-600', bg: 'bg-blue-50', change: 'Active' },
    { label: 'Total Packages', value: stats.totalPackages, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50', change: `${stats.publishedPackages} published` },
    { label: 'Total Bookings', value: stats.totalBookings, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', change: `${stats.pendingBookings} pending` },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', change: `${stats.recentCustomers} this week` },
    { label: 'Revenue', value: `€${stats.totalRevenue?.toFixed(0) ?? 0}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', change: `${stats.confirmedBookings} confirmed` },
  ]

  const statusData = [
    { label: 'Confirmed', value: stats.confirmedBookings, color: 'bg-emerald-500' },
    { label: 'Pending', value: stats.pendingBookings, color: 'bg-amber-500' },
    { label: 'Processing', value: stats.processingBookings, color: 'bg-blue-500' },
    { label: 'Cancelled', value: stats.cancelledBookings, color: 'bg-red-500' },
  ]
  const totalBookingsForChart = statusData.reduce((s, d) => s + d.value, 0) || 1

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-ink-secondary">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(stat => (
          <div key={stat.label} className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-secondary">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-ink">{stat.value}</p>
                <p className="mt-1 text-xs text-ink-muted">{stat.change}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Status Bar Chart */}
        <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">
            <BookOpen className="h-5 w-5 text-brand-600" />
            Booking Overview
          </h2>
          <div className="space-y-3">
            {statusData.map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-20 text-sm text-ink-secondary">{item.label}</span>
                <div className="flex-1 overflow-hidden rounded-full bg-sand-100">
                  <div
                    className={`h-3 rounded-full ${item.color} transition-all`}
                    style={{ width: `${(item.value / totalBookingsForChart) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-medium text-ink">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-sand-50 p-3 text-sm text-ink-secondary">
            <TrendingUp className="h-4 w-4" />
            <span>Total bookings: <strong className="text-ink">{totalBookingsForChart}</strong></span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">
            <Clock className="h-5 w-5 text-brand-600" />
            Quick Actions
          </h2>
          <div className="grid gap-3">
            <Link href="/admin/trips/new" className="flex items-center gap-3 rounded-xl border border-sand-100 bg-sand-50 p-4 transition-colors hover:bg-sand-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                <Route className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Create New Trip</p>
                <p className="text-xs text-ink-secondary">Add a guided tour or drop-off</p>
              </div>
            </Link>
            <Link href="/admin/packages/new" className="flex items-center gap-3 rounded-xl border border-sand-100 bg-sand-50 p-4 transition-colors hover:bg-sand-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Package className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Create Package</p>
                <p className="text-xs text-ink-secondary">Bundle trips together</p>
              </div>
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-3 rounded-xl border border-sand-100 bg-sand-50 p-4 transition-colors hover:bg-sand-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <BookOpen className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">View Bookings</p>
                <p className="text-xs text-ink-secondary">{stats.pendingBookings} pending review</p>
              </div>
            </Link>
            <Link href="/admin/enquiries" className="flex items-center gap-3 rounded-xl border border-sand-100 bg-sand-50 p-4 transition-colors hover:bg-sand-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Star className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Manage Enquiries</p>
                <p className="text-xs text-ink-secondary">Respond to customer inquiries</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Revenue / Product Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product Distribution - Donut-like */}
        <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">
            <Calendar className="h-5 w-5 text-brand-600" />
            Product Distribution
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Trips', count: stats.totalTrips, total: stats.totalProducts || 1, color: 'bg-brand-500' },
              { label: 'Transfers', count: stats.totalTransfers, total: stats.totalProducts || 1, color: 'bg-blue-500' },
              { label: 'Packages', count: stats.totalPackages, total: stats.totalProducts || 1, color: 'bg-purple-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-ink-secondary">{item.label}</span>
                  <span className="font-medium text-ink">{item.count} ({Math.round((item.count / item.total) * 100)}%)</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-sand-100">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.count / item.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stats */}
        <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">
            <DollarSign className="h-5 w-5 text-brand-600" />
            Business Health
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
              <div>
                <p className="text-sm text-green-700">Confirmation Rate</p>
                <p className="text-2xl font-bold text-green-800">
                  {totalBookingsForChart > 0 ? Math.round((stats.confirmedBookings / totalBookingsForChart) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
              <div>
                <p className="text-sm text-blue-700">Avg. Booking Value</p>
                <p className="text-2xl font-bold text-blue-800">
                  €{stats.totalBookings > 0 ? (stats.totalRevenue / stats.totalBookings).toFixed(0) : 0}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-purple-50 p-4">
              <div>
                <p className="text-sm text-purple-700">Active Products</p>
                <p className="text-2xl font-bold text-purple-800">{stats.totalProducts}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
