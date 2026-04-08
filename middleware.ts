import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const response = NextResponse.next()
  
  // Currency cookie - set default if not exists
  const currencyCookie = req.cookies.get('tropigo_currency')
  if (!currencyCookie) {
    response.cookies.set('tropigo_currency', 'EUR', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax',
    })
  }
  
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/activities/:path*', '/transfers/:path*', '/packages/:path*', '/destinations/:path*'],
}
