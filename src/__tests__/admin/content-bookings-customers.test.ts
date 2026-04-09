import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// ============ FAQ ADMIN TESTS ============

const FaqSchema = z.object({
  category: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  position: z.number().int().min(0).default(0),
  related_product_id: z.string().uuid().optional().nullable(),
  published: z.boolean().default(false),
})

describe('FAQs — Schema Validation', () => {
  it('should accept a complete FAQ', () => {
    const valid = {
      category: 'booking',
      question: 'How do I book?',
      answer: 'Through our website.',
      position: 0,
      related_product_id: '550e8400-e29b-41d4-a716-446655440000',
      published: true,
    }
    expect(FaqSchema.parse(valid)).toEqual(valid)
  })

  it('should accept minimal FAQ', () => {
    const minimal = { category: 'general', question: 'Q?', answer: 'A.' }
    const result = FaqSchema.parse(minimal)
    expect(result.position).toBe(0)
    expect(result.published).toBe(false)
  })

  it('should reject empty question', () => {
    expect(() => FaqSchema.parse({ category: 'general', question: '', answer: 'A.' })).toThrow()
  })

  it('should reject empty answer', () => {
    expect(() => FaqSchema.parse({ category: 'general', question: 'Q?', answer: '' })).toThrow()
  })

  it('should reject invalid UUID for related_product_id', () => {
    expect(() => FaqSchema.parse({
      category: 'general', question: 'Q?', answer: 'A.',
      related_product_id: 'not-a-uuid',
    })).toThrow()
  })

  it('should accept null related_product_id', () => {
    const result = FaqSchema.parse({
      category: 'general', question: 'Q?', answer: 'A.',
      related_product_id: null,
    })
    expect(result.related_product_id).toBeNull()
  })
})

// ============ TESTIMONIALS ADMIN TESTS ============

const TestimonialSchema = z.object({
  author_name: z.string().min(1),
  author_location: z.string().optional().nullable(),
  quote: z.string().min(1),
  rating: z.preprocess((v) => (v === '' || v === undefined ? null : Number(v)), z.number().min(1).max(5).nullable()),
  photo_url: z.string().optional().nullable(),
  related_product_id: z.string().uuid().optional().nullable(),
  position: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
})

describe('Testimonials — Schema Validation', () => {
  it('should accept a complete testimonial', () => {
    const valid = {
      author_name: 'Jane Doe',
      author_location: 'Paris, France',
      quote: 'Amazing experience!',
      rating: 5,
      photo_url: 'https://example.com/photo.jpg',
      related_product_id: '550e8400-e29b-41d4-a716-446655440000',
      position: 0,
      published: true,
    }
    expect(TestimonialSchema.parse(valid)).toEqual(valid)
  })

  it('should accept minimal testimonial', () => {
    const minimal = { author_name: 'John', quote: 'Great!' }
    const result = TestimonialSchema.parse(minimal)
    expect(result.rating).toBeNull()
    expect(result.position).toBe(0)
    expect(result.published).toBe(false)
  })

  it('should reject rating below 1', () => {
    expect(() => TestimonialSchema.parse({ author_name: 'J', quote: 'G', rating: 0 })).toThrow()
  })

  it('should reject rating above 5', () => {
    expect(() => TestimonialSchema.parse({ author_name: 'J', quote: 'G', rating: 6 })).toThrow()
  })

  it('should coerce empty rating to null', () => {
    const result = TestimonialSchema.parse({ author_name: 'J', quote: 'G', rating: '' })
    expect(result.rating).toBeNull()
  })

  it('should accept all valid ratings 1-5', () => {
    [1, 2, 3, 4, 5].forEach(r => {
      expect(TestimonialSchema.parse({ author_name: 'J', quote: 'G', rating: r }).rating).toBe(r)
    })
  })
})

// ============ PROMO BANNERS ADMIN TESTS ============

const PromoSchema = z.object({
  title: z.string().min(1),
  body: z.string().optional().nullable(),
  cta_label: z.string().optional().nullable(),
  cta_url: z.string().optional().nullable(),
  placement: z.enum(['sitewide_top', 'homepage_hero', 'footer', 'inline']).default('inline'),
  background_color: z.string().default('#FFFFFF'),
  text_color: z.string().default('#000000'),
  start_at: z.string().optional().nullable(),
  end_at: z.string().optional().nullable(),
  active: z.boolean().default(false),
  priority: z.number().int().default(0),
})

