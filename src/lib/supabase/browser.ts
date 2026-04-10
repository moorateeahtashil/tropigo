"use client"
import { createClient } from '@/lib/supabase/client'

// Re-export the singleton from client.ts to ensure there's only one
// browser client instance across the entire app.
export function getBrowserSupabase() {
  return createClient()
}
