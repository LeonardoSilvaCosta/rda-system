import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const allowedPaths = ['/login', '/forgotPassword', '/redefinePassword'];
  const isAllowed = allowedPaths.some((allowedPath) =>
    pathname.startsWith(allowedPath)
  );

  if (!user && !isAllowed) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/forgotPassword',
    '/redefinePassword/:path*',
    '/RegisterClient/:path*',
    '/RegisterAppointment/:path*'
  ]
};
