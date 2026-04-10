import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req })

  // Refresh Supabase session (keeps auth cookies up to date)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options as any))
        },
      },
    },
  )

  // Important: getUser() will refresh the session if it's close to expiring
  const { data: { user } } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname

  // Protect all /admin/* routes except the login page itself
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    if (!user) {
      const loginUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
    // If user exists, verify admin access to prevent server-side loop
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    if (!profile?.is_admin) {
      const loginUrl = new URL('/admin/login?error=unauthorized', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Currency cookie — set default if not present
  if (!req.cookies.get('tropigo_currency')) {
    response.cookies.set('tropigo_currency', 'EUR', {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (asset files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
