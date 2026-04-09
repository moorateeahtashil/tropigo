import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// ============ TRIPS ADMIN TESTS ============

// Schemas matching src/app/admin/trips/actions.ts exactly
const TripSchema = z.object({
  trip_mode: z.enum(['guided_tour', 'single_dropoff']).default('guided_tour'),
  trip_type: z.string().optional().nullable(),
  duration_minutes: z.preprocess((v) => v === '' ? null : Number(v), z.number().int().positive().nullable()).optional(),
  vehicle_type: z.string().optional().nullable(),
  max_passengers: z.preprocess((v) => v === '' ? 6 : Number(v), z.number().int().min(1)).default(6),
  pickup_included: z.boolean().default(true),
  pickup_location: z.string().optional().nullable(),
  pickup_time: z.string().optional().nullable(),
  dropoff_location: z.string().optional().nullable(),
  dropoff_included: z.boolean().default(true),
  min_participants: z.preprocess((v) => v === '' ? 1 : Number(v), z.number().int().min(1)).default(1),
  max_participants: z.preprocess((v) => v === '' ? null : Number(v), z.number().int().nullable()),
  difficulty_level: z.enum(['easy', 'moderate', 'challenging']).optional().nullable(),
  included_items: z.array(z.string()).default([]),
  excluded_items: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  itinerary: z.array(z.object({
    time: z.string().optional().nullable(),
    title: z.string(),
    description: z.string().optional().nullable(),
    photo_url: z.string().optional().nullable(),
    duration_minutes: z.number().optional().nullable(),
  })).default([]),
  important_notes: z.string().optional().nullable(),
})

const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  base_currency: z.string().length(3).default('EUR'),
  base_price: z.preprocess((v) => (v === '' || v === null || v === undefined ? null : Number(v)), z.number().nonnegative().nullable()),
  featured: z.boolean().default(false),
  position: z.number().int().min(0).default(0),
  destination_id: z.string().uuid().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

