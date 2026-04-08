import { createClient } from '@/lib/supabase/server'
import type { TransferZoneRow, TransferHotelRow, TransferZonePriceRow, VehicleType } from '@/types/database'

// ---------------------------------------------------------------
// Resolve which zone a given hotel belongs to
// ---------------------------------------------------------------

export async function getZoneForHotel(
  hotelId: string,
): Promise<TransferZoneRow | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('transfer_hotels')
    .select('zone_id, transfer_zones(*)')
    .eq('id', hotelId)
    .single()

  if (!data?.transfer_zones) return null
  return data.transfer_zones as unknown as TransferZoneRow
}

// ---------------------------------------------------------------
// Lookup zone-based price
// ---------------------------------------------------------------

export async function getZonePrice(params: {
  transferId: string
  fromZoneId: string
  toZoneId: string
  vehicleType: VehicleType
}): Promise<number | null> {
  const supabase = await createClient()

  // Try exact vehicle match first
  const { data: exact } = await supabase
    .from('transfer_zone_prices')
    .select('price')
    .eq('transfer_id', params.transferId)
    .eq('from_zone_id', params.fromZoneId)
    .eq('to_zone_id', params.toZoneId)
    .eq('vehicle_type', params.vehicleType)
    .maybeSingle()

  if (exact) return exact.price

  // Fall back to any vehicle type (null vehicle_type = applies to all)
  const { data: fallback } = await supabase
    .from('transfer_zone_prices')
    .select('price')
    .eq('transfer_id', params.transferId)
    .eq('from_zone_id', params.fromZoneId)
    .eq('to_zone_id', params.toZoneId)
    .is('vehicle_type', null)
    .maybeSingle()

  return fallback?.price ?? null
}

// ---------------------------------------------------------------
// Get all zones (for hotel/location selector UI)
// ---------------------------------------------------------------

export async function getTransferZones(): Promise<TransferZoneRow[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('transfer_zones')
    .select('*')
    .order('sort_order', { ascending: true })

  return (data ?? []) as TransferZoneRow[]
}

// ---------------------------------------------------------------
// Get hotels (for location typeahead)
// ---------------------------------------------------------------

export async function getTransferHotels(): Promise<TransferHotelRow[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('transfer_hotels')
    .select('*')
    .eq('published', true)
    .order('name', { ascending: true })

  return (data ?? []) as TransferHotelRow[]
}

// ---------------------------------------------------------------
// Get all zone prices for a transfer (for admin zone editor)
// ---------------------------------------------------------------

export async function getZonePricesForTransfer(
  transferId: string,
): Promise<TransferZonePriceRow[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('transfer_zone_prices')
    .select('*')
    .eq('transfer_id', transferId)
    .order('from_zone_id', { ascending: true })

  return (data ?? []) as TransferZonePriceRow[]
}

// ---------------------------------------------------------------
// Compute distance-based price
// ---------------------------------------------------------------

export function computeDistanceBasedPrice(params: {
  baseFare: number
  perKmRate: number
  distanceKm: number
  waitingHours?: number
  waitingFeePerHour?: number
}): number {
  const base = params.baseFare + params.perKmRate * params.distanceKm
  const waiting = (params.waitingHours ?? 0) * (params.waitingFeePerHour ?? 0)
  return Math.round((base + waiting) * 100) / 100
}
