import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Use this in Server Components, Route Handlers, and Server Actions.
// Respects the authenticated user session via cookies.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignored in Server Components — middleware handles session refresh
          }
        },
      },
    },
  )
}