describe('Trips — Schema Validation', () => {
  describe('TripSchema', () => {
    it('should accept a complete guided tour', () => {
      const valid = {
        trip_mode: 'guided_tour' as const,
        trip_type: 'south',
        duration_minutes: 480,
        vehicle_type: 'minivan',
        max_passengers: 6,
        max_participants: 10,
        pickup_included: true,
        pickup_location: 'Hotel lobby',
        pickup_time: '08:00',
        dropoff_location: 'Same as pickup',
        dropoff_included: true,
        min_participants: 1,
        difficulty_level: 'moderate' as const,
        included_items: ['Guide', 'Lunch'],
        excluded_items: ['Drinks'],
        highlights: ['Grand Bassin', 'Chamarel'],
        itinerary: [{ time: '08:00', title: 'Pickup', description: 'Hotel pickup' }],
        important_notes: 'Bring sunscreen',
      }
      expect(TripSchema.parse(valid)).toEqual(valid)
    })

    it('should accept a single dropoff trip with empty itinerary', () => {
      const valid = {
        trip_mode: 'single_dropoff' as const,
        trip_type: 'custom',
        duration_minutes: 60,
        vehicle_type: 'sedan',
        max_passengers: 4,
        max_participants: 0,  // Number(0) || null = 0, not null
        pickup_included: true,
        pickup_location: 'Hotel',
        pickup_time: '09:00',
        dropoff_location: 'Casela',
        dropoff_included: true,
        min_participants: 1,
        included_items: [],
        excluded_items: [],
        highlights: [],
        itinerary: [],
        important_notes: null,
      }
      expect(TripSchema.parse(valid)).toEqual(valid)
    })

    it('should use defaults for optional fields', () => {
      const minimal = {
        trip_mode: 'guided_tour' as const,
        included_items: [],
        excluded_items: [],
        highlights: [],
        itinerary: [],
        max_participants: null,
      }
      const result = TripSchema.parse(minimal)
      expect(result.trip_mode).toBe('guided_tour')
      expect(result.max_passengers).toBe(6)
      expect(result.pickup_included).toBe(true)
      expect(result.dropoff_included).toBe(true)
      expect(result.min_participants).toBe(1)
      expect(result.included_items).toEqual([])
    })

    it('should coerce empty string duration to null', () => {
      const input = { duration_minutes: '', max_participants: null, itinerary: [] }
      const result = TripSchema.parse(input)
      expect(result.duration_minutes).toBeNull()
    })

    it('should coerce empty string max_participants to null', () => {
      const input = { max_participants: '', itinerary: [] }
      const result = TripSchema.parse(input)
      expect(result.max_participants).toBeNull()
    })

    it('should coerce empty string max_passengers to default 6', () => {
      const input = { max_passengers: '', max_participants: 0, itinerary: [] }
      const result = TripSchema.parse(input)
      expect(result.max_passengers).toBe(6)
    })

    it('should reject negative duration', () => {
      expect(() => TripSchema.parse({ duration_minutes: -10, max_participants: 0, itinerary: [] })).toThrow()
    })

    it('should reject zero max_passengers', () => {
      expect(() => TripSchema.parse({ max_passengers: 0, max_participants: 0, itinerary: [] })).toThrow()
    })

    it('should reject invalid difficulty level', () => {
      expect(() => TripSchema.parse({ difficulty_level: 'extreme', max_participants: 0, itinerary: [] })).toThrow()
    })

    it('should reject non-array included_items', () => {
      expect(() => TripSchema.parse({ included_items: 'not-array', max_participants: 0, itinerary: [] })).toThrow()
    })

    it('should reject itinerary with missing title', () => {
      const bad = { itinerary: [{ time: '08:00', description: 'No title' }], max_participants: 0 }
      expect(() => TripSchema.parse(bad)).toThrow()
    })
  })

  describe('ProductSchema', () => {
    it('should accept a complete product', () => {
      const valid = {
        slug: 'my-trip',
        title: 'My Trip',
        subtitle: 'A great trip',
        summary: 'Summary here',
        description: 'Full description',
        status: 'published' as const,
        base_currency: 'EUR',
        base_price: 95,
        featured: true,
        position: 0,
        destination_id: '550e8400-e29b-41d4-a716-446655440000',
      }
      expect(ProductSchema.parse(valid)).toEqual(expect.objectContaining({
        slug: 'my-trip',
        status: 'published',
        base_price: 95,
      }))
    })

    it('should accept minimal product with defaults', () => {
      const minimal = { slug: 'trip', title: 'Trip', base_price: null }
      const result = ProductSchema.parse(minimal)
      expect(result.status).toBe('draft')
      expect(result.base_currency).toBe('EUR')
      expect(result.base_price).toBeNull()
      expect(result.featured).toBe(false)
      expect(result.position).toBe(0)
    })

    it('should coerce empty string base_price to null', () => {
      const result = ProductSchema.parse({ slug: 'trip', title: 'Trip', base_price: '' })
      expect(result.base_price).toBeNull()
    })

    it('should reject negative price', () => {
      expect(() => ProductSchema.parse({ slug: 'trip', title: 'Trip', base_price: -10 })).toThrow()
    })

    it('should reject invalid status', () => {
      expect(() => ProductSchema.parse({ slug: 'trip', title: 'Trip', status: 'deleted' })).toThrow()
    })

    it('should reject slug shorter than 1 char', () => {
      expect(() => ProductSchema.parse({ slug: '', title: 'Trip' })).toThrow()
    })

    it('should reject title shorter than 1 char', () => {
      expect(() => ProductSchema.parse({ slug: 'trip', title: '' })).toThrow()
    })

    it('should accept valid uuid for destination_id', () => {
      const result = ProductSchema.parse({
        slug: 'trip', title: 'Trip', base_price: null,
        destination_id: '550e8400-e29b-41d4-a716-446655440000',
      })
      expect(result.destination_id).toBe('550e8400-e29b-41d4-a716-446655440000')
    })

    it('should reject invalid uuid for destination_id', () => {
      expect(() => ProductSchema.parse({
        slug: 'trip', title: 'Trip', base_price: null,
        destination_id: 'not-a-uuid',
      })).toThrow()
    })
  })
})

