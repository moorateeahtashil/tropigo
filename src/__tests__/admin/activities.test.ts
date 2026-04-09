import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'

// ============ ACTIVITIES ADMIN TESTS ============

const ActivitySchema = z.object({
  duration_minutes: z.preprocess((v) => v === '' ? null : Number(v), z.number().int().positive().nullable()).optional(),
  tour_type: z.enum(['private', 'group', 'shared']).optional().nullable(),
  transportation: z.string().optional().nullable(),
  pickup_location: z.string().optional().nullable(),
  pickup_time: z.string().optional().nullable(),
  min_participants: z.preprocess((v) => v === '' ? 1 : Number(v), z.number().int().min(1)).default(1),
  max_participants: z.preprocess((v) => v === '' ? null : Number(v), z.number().int().nullable()),
  difficulty_level: z.enum(['easy', 'moderate', 'challenging']).optional().nullable(),
  included_items: z.array(z.string()).default([]),
  excluded_items: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
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
  base_price: z.preprocess((v) => (v === '' || v === null ? null : Number(v)), z.number().nonnegative().nullable()),
  featured: z.boolean().default(false),
  position: z.number().int().min(0).default(0),
  destination_id: z.string().uuid().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

describe('Activities — Schema Validation', () => {
  describe('ActivitySchema', () => {
    it('should accept a complete activity', () => {
      const valid = {
        duration_minutes: 240,
        tour_type: 'private' as const,
        transportation: 'Minibus',
        pickup_location: 'Hotel',
        pickup_time: '07:30',
        min_participants: 2,
        max_participants: 20,
        difficulty_level: 'moderate' as const,
        included_items: ['Guide', 'Lunch'],
        excluded_items: ['Drinks'],
        highlights: ['Scenic views', 'Wildlife'],
        important_notes: 'Bring hat',
      }
      expect(ActivitySchema.parse(valid)).toEqual(valid)
    })

    it('should accept minimal activity', () => {
      const minimal = { max_participants: null }
      const result = ActivitySchema.parse(minimal)
      expect(result.min_participants).toBe(1)
      expect(result.included_items).toEqual([])
      expect(result.excluded_items).toEqual([])
      expect(result.highlights).toEqual([])
    })

    it('should coerce empty duration to null', () => {
      const result = ActivitySchema.parse({ duration_minutes: '', max_participants: null })
      expect(result.duration_minutes).toBeNull()
    })

    it('should reject negative duration', () => {
      expect(() => ActivitySchema.parse({ duration_minutes: -5 })).toThrow()
    })

    it('should reject invalid tour_type', () => {
      expect(() => ActivitySchema.parse({ tour_type: 'luxury' })).toThrow()
    })

    it('should accept all valid tour_types', () => {
      expect(ActivitySchema.parse({ tour_type: 'private', max_participants: null }).tour_type).toBe('private')
      expect(ActivitySchema.parse({ tour_type: 'group', max_participants: null }).tour_type).toBe('group')
      expect(ActivitySchema.parse({ tour_type: 'shared', max_participants: null }).tour_type).toBe('shared')
    })

    it('should reject invalid difficulty_level', () => {
      expect(() => ActivitySchema.parse({ difficulty_level: 'expert' })).toThrow()
    })

    it('should coerce empty max_participants to null', () => {
      const result = ActivitySchema.parse({ max_participants: '' })
      expect(result.max_participants).toBeNull()
    })

    it('should reject zero min_participants', () => {
      expect(() => ActivitySchema.parse({ min_participants: 0 })).toThrow()
    })

    it('should coerce empty min_participants to default 1', () => {
      const result = ActivitySchema.parse({ min_participants: '', max_participants: null })
      expect(result.min_participants).toBe(1)
    })
  })

  describe('ProductSchema for activities', () => {
    it('should accept published activity', () => {
      const valid = {
        slug: 'ile-aux-cerfs-trip',
        title: 'Île aux Cerfs Trip',
        status: 'published' as const,
        base_currency: 'EUR',
        base_price: 89,
        featured: true,
        position: 0,
      }
      const result = ProductSchema.parse(valid)
      expect(result.status).toBe('published')
      expect(result.featured).toBe(true)
    })

    it('should accept draft with no price', () => {
      const result = ProductSchema.parse({ slug: 'draft-trip', title: 'Draft Trip', base_price: null })
      expect(result.status).toBe('draft')
      expect(result.base_price).toBeNull()
    })
  })
})

describe('Activities — FormData parsing', () => {
  function parseActivityFromFormData(data: Record<string, string | null>) {
    const maybe = (v: string | null) => v == null ? null : (v.trim() ? v.trim() : null)
    const splitCSV = (v: string | null) => {
      const s = v == null ? '' : String(v)
      return s.split(',').map(t => t.trim()).filter(Boolean)
    }
    return {
      duration_minutes: Number(data.duration_minutes ?? 0) || null,
      tour_type: maybe(data.tour_type ?? null),
      transportation: maybe(data.transportation ?? null),
      pickup_location: maybe(data.pickup_location ?? null),
      pickup_time: maybe(data.pickup_time ?? null),
      min_participants: Number(data.min_participants ?? 1) || 1,
      max_participants: Number(data.max_participants ?? 0) || null,
      difficulty_level: maybe(data.difficulty_level ?? null),
      included_items: splitCSV(data.included_items ?? null),
      excluded_items: splitCSV(data.excluded_items ?? null),
      highlights: splitCSV(data.highlights ?? null),
      important_notes: maybe(data.important_notes ?? null),
    }
  }

  it('should parse complete activity from form data', () => {
    const data = {
      duration_minutes: '240',
      tour_type: 'private',
      transportation: 'Minibus',
      pickup_location: 'Hotel lobby',
      pickup_time: '07:30',
      min_participants: '2',
      max_participants: '20',
      difficulty_level: 'moderate',
      included_items: 'Guide, Lunch, Equipment',
      excluded_items: 'Alcohol, Tips',
      highlights: 'Scenic views, Wildlife, Beach',
      important_notes: 'Bring sunscreen and hat',
    }
    const result = parseActivityFromFormData(data)
    expect(result.duration_minutes).toBe(240)
    expect(result.tour_type).toBe('private')
    expect(result.included_items).toEqual(['Guide', 'Lunch', 'Equipment'])
    expect(result.highlights).toEqual(['Scenic views', 'Wildlife', 'Beach'])
  })

  it('should handle missing optional fields', () => {
    const data = {
      duration_minutes: '',
      tour_type: '',
      transportation: '',
      pickup_location: '',
      pickup_time: '',
      min_participants: '1',
      difficulty_level: '',
      included_items: '',
      excluded_items: '',
      highlights: '',
      important_notes: '',
    }
    const result = parseActivityFromFormData(data)
    expect(result.duration_minutes).toBeNull()
    expect(result.tour_type).toBeNull()
    expect(result.included_items).toEqual([])
  })
})
