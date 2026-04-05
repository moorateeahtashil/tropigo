import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Supabase v2 stores the session in a cookie named sb-<project-ref>-auth-token
    // We check for any cookie that starts with 'sb-' and ends with '-auth-token'
    const hasSession = [...req.cookies.getAll()].some(
      (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token') && c.value
    )
    if (!hasSession) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