describe('Trips — FormData parsing', () => {
  function parseTripFromFormData(data: Record<string, string | null>) {
    const maybe = (v: string | null) => v == null ? null : (v.trim() ? v.trim() : null)
    const splitCSV = (v: string | null) => {
      const s = v == null ? '' : String(v)
      return s.split(',').map(t => t.trim()).filter(Boolean)
    }
    return {
      trip_mode: (data.trip_mode === 'single_dropoff' ? 'single_dropoff' : 'guided_tour') as const,
      trip_type: maybe(data.trip_type ?? null),
      duration_minutes: Number(data.duration_minutes ?? 0) || null,
      vehicle_type: maybe(data.vehicle_type ?? null),
      max_passengers: Number(data.max_passengers ?? 6),
      pickup_included: data.pickup_included === 'on',
      pickup_location: maybe(data.pickup_location ?? null),
      pickup_time: maybe(data.pickup_time ?? null),
      dropoff_location: maybe(data.dropoff_location ?? null),
      dropoff_included: data.dropoff_included === 'on',
      min_participants: Number(data.min_participants ?? 1) || 1,
      max_participants: Number(data.max_participants ?? 0) || null,
      difficulty_level: maybe(data.difficulty_level ?? null),
      included_items: splitCSV(data.included_items ?? null),
      excluded_items: splitCSV(data.excluded_items ?? null),
      highlights: splitCSV(data.highlights ?? null),
      itinerary: data.itinerary ? JSON.parse(data.itinerary) : [],
      important_notes: maybe(data.important_notes ?? null),
    }
  }

  it('should parse a guided tour from FormData-like values', () => {
    const data = {
      trip_mode: 'guided_tour',
      trip_type: 'south',
      duration_minutes: '480',
      vehicle_type: 'minivan',
      max_passengers: '6',
      pickup_included: 'on',
      pickup_location: 'Hotel',
      pickup_time: '08:00',
      dropoff_included: 'on',
      min_participants: '1',
      max_participants: '10',
      difficulty_level: 'moderate',
      included_items: 'Guide, Lunch, Water',
      excluded_items: 'Drinks, Tips',
      highlights: 'Grand Bassin, Chamarel',
      itinerary: JSON.stringify([{ time: '08:00', title: 'Pickup' }]),
      important_notes: 'Bring sunscreen',
    }
    const result = parseTripFromFormData(data)
    expect(result.trip_mode).toBe('guided_tour')
    expect(result.duration_minutes).toBe(480)
    expect(result.included_items).toEqual(['Guide', 'Lunch', 'Water'])
    expect(result.itinerary).toEqual([{ time: '08:00', title: 'Pickup' }])
  })

  it('should parse a single dropoff from FormData-like values', () => {
    const data = {
      trip_mode: 'single_dropoff',
      trip_type: 'custom',
      duration_minutes: '60',
      vehicle_type: 'sedan',
      max_passengers: '4',
      pickup_included: 'on',
      pickup_location: 'Hotel',
      pickup_time: '09:00',
      dropoff_location: 'Casela',
      dropoff_included: 'on',
      included_items: 'Transport, Water',
      excluded_items: 'Entrance fees',
      highlights: 'Door to door',
      itinerary: '[]',
    }
    const result = parseTripFromFormData(data)
    expect(result.trip_mode).toBe('single_dropoff')
    expect(result.dropoff_location).toBe('Casela')
    expect(result.itinerary).toEqual([])
  })

  it('should handle missing optional fields', () => {
    const data = {
      trip_mode: 'guided_tour',
      included_items: '',
      excluded_items: '',
      highlights: '',
      itinerary: '[]',
      important_notes: '',
    }
    const result = parseTripFromFormData(data)
    expect(result.trip_type).toBeNull()
    expect(result.duration_minutes).toBeNull()
    expect(result.included_items).toEqual([])
    expect(result.important_notes).toBeNull()
  })

  it('should handle empty pickup checkbox (not "on")', () => {
    const data = {
      trip_mode: 'guided_tour',
      pickup_included: '',
      dropoff_included: '',
      included_items: '',
      excluded_items: '',
      highlights: '',
      itinerary: '[]',
    }
    const result = parseTripFromFormData(data)
    expect(result.pickup_included).toBe(false)
    expect(result.dropoff_included).toBe(false)
  })
})
