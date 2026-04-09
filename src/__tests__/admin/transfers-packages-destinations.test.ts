import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// ============ TRANSFERS ADMIN TESTS ============

const TransferSchema = z.object({
  pricing_model: z.enum(['fixed', 'zone_based', 'distance_based']).default('fixed'),
  vehicle_type: z.enum(['sedan', 'minivan', 'bus', 'luxury']).default('sedan'),
  max_passengers: z.number().int().min(1).default(4),
  max_luggage: z.number().int().min(0).nullable().default(null),
  includes_meet_greet: z.boolean().default(false),
  includes_flight_tracking: z.boolean().default(false),
  base_fare: z.preprocess((v) => v === '' ? null : Number(v), z.number().nonnegative().nullable()),
  per_km_rate: z.preprocess((v) => v === '' ? null : Number(v), z.number().nonnegative().nullable()),
  waiting_fee_per_hour: z.preprocess((v) => v === '' ? null : Number(v), z.number().nonnegative().nullable()),
  notes: z.string().optional().nullable(),
})

describe('Transfers — Schema Validation', () => {
  it('should accept a complete transfer', () => {
    const valid = {
      pricing_model: 'zone_based' as const,
      vehicle_type: 'minivan' as const,
      max_passengers: 6,
      max_luggage: 8,
      includes_meet_greet: true,
      includes_flight_tracking: true,
      base_fare: 30,
      per_km_rate: 1.50,
      waiting_fee_per_hour: 25,
      notes: '30 min free waiting',
    }
    expect(TransferSchema.parse(valid)).toEqual(valid)
  })

  it('should use defaults for minimal transfer', () => {
    const minimal = { base_fare: null, per_km_rate: null, waiting_fee_per_hour: null }
    const result = TransferSchema.parse(minimal)
    expect(result.pricing_model).toBe('fixed')
    expect(result.vehicle_type).toBe('sedan')
    expect(result.max_passengers).toBe(4)
    expect(result.max_luggage).toBeNull()
    expect(result.includes_meet_greet).toBe(false)
    expect(result.includes_flight_tracking).toBe(false)
  })

  it('should accept all pricing models', () => {
    expect(TransferSchema.parse({ pricing_model: 'fixed', base_fare: null, per_km_rate: null, waiting_fee_per_hour: null }).pricing_model).toBe('fixed')
    expect(TransferSchema.parse({ pricing_model: 'zone_based', base_fare: null, per_km_rate: null, waiting_fee_per_hour: null }).pricing_model).toBe('zone_based')
    expect(TransferSchema.parse({ pricing_model: 'distance_based', base_fare: null, per_km_rate: null, waiting_fee_per_hour: null }).pricing_model).toBe('distance_based')
  })

  it('should accept all vehicle types', () => {
    const vehicles = ['sedan', 'minivan', 'bus', 'luxury'] as const
    vehicles.forEach((v) => {
      expect(TransferSchema.parse({ vehicle_type: v, base_fare: null, per_km_rate: null, waiting_fee_per_hour: null }).vehicle_type).toBe(v)
    })
  })

  it('should reject invalid pricing model', () => {
    expect(() => TransferSchema.parse({ pricing_model: 'hourly', base_fare: null, per_km_rate: null, waiting_fee_per_hour: null })).toThrow()
  })

  it('should reject zero max_passengers', () => {
    expect(() => TransferSchema.parse({ max_passengers: 0, base_fare: null, per_km_rate: null, waiting_fee_per_hour: null })).toThrow()
  })

  it('should reject negative base_fare', () => {
    expect(() => TransferSchema.parse({ base_fare: -10, per_km_rate: null, waiting_fee_per_hour: null })).toThrow()
  })

  it('should reject negative per_km_rate', () => {
    expect(() => TransferSchema.parse({ base_fare: null, per_km_rate: -1, waiting_fee_per_hour: null })).toThrow()
  })

  it('should coerce empty strings to null for numeric fields', () => {
    const result = TransferSchema.parse({ base_fare: '', per_km_rate: '', waiting_fee_per_hour: '' })
    expect(result.base_fare).toBeNull()
    expect(result.per_km_rate).toBeNull()
    expect(result.waiting_fee_per_hour).toBeNull()
  })

  it('should allow zero base_fare', () => {
    const result = TransferSchema.parse({ base_fare: 0, per_km_rate: null, waiting_fee_per_hour: null })
    expect(result.base_fare).toBe(0)
  })
})

// ============ PACKAGES ADMIN TESTS ============

const PackageSchema = z.object({
  pricing_mode: z.enum(['fixed', 'computed', 'computed_with_discount']).default('computed'),
  discount_percent: z.preprocess((v) => (v === '' || v === undefined ? 0 : Number(v)), z.number().min(0).max(100)).default(0),
  duration_days: z.preprocess((v) => {
    if (v === undefined || v === null || v === '') return null
    return Number(v)
  }, z.number().int().positive().nullable()).default(null),
  highlights: z.array(z.string()).default([]),
  important_notes: z.string().optional().nullable(),
  own_price: z.preprocess((v) => {
    if (v === undefined || v === null || v === '') return null
    return Number(v)
  }, z.number().nonnegative().nullable()).default(null),
  start_time: z.string().optional().nullable(),
  own_availability: z.preprocess((v) => {
    if (typeof v === 'string') {
      try { return JSON.parse(v) } catch { return {} }
    }
    return v ?? {}
  }, z.record(z.unknown())).default({}),
})

