// =============================================================
// TROPIGO — Database Types
// Hand-authored to match supabase/migrations/20260408000000_clean_rebuild.sql
// =============================================================

export type ProductType = 'airport_transfer' | 'activity' | 'package'
export type ProductStatus = 'draft' | 'published' | 'archived'
export type BookingStatus = 'draft' | 'pending' | 'processing' | 'confirmed' | 'cancelled' | 'failed' | 'refunded'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'
export type PaymentProvider = 'stripe' | 'paypal' | 'manual'
export type TransferPricingModel = 'fixed' | 'zone_based' | 'distance_based'
export type PackagePricingMode = 'fixed' | 'computed' | 'computed_with_discount'
export type VehicleType = 'sedan' | 'minivan' | 'bus' | 'luxury'
export type LocationType = 'airport' | 'hotel' | 'address' | 'custom'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export type MediaType = 'image' | 'video'

// ---------------------------------------------------------------
// Row types — exact schema match
// ---------------------------------------------------------------

export interface ProfileRow {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface DestinationRow {
  id: string
  slug: string
  name: string
  summary: string | null
  description: string | null
  region: string | null
  hero_image_url: string | null
  gallery_urls: string[]
  lat: number | null
  lng: number | null
  featured: boolean
  position: number
  seo_title: string | null
  seo_description: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface TransferZoneRow {
  id: string
  name: string
  description: string | null
  color: string
  sort_order: number
  created_at: string
}

export interface ProductRow {
  id: string
  product_type: ProductType
  slug: string
  title: string
  subtitle: string | null
  summary: string | null
  description: string | null
  status: ProductStatus
  base_currency: string
  base_price: number | null
  featured: boolean
  position: number
  seo_title: string | null
  seo_description: string | null
  seo_image_url: string | null
  canonical_url: string | null
  noindex: boolean
  created_at: string
  updated_at: string
}

export interface ActivityRow {
  product_id: string
  duration_minutes: number | null
  tour_type: 'private' | 'group' | 'shared' | null
  transportation: string | null
  pickup_location: string | null
  pickup_time: string | null
  min_participants: number
  max_participants: number | null
  difficulty_level: 'easy' | 'moderate' | 'challenging' | null
  included_items: string[]
  excluded_items: string[]
  highlights: string[]
  itinerary: ItineraryStep[]
  important_notes: string | null
  destination_id: string | null
  created_at: string
  updated_at: string
}

export interface ItineraryStep {
  time: string
  title: string
  description: string
}

export interface AirportTransferRow {
  product_id: string
  pricing_model: TransferPricingModel
  vehicle_type: VehicleType
  max_passengers: number
  max_luggage: number | null
  includes_meet_greet: boolean
  includes_flight_tracking: boolean
  base_fare: number | null
  per_km_rate: number | null
  waiting_fee_per_hour: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PackageRow {
  product_id: string
  pricing_mode: PackagePricingMode
  discount_percent: number
  duration_days: number | null
  highlights: string[]
  important_notes: string | null
  created_at: string
  updated_at: string
}

export interface PackageItemRow {
  id: string
  package_id: string
  product_id: string
  sort_order: number
  is_optional: boolean
  is_default_selected: boolean
  quantity: number
  price_override: number | null
  notes: string | null
  created_at: string
}

export interface ProductMediaRow {
  id: string
  product_id: string
  url: string
  alt: string | null
  media_type: MediaType
  is_cover: boolean
  sort_order: number
  created_at: string
}

export interface ProductPricingRow {
  id: string
  product_id: string
  currency: string
  price: number
  created_at: string
  updated_at: string
}

export interface CurrencyRateRow {
  id: string
  from_currency: string
  to_currency: string
  rate: number
  fetched_at: string
}

export interface TransferZonePriceRow {
  id: string
  transfer_id: string
  from_zone_id: string
  to_zone_id: string
  vehicle_type: VehicleType | null
  price: number
  created_at: string
  updated_at: string
}

export interface TransferHotelRow {
  id: string
  name: string
  zone_id: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  published: boolean
  created_at: string
}

export interface AvailabilityRuleRow {
  id: string
  product_id: string
  rule_type: 'blackout' | 'schedule' | 'cutoff'
  start_date: string | null
  end_date: string | null
  days_of_week: number[]
  min_advance_hours: number
  max_advance_days: number | null
  notes: string | null
  created_at: string
}

export interface CustomerRow {
  id: string
  supabase_user_id: string | null
  email: string
  first_name: string
  last_name: string
  phone: string | null
  country: string | null
  created_at: string
  updated_at: string
}

export interface BookingSessionRow {
  id: string
  currency: string
  customer_email: string | null
  exchange_rates_snapshot: Record<string, number>
  metadata: Record<string, unknown>
  expires_at: string
  created_at: string
  updated_at: string
}

export interface CartItemRow {
  id: string
  session_id: string
  product_id: string
  product_type: ProductType
  quantity: number
  unit_price: number
  currency: string
  exchange_rate: number
  price_snapshot: CartPriceSnapshot
  booking_date: string | null
  booking_time: string | null
  special_requirements: string | null
  created_at: string
}

export interface CartPriceSnapshot {
  product_title: string
  base_price: number
  base_currency: string
  display_price: number
  display_currency: string
  exchange_rate: number
  override_used: boolean
  product_summary: string | null
  cover_image_url: string | null
  transfer_details?: {
    from_zone_id?: string
    to_zone_id?: string
    vehicle_type?: string | null
    pickup?: string | null
    dropoff?: string | null
    pickup_datetime?: string | null
    passenger_count?: number | null
    luggage_count?: number | null
    flight_number?: string | null
  }
}

export interface BookingRow {
  id: string
  ref: string
  session_id: string | null
  customer_id: string | null
  status: BookingStatus
  currency: string
  subtotal: number
  total_amount: number
  exchange_rate_snapshot: Record<string, number>
  special_requirements: string | null
  internal_notes: string | null
  confirmed_at: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
}

export interface BookingItemRow {
  id: string
  booking_id: string
  product_id: string | null
  product_type: ProductType
  product_title: string
  quantity: number
  unit_price: number
  total_price: number
  currency: string
  booking_date: string | null
  booking_time: string | null
  snapshot: Record<string, unknown>
  created_at: string
}

export interface BookingTravellerRow {
  id: string
  booking_id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  date_of_birth: string | null
  nationality: string | null
  passport_number: string | null
  is_lead_traveller: boolean
  special_requirements: string | null
  created_at: string
}

export interface TransferBookingDetailRow {
  id: string
  booking_item_id: string
  pickup_type: LocationType
  dropoff_type: LocationType
  pickup_location: string
  dropoff_location: string
  pickup_datetime: string
  passenger_count: number
  luggage_count: number | null
  flight_number: string | null
  special_instructions: string | null
  created_at: string
}

export interface PaymentRow {
  id: string
  booking_id: string
  provider: PaymentProvider
  provider_session_id: string | null
  provider_payment_intent_id: string | null
  status: PaymentStatus
  amount: number
  currency: string
  provider_fee: number | null
  metadata: Record<string, unknown>
  paid_at: string | null
  refunded_at: string | null
  created_at: string
  updated_at: string
}

export interface ReviewRow {
  id: string
  product_id: string
  booking_id: string | null
  customer_id: string | null
  author_name: string
  author_email: string | null
  rating: number
  title: string | null
  body: string
  status: ReviewStatus
  admin_reply: string | null
  helpful_count: number
  verified_booking: boolean
  created_at: string
  updated_at: string
}

export interface EnquiryRow {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  related_product_id: string | null
  status: 'new' | 'in_progress' | 'resolved' | 'archived'
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface SettingsRow {
  id: string
  brand_name: string
  tagline: string | null
  logo_url: string | null
  favicon_url: string | null
  contact_email: string | null
  contact_phone: string | null
  whatsapp: string | null
  address: {
    street?: string
    city?: string
    region?: string
    country?: string
  }
  socials: {
    instagram?: string
    facebook?: string
    twitter?: string
    tripadvisor?: string
  }
  supported_currencies: string[]
  default_currency: string
  ga4_id: string | null
  default_seo_title: string | null
  default_seo_description: string | null
  default_og_image_url: string | null
  maintenance_mode: boolean
  created_at: string
  updated_at: string
}

export interface PageRow {
  id: string
  slug: string
  title: string
  content: string | null
  seo_title: string | null
  seo_description: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface LegalPageRow {
  id: string
  slug: string
  title: string
  content: string
  version: string | null
  effective_date: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface FaqRow {
  id: string
  category: string
  question: string
  answer: string
  position: number
  related_product_id: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface TestimonialRow {
  id: string
  author_name: string
  author_location: string | null
  quote: string
  rating: number | null
  photo_url: string | null
  related_product_id: string | null
  position: number
  published: boolean
  created_at: string
}

export interface PromoBannerRow {
  id: string
  title: string
  body: string | null
  cta_label: string | null
  cta_url: string | null
  placement: 'sitewide_top' | 'homepage_hero' | 'footer' | 'inline'
  background_color: string
  text_color: string
  start_at: string | null
  end_at: string | null
  active: boolean
  priority: number
  created_at: string
}

export interface NavigationMenuRow {
  id: string
  key: string
  label: string
  created_at: string
}

export interface NavigationItemRow {
  id: string
  menu_id: string
  parent_id: string | null
  label: string
  href: string
  link_type: 'internal' | 'external' | 'anchor'
  open_in_new_tab: boolean
  position: number
  visible: boolean
  created_at: string
}

export interface HomepageSectionRow {
  id: string
  section_type: 'hero' | 'transfers_cta' | 'featured_activities' | 'featured_packages' | 'destinations' | 'testimonials' | 'promo' | 'faqs' | 'stats' | 'custom'
  title: string | null
  subtitle: string | null
  data: Record<string, unknown>
  position: number
  published: boolean
  created_at: string
  updated_at: string
}
