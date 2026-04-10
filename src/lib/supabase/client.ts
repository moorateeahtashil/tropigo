import { createBrowserClient } from '@supabase/ssr'

// Singleton to prevent multiple GoTrueClient instances in the same browser context
let browserClient: ReturnType<typeof createBrowserClient> | null = null

// Export a singleton browser client for client-side code.
// This ensures only one GoTrueClient instance exists under the same storage key.
export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return browserClient
}
