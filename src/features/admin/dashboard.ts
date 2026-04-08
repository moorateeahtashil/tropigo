import { createAdminClient } from '@/lib/supabase/admin'

export interface DashboardStats {
  bookings: {
    total: number
    confirmed: number
    pending: number
    thisMonth: number
  }
  revenue: {
    total: number
    thisMonth: number
    currency: string
  }
  products: {
    total: number
    published: number
    draft: number
  }
  enquiries: {
    total: number
    unread: number
  }
  reviews: {
    pending: number
    total: number
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    bookingsAll,
    bookingsConfirmed,
    bookingsPending,
    bookingsThisMonth,
    revenueTotal,
    revenueThisMonth,
    productsAll,
    productsPublished,
    enquiriesAll,
    enquiriesNew,
    reviewsPending,
    reviewsAll,
  ] = await Promise.all([
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).in('status', ['pending', 'processing']),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', startOfMonth),
    supabase.from('bookings').select('total_amount').eq('status', 'confirmed'),
    supabase.from('bookings').select('total_amount').eq('status', 'confirmed').gte('confirmed_at', startOfMonth),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('enquiries').select('id', { count: 'exact', head: true }),
    supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reviews').select('id', { count: 'exact', head: true }),
  ])

  const totalRevenue = (revenueTotal.data ?? []).reduce((s, b) => s + (b.total_amount ?? 0), 0)
  const monthRevenue = (revenueThisMonth.data ?? []).reduce((s, b) => s + (b.total_amount ?? 0), 0)

  return {
    bookings: {
      total: bookingsAll.count ?? 0,
      confirmed: bookingsConfirmed.count ?? 0,
      pending: bookingsPending.count ?? 0,
      thisMonth: bookingsThisMonth.count ?? 0,
    },
    revenue: {
      total: Math.round(totalRevenue * 100) / 100,
      thisMonth: Math.round(monthRevenue * 100) / 100,
      currency: 'EUR',
    },
    products: {
      total: productsAll.count ?? 0,
      published: productsPublished.count ?? 0,
      draft: (productsAll.count ?? 0) - (productsPublished.count ?? 0),
    },
    enquiries: {
      total: enquiriesAll.count ?? 0,
      unread: enquiriesNew.count ?? 0,
    },
    reviews: {
      pending: reviewsPending.count ?? 0,
      total: reviewsAll.count ?? 0,
    },
  }
}
