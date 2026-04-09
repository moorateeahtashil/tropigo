import { createAdminClient } from '@/lib/supabase/admin'

export async function getDashboardStats() {
  const supabase = createAdminClient()

  const [
    { count: totalTrips },
    { count: totalTransfers },
    { count: totalPackages },
    { count: totalProducts },
    { count: totalBookings },
    { count: confirmedBookings },
    { count: pendingBookings },
    { count: processingBookings },
    { count: cancelledBookings },
    { count: totalCustomers },
    { count: recentCustomers },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('product_type', 'trip'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('product_type', 'airport_transfer'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('product_type', 'package'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  // Get total revenue from confirmed bookings
  const { data: revenueData } = await supabase
    .from('bookings')
    .select('total_amount')
    .eq('status', 'confirmed')

  const totalRevenue = revenueData?.reduce((sum, b) => sum + Number(b.total_amount), 0) ?? 0

  const { count: publishedPackages } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('product_type', 'package')
    .eq('status', 'published')

  return {
    totalTrips: totalTrips ?? 0,
    totalTransfers: totalTransfers ?? 0,
    totalPackages: totalPackages ?? 0,
    totalProducts: totalProducts ?? 0,
    totalBookings: totalBookings ?? 0,
    confirmedBookings: confirmedBookings ?? 0,
    pendingBookings: pendingBookings ?? 0,
    processingBookings: processingBookings ?? 0,
    cancelledBookings: cancelledBookings ?? 0,
    totalCustomers: totalCustomers ?? 0,
    recentCustomers: recentCustomers ?? 0,
    totalRevenue,
    publishedPackages: publishedPackages ?? 0,
  }
}