describe('Packages — Schema Validation', () => {
  it('should accept a complete package', () => {
    const valid = {
      pricing_mode: 'computed_with_discount' as const,
      discount_percent: 15,
      duration_days: 3,
      highlights: ['Trip 1', 'Trip 2'],
      important_notes: 'Flexible scheduling',
      own_price: 250,
      start_time: '07:00',
      own_availability: { days_of_week: [1, 2, 3, 4, 5] },
    }
    expect(PackageSchema.parse(valid)).toEqual(valid)
  })

  it('should use defaults for minimal package', () => {
    const minimal = {}
    const result = PackageSchema.parse(minimal)
    expect(result.pricing_mode).toBe('computed')
    expect(result.discount_percent).toBe(0)
    expect(result.duration_days).toBeNull()
    expect(result.highlights).toEqual([])
    expect(result.own_price).toBeNull()
  })

  it('should accept all pricing modes', () => {
    expect(PackageSchema.parse({ pricing_mode: 'fixed' }).pricing_mode).toBe('fixed')
    expect(PackageSchema.parse({ pricing_mode: 'computed' }).pricing_mode).toBe('computed')
    expect(PackageSchema.parse({ pricing_mode: 'computed_with_discount' }).pricing_mode).toBe('computed_with_discount')
  })

  it('should reject discount over 100', () => {
    expect(() => PackageSchema.parse({ discount_percent: 101 })).toThrow()
  })

  it('should reject negative discount', () => {
    expect(() => PackageSchema.parse({ discount_percent: -5 })).toThrow()
  })

  it('should accept zero discount', () => {
    const result = PackageSchema.parse({ discount_percent: 0 })
    expect(result.discount_percent).toBe(0)
  })

  it('should coerce empty discount to 0', () => {
    const result = PackageSchema.parse({ discount_percent: '' })
    expect(result.discount_percent).toBe(0)
  })

  it('should coerce empty duration to null', () => {
    const result = PackageSchema.parse({ duration_days: '' })
    expect(result.duration_days).toBeNull()
  })

  it('should reject zero duration_days', () => {
    expect(() => PackageSchema.parse({ duration_days: 0 })).toThrow()
  })

  it('should coerce empty own_price to null', () => {
    const result = PackageSchema.parse({ own_price: '' })
    expect(result.own_price).toBeNull()
  })

  it('should parse own_availability from JSON string', () => {
    const result = PackageSchema.parse({ own_availability: '{"days_of_week":[1,2,3]}' })
    expect(result.own_availability).toEqual({ days_of_week: [1, 2, 3] })
  })

  it('should handle invalid JSON for own_availability', () => {
    const result = PackageSchema.parse({ own_availability: 'not-json' })
    expect(result.own_availability).toEqual({})
  })
})

// ============ DESTINATIONS ADMIN TESTS ============

const DestinationSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  hero_image_url: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  position: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

describe('Destinations — Schema Validation', () => {
  it('should accept a complete destination', () => {
    const valid = {
      slug: 'grand-baie',
      name: 'Grand Baie',
      summary: 'Vibrant north coast hub',
      description: 'Full description',
      region: 'North',
      hero_image_url: 'https://example.com/image.jpg',
      featured: true,
      position: 0,
      published: true,
    }
    expect(DestinationSchema.parse(valid)).toEqual(valid)
  })

  it('should accept minimal destination', () => {
    const minimal = { slug: 'test', name: 'Test' }
    const result = DestinationSchema.parse(minimal)
    expect(result.featured).toBe(false)
    expect(result.published).toBe(false)
    expect(result.position).toBe(0)
  })

  it('should reject empty slug', () => {
    expect(() => DestinationSchema.parse({ slug: '', name: 'Test' })).toThrow()
  })

  it('should reject empty name', () => {
    expect(() => DestinationSchema.parse({ slug: 'test', name: '' })).toThrow()
  })
})

// ============ SETTINGS ADMIN TESTS ============

const SettingsSchema = z.object({
  brand_name: z.string().min(1),
  tagline: z.string().optional().nullable(),
  contact_email: z.string().email().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  maintenance_mode: z.boolean().default(false),
  default_currency: z.string().length(3).default('EUR'),
  supported_currencies: z.array(z.string().length(3)).min(1),
})

describe('Settings — Schema Validation', () => {
  it('should accept valid settings', () => {
    const valid = {
      brand_name: 'Tropigo',
      tagline: 'Discover Mauritius',
      contact_email: 'hello@tropigo.mu',
      contact_phone: '+230 50000000',
      whatsapp: '+23050000000',
      maintenance_mode: false,
      default_currency: 'EUR',
      supported_currencies: ['EUR', 'USD', 'MUR'],
    }
    expect(SettingsSchema.parse(valid)).toEqual(valid)
  })

  it('should reject invalid email', () => {
    expect(() => SettingsSchema.parse({
      brand_name: 'Test',
      contact_email: 'not-an-email',
      supported_currencies: ['EUR'],
    })).toThrow()
  })

  it('should reject empty supported_currencies', () => {
    expect(() => SettingsSchema.parse({
      brand_name: 'Test',
      supported_currencies: [],
    })).toThrow()
  })

  it('should reject currency not 3 chars', () => {
    expect(() => SettingsSchema.parse({
      brand_name: 'Test',
      supported_currencies: ['EURO'],
    })).toThrow()
  })
})