describe('Promos — Schema Validation', () => {
  it('should accept a complete promo banner', () => {
    const valid = {
      title: 'Summer Sale',
      body: 'Get 20% off',
      cta_label: 'Book Now',
      cta_url: '/trips',
      placement: 'homepage_hero' as const,
      background_color: '#FF5722',
      text_color: '#FFFFFF',
      start_at: '2026-06-01',
      end_at: '2026-08-31',
      active: true,
      priority: 1,
    }
    expect(PromoSchema.parse(valid)).toEqual(valid)
  })

  it('should accept minimal promo', () => {
    const minimal = { title: 'Promo' }
    const result = PromoSchema.parse(minimal)
    expect(result.placement).toBe('inline')
    expect(result.active).toBe(false)
    expect(result.priority).toBe(0)
  })

  it('should reject empty title', () => {
    expect(() => PromoSchema.parse({ title: '' })).toThrow()
  })

  it('should reject invalid placement', () => {
    expect(() => PromoSchema.parse({ title: 'T', placement: 'popup' })).toThrow()
  })

  it('should accept all valid placements', () => {
    const placements = ['sitewide_top', 'homepage_hero', 'footer', 'inline'] as const
    placements.forEach(p => {
      expect(PromoSchema.parse({ title: 'T', placement: p }).placement).toBe(p)
    })
  })
})

// ============ STATIC PAGES ADMIN TESTS ============

const PageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().optional().nullable(),
  published: z.boolean().default(false),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

describe('Static Pages — Schema Validation', () => {
  it('should accept a complete page', () => {
    const valid = {
      slug: 'about-us',
      title: 'About Us',
      content: '# About Us\nWe are...',
      published: true,
      seo_title: 'About Tropigo',
      seo_description: 'Learn about our team',
    }
    expect(PageSchema.parse(valid)).toEqual(valid)
  })

  it('should accept minimal page', () => {
    const minimal = { slug: 'test', title: 'Test' }
    const result = PageSchema.parse(minimal)
    expect(result.published).toBe(false)
    expect(result.content).toBeUndefined()
  })

  it('should reject empty slug', () => {
    expect(() => PageSchema.parse({ slug: '', title: 'Test' })).toThrow()
  })

  it('should reject empty title', () => {
    expect(() => PageSchema.parse({ slug: 'test', title: '' })).toThrow()
  })
})

// ============ LEGAL PAGES ADMIN TESTS ============

const LegalPageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  version: z.string().optional().nullable(),
  effective_date: z.string().optional().nullable(),
  published: z.boolean().default(false),
})

describe('Legal Pages — Schema Validation', () => {
  it('should accept a complete legal page', () => {
    const valid = {
      slug: 'terms',
      title: 'Terms & Conditions',
      content: '# Terms\nAll bookings...',
      version: '2.0',
      effective_date: '2026-04-01',
      published: true,
    }
    expect(LegalPageSchema.parse(valid)).toEqual(valid)
  })

  it('should reject empty content', () => {
    expect(() => LegalPageSchema.parse({ slug: 't', title: 'T', content: '' })).toThrow()
  })

  it('should accept null version', () => {
    const result = LegalPageSchema.parse({ slug: 't', title: 'T', content: 'Content', version: null })
    expect(result.version).toBeNull()
  })
})

// ============ ENQUIRIES ADMIN TESTS ============

const EnquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  message: z.string().min(1),
  related_product_id: z.string().uuid().optional().nullable(),
  status: z.enum(['new', 'in_progress', 'resolved', 'archived']).default('new'),
  admin_notes: z.string().optional().nullable(),
})

describe('Enquiries — Schema Validation', () => {
  it('should accept a complete enquiry', () => {
    const valid = {
      name: 'Jane',
      email: 'jane@example.com',
      phone: '+23050000000',
      subject: 'Booking question',
      message: 'Is the trip available on Sundays?',
      related_product_id: '550e8400-e29b-41d4-a716-446655440000',
      status: 'in_progress' as const,
      admin_notes: 'Replied via email',
    }
    expect(EnquirySchema.parse(valid)).toEqual(valid)
  })

  it('should accept minimal enquiry', () => {
    const minimal = { name: 'J', email: 'j@test.com', message: 'Hi' }
    const result = EnquirySchema.parse(minimal)
    expect(result.status).toBe('new')
  })

  it('should reject invalid email', () => {
    expect(() => EnquirySchema.parse({ name: 'J', email: 'bad', message: 'Hi' })).toThrow()
  })

  it('should reject empty message', () => {
    expect(() => EnquirySchema.parse({ name: 'J', email: 'j@test.com', message: '' })).toThrow()
  })

  it('should reject invalid status', () => {
    expect(() => EnquirySchema.parse({ name: 'J', email: 'j@test.com', message: 'Hi', status: 'closed' })).toThrow()
  })

  it('should accept all valid statuses', () => {
    const statuses = ['new', 'in_progress', 'resolved', 'archived'] as const
    statuses.forEach(s => {
      expect(EnquirySchema.parse({ name: 'J', email: 'j@test.com', message: 'Hi', status: s }).status).toBe(s)
    })
  })
})

// ============ REVIEWS ADMIN TESTS ============

