import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCartItems, getCartTotal, clearCart } from './cart'
import { getBookingSession } from './session'
import { generateBookingRef } from './reference'
import type { BookingRow, BookingItemRow } from '@/types/database'

// ---------------------------------------------------------------
// Checkout form schema (Zod — validated server-side)
// ---------------------------------------------------------------

export const TravellerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  nationality: z.string().optional(),
  passport_number: z.string().optional(),
  is_lead_traveller: z.boolean().default(false),
  special_requirements: z.string().optional(),
})

export const CheckoutSchema = z.object({
  session_id: z.string().uuid(),
  lead_email: z.string().email('Lead email is required'),
  lead_phone: z.string().optional(),
  lead_first_name: z.string().min(1, 'First name is required'),
  lead_last_name: z.string().min(1, 'Last name is required'),
  country: z.string().optional(),
  special_requirements: z.string().optional(),
  travellers: z.array(TravellerSchema).min(1, 'At least one traveller required'),
})

export type CheckoutInput = z.infer<typeof CheckoutSchema>

// ---------------------------------------------------------------
// Create a pending booking from a validated checkout form
// Returns the booking for payment session creation
// ---------------------------------------------------------------

export async function createPendingBooking(
  input: CheckoutInput,
): Promise<BookingRow> {
  const supabase = createAdminClient()

  // Validate the session exists and is not expired
  const session = await getBookingSession(input.session_id)
  if (!session) {
    throw new Error('Booking session expired or not found. Please start again.')
  }

  // Get cart items
  const cartItems = await getCartItems(input.session_id)
  if (cartItems.length === 0) {
    throw new Error('Your cart is empty.')
  }

  const total = await getCartTotal(input.session_id)
  if (!total) throw new Error('Could not compute cart total.')

  // Upsert customer record (guest or existing)
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .upsert(
      {
        email: input.lead_email,
        first_name: input.lead_first_name,
        last_name: input.lead_last_name,
        phone: input.lead_phone ?? null,
        country: input.country ?? null,
      },
      { onConflict: 'email', ignoreDuplicates: false },
    )
    .select()
    .single()

  // Note: upsert on email is a simplification — in production we may want
  // to handle the case where same email = returning customer differently.
  // For MVP, guest checkout always creates/updates by email.

  if (customerError || !customer) {
    throw new Error(`Failed to create customer record: ${customerError?.message}`)
  }

  // Generate unique booking reference
  let ref = generateBookingRef()
  // Ensure uniqueness (extremely rare collision but guard against it)
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('ref', ref)
    .maybeSingle()
  if (existing) ref = generateBookingRef()

  // Create the booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      ref,
      session_id: input.session_id,
      customer_id: customer.id,
      status: 'pending',
      currency: total.currency,
      subtotal: total.total,
      total_amount: total.total,
      exchange_rate_snapshot: session.exchange_rates_snapshot,
      special_requirements: input.special_requirements ?? null,
    })
    .select()
    .single()

  if (bookingError || !booking) {
    throw new Error(`Failed to create booking: ${bookingError?.message}`)
  }

  // Create booking items from cart snapshots
  const bookingItems: Omit<BookingItemRow, 'id' | 'created_at'>[] = cartItems.map(item => ({
    booking_id: booking.id,
    product_id: item.product_id,
    product_type: item.product_type,
    product_title: item.price_snapshot.product_title,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.unit_price * item.quantity,
    currency: item.currency,
    booking_date: item.booking_date,
    booking_time: item.booking_time,
    snapshot: item.price_snapshot as unknown as Record<string, unknown>,
  }))

  await supabase.from('booking_items').insert(bookingItems)

  // Create traveller records
  const travellerRecords = input.travellers.map(t => ({
    booking_id: booking.id,
    first_name: t.first_name,
    last_name: t.last_name,
    email: t.email || null,
    phone: t.phone || null,
    date_of_birth: t.date_of_birth || null,
    nationality: t.nationality || null,
    passport_number: t.passport_number || null,
    is_lead_traveller: t.is_lead_traveller,
    special_requirements: t.special_requirements || null,
  }))

  await supabase.from('booking_travellers').insert(travellerRecords)

  return booking as BookingRow
}

// ---------------------------------------------------------------
// Confirm a booking after verified webhook (source of truth)
// ---------------------------------------------------------------

export async function confirmBooking(
  bookingId: string,
  paymentIntentId: string,
): Promise<void> {
  const supabase = createAdminClient()

  await supabase
    .from('bookings')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .eq('status', 'processing') // idempotent guard — only confirm from processing state

  // Clear the session cart (booking is now confirmed)
  const { data: booking } = await supabase
    .from('bookings')
    .select('session_id')
    .eq('id', bookingId)
    .single()

  if (booking?.session_id) {
    await clearCart(booking.session_id)
  }
}

// ---------------------------------------------------------------
// Fail a booking after webhook failure
// ---------------------------------------------------------------

export async function failBooking(bookingId: string): Promise<void> {
  const supabase = createAdminClient()

  await supabase
    .from('bookings')
    .update({ status: 'failed' })
    .eq('id', bookingId)
    .in('status', ['pending', 'processing'])
}

// ---------------------------------------------------------------
// Get booking by reference (for customer lookup)
// ---------------------------------------------------------------

export async function getBookingByRef(ref: string): Promise<BookingRow | null> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('bookings')
    .select('*')
    .eq('ref', ref.toUpperCase())
    .maybeSingle()

  return (data as BookingRow | null)
}

// ---------------------------------------------------------------
// Get booking status (for polling on success page)
// ---------------------------------------------------------------

export async function getBookingStatus(
  ref: string,
  email: string,
): Promise<{ status: BookingRow['status']; ref: string } | null> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('bookings')
    .select('status, ref, customers!inner(email)')
    .eq('ref', ref.toUpperCase())
    .eq('customers.email', email.toLowerCase())
    .maybeSingle()

  if (!data) return null
  return { status: data.status as BookingRow['status'], ref: data.ref }
}
