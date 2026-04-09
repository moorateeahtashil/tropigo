// Mock Supabase admin client for all admin tests
import { vi } from 'vitest'

export const mockSupabase = {
  from: vi.fn(() => mockQueryBuilder),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ error: null }),
      remove: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}

export const mockQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockReturnThis(),
}

export function createMockChain(result: { data: any; error: any }) {
  mockQueryBuilder.select.mockReturnThis()
  mockQueryBuilder.insert.mockReturnThis()
  mockQueryBuilder.update.mockReturnThis()
  mockQueryBuilder.delete.mockReturnThis()
  mockQueryBuilder.eq.mockReturnThis()
  mockQueryBuilder.ilike.mockReturnThis()
  mockQueryBuilder.order.mockReturnThis()
  mockQueryBuilder.limit.mockReturnThis()
  mockQueryBuilder.single.mockReturnValue(Promise.resolve(result))
  mockQueryBuilder.upsert.mockReturnValue(Promise.resolve(result))
  return mockQueryBuilder
}

beforeEach(() => {
  vi.clearAllMocks()
})