const ReviewSchema = z.object({
  product_id: z.string().uuid(),
  author_name: z.string().min(1),
  author_email: z.string().email().optional().nullable(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional().nullable(),
  body: z.string().min(1),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  admin_reply: z.string().optional().nullable(),
  verified_booking: z.boolean().default(false),
})

describe('Reviews — Schema Validation', () => {
  it('should accept a complete review', () => {
    const valid = {
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      author_name: 'Jane',
      author_email: 'jane@example.com',
      rating: 5,
      title: 'Amazing!',
      body: 'Best trip ever',
      status: 'approved' as const,
      admin_reply: 'Thank you!',
      verified_booking: true,
    }
    expect(ReviewSchema.parse(valid)).toEqual(valid)
  })

  it('should reject invalid rating', () => {
    expect(() => ReviewSchema.parse({ product_id: '550e8400-e29b-41d4-a716-446655440000', author_name: 'J', rating: 6, body: 'B' })).toThrow()
    expect(() => ReviewSchema.parse({ product_id: '550e8400-e29b-41d4-a716-446655440000', author_name: 'J', rating: 0, body: 'B' })).toThrow()
  })

  it('should reject empty body', () => {
    expect(() => ReviewSchema.parse({ product_id: '550e8400-e29b-41d4-a716-446655440000', author_name: 'J', rating: 3, body: '' })).toThrow()
  })

  it('should reject invalid product_id', () => {
    expect(() => ReviewSchema.parse({ product_id: 'bad', author_name: 'J', rating: 3, body: 'B' })).toThrow()
  })

  it('should accept all valid statuses', () => {
    const statuses = ['pending', 'approved', 'rejected'] as const
    statuses.forEach(s => {
      expect(ReviewSchema.parse({ product_id: '550e8400-e29b-41d4-a716-446655440000', author_name: 'J', rating: 3, body: 'B', status: s }).status).toBe(s)
    })
  })
})

// ============ PRICING ADMIN TESTS ============

const PriceOverrideSchema = z.object({
  product_id: z.string().uuid(),
  currency: z.string().length(3),
  price: z.number().min(0),
})

const CurrencyRateSchema = z.object({
  from_currency: z.string().length(3),
  to_currency: z.string().length(3),
  rate: z.number().positive(),
})

describe('Pricing — Schema Validation', () => {
  it('should accept valid price override', () => {
    const valid = {
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      currency: 'USD',
      price: 99.99,
    }
    expect(PriceOverrideSchema.parse(valid)).toEqual(valid)
  })

  it('should reject negative price', () => {
    expect(() => PriceOverrideSchema.parse({
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      currency: 'USD',
      price: -10,
    })).toThrow()
  })

  it('should accept zero price', () => {
    expect(PriceOverrideSchema.parse({
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      currency: 'USD',
      price: 0,
    }).price).toBe(0)
  })

  it('should accept valid currency rate', () => {
    const valid = { from_currency: 'EUR', to_currency: 'USD', rate: 1.085 }
    expect(CurrencyRateSchema.parse(valid)).toEqual(valid)
  })

  it('should reject negative rate', () => {
    expect(() => CurrencyRateSchema.parse({ from_currency: 'EUR', to_currency: 'USD', rate: -1 })).toThrow()
  })

  it('should reject zero rate', () => {
    expect(() => CurrencyRateSchema.parse({ from_currency: 'EUR', to_currency: 'USD', rate: 0 })).toThrow()
  })
})

// ============ NAVIGATION ADMIN TESTS ============

const NavigationItemSchema = z.object({
  menu_id: z.string().uuid(),
  parent_id: z.string().uuid().optional().nullable(),
  label: z.string().min(1),
  href: z.string().min(1),
  link_type: z.enum(['internal', 'external', 'anchor']).default('internal'),
  open_in_new_tab: z.boolean().default(false),
  position: z.number().int().min(0).default(0),
  visible: z.boolean().default(true),
})

describe('Navigation — Schema Validation', () => {
  it('should accept a complete navigation item', () => {
    const valid = {
      menu_id: '550e8400-e29b-41d4-a716-446655440000',
      parent_id: null,
      label: 'Trips',
      href: '/trips',
      link_type: 'internal' as const,
      open_in_new_tab: false,
      position: 0,
      visible: true,
    }
    expect(NavigationItemSchema.parse(valid)).toEqual(valid)
  })

  it('should accept minimal navigation item', () => {
    const minimal = { menu_id: '550e8400-e29b-41d4-a716-446655440000', label: 'Test', href: '/test' }
    const result = NavigationItemSchema.parse(minimal)
    expect(result.link_type).toBe('internal')
    expect(result.visible).toBe(true)
    expect(result.position).toBe(0)
  })

  it('should reject empty label', () => {
    expect(() => NavigationItemSchema.parse({ menu_id: '550e8400-e29b-41d4-a716-446655440000', label: '', href: '/test' })).toThrow()
  })

  it('should accept all valid link_types', () => {
    const types = ['internal', 'external', 'anchor'] as const
    types.forEach(t => {
      expect(NavigationItemSchema.parse({ menu_id: '550e8400-e29b-41d4-a716-446655440000', label: 'L', href: '/t', link_type: t }).link_type).toBe(t)
    })
  })

  it('should reject invalid link_type', () => {
    expect(() => NavigationItemSchema.parse({ menu_id: '550e8400-e29b-41d4-a716-446655440000', label: 'L', href: '/t', link_type: 'iframe' })).toThrow()
  })
})

// ============ BOOKINGS ADMIN TESTS ============

const BookingStatusSchema = z.enum(['draft', 'pending', 'processing', 'confirmed', 'cancelled', 'failed', 'refunded'])
const PaymentStatusSchema = z.enum(['pending', 'succeeded', 'failed', 'refunded'])

describe('Bookings — Schema Validation', () => {
  it('should accept all valid booking statuses', () => {
    const statuses = ['draft', 'pending', 'processing', 'confirmed', 'cancelled', 'failed', 'refunded'] as const
    statuses.forEach(s => {
      expect(BookingStatusSchema.parse(s)).toBe(s)
    })
  })

  it('should accept all valid payment statuses', () => {
    const statuses = ['pending', 'succeeded', 'failed', 'refunded'] as const
    statuses.forEach(s => {
      expect(PaymentStatusSchema.parse(s)).toBe(s)
    })
  })

  it('should reject invalid booking status', () => {
    expect(() => BookingStatusSchema.parse('completed')).toThrow()
  })

  it('should reject invalid payment status', () => {
    expect(() => PaymentStatusSchema.parse('paid')).toThrow()
  })
})

// ============ CUSTOMERS ADMIN TESTS ============

const CustomerSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  supabase_user_id: z.string().uuid().optional().nullable(),
})

