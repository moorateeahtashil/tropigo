import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_req: NextRequest) {
  // Auth is handled client-side by AdminGuard via Supabase localStorage session.
  // Middleware cannot read localStorage, so we let all requests through and rely
  // on AdminGuard to redirect unauthenticated users to /admin/login.
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
