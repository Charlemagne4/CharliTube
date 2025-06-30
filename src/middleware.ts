import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const secret = process.env.NEXTAUTH_SECRET;

const protectedRoutes = ['/protected', '/studio', '/subscriptions', '/feed/subscriptions'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname, origin } = request.nextUrl;

  // Set anonId cookie if not already set
  const anonId = request.cookies.get('anonId');
  if (!anonId) {
    const newAnonId = uuidv4();
    response.cookies.set('anonId', newAnonId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  // Auth logic for protected routes
  const token = await getToken({ req: request, secret });
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    const callbackUrl = encodeURIComponent(pathname);
    const redirectUrl = new URL('/signin', origin);
    redirectUrl.searchParams.set('callbackUrl', callbackUrl);

    const redirectResponse = NextResponse.redirect(redirectUrl);
    redirectResponse.headers.set('Cache-Control', 'no-store');
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    '/feed/subscriptions/:path*',
    '/protected/:path*',
    '/studio/:path*',
    '/settings/:path*',
    '/videos/:path*', // include any public route where anonId is needed
    '/', // optionally apply to homepage or any public routes
  ],
};