describe('Customers — Schema Validation', () => {
  it('should accept a complete customer', () => {
    const valid = {
      email: 'jane@example.com',
      first_name: 'Jane',
      last_name: 'Doe',
      phone: '+23050000000',
      country: 'Mauritius',
      supabase_user_id: '550e8400-e29b-41d4-a716-446655440000',
    }
    expect(CustomerSchema.parse(valid)).toEqual(valid)
  })

  it('should accept minimal customer', () => {
    const minimal = { email: 'j@test.com', first_name: 'J', last_name: 'D' }
    expect(CustomerSchema.parse(minimal)).toBeTruthy()
  })

  it('should reject invalid email', () => {
    expect(() => CustomerSchema.parse({ email: 'bad', first_name: 'J', last_name: 'D' })).toThrow()
  })

  it('should reject empty first_name', () => {
    expect(() => CustomerSchema.parse({ email: 'j@test.com', first_name: '', last_name: 'D' })).toThrow()
  })
})

// ============ HOMEPAGE SECTIONS ADMIN TESTS ============

const HomepageSectionSchema = z.object({
  section_type: z.enum(['hero', 'transfers_cta', 'featured_activities', 'featured_packages', 'destinations', 'testimonials', 'promo', 'faqs', 'stats', 'custom']),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  data: z.preprocess((v) => {
    if (typeof v === 'string') {
      try { return JSON.parse(v) } catch { return {} }
    }
    return v ?? {}
  }, z.record(z.unknown())),
  position: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
})

describe('Homepage Sections — Schema Validation', () => {
  it('should accept a complete section', () => {
    const valid = {
      section_type: 'hero' as const,
      title: 'Discover Mauritius',
      subtitle: 'Your way',
      data: { cta_label: 'Explore', cta_href: '/trips' },
      position: 0,
      published: true,
    }
    expect(HomepageSectionSchema.parse(valid)).toEqual(valid)
  })

  it('should parse data from JSON string', () => {
    const result = HomepageSectionSchema.parse({
      section_type: 'hero',
      data: '{"cta_label":"Explore","cta_href":"/trips"}',
    })
    expect(result.data).toEqual({ cta_label: 'Explore', cta_href: '/trips' })
  })

  it('should handle invalid JSON for data', () => {
    const result = HomepageSectionSchema.parse({ section_type: 'hero', data: 'not-json' })
    expect(result.data).toEqual({})
  })

  it('should accept all valid section_types', () => {
    const types = ['hero', 'transfers_cta', 'featured_activities', 'featured_packages', 'destinations', 'testimonials', 'promo', 'faqs', 'stats', 'custom'] as const
    types.forEach(t => {
      expect(HomepageSectionSchema.parse({ section_type: t, data: '{}' }).section_type).toBe(t)
    })
  })
})
