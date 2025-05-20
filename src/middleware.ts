import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

const protectedRoutes = ['/protected', '/studio', '/settings'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });
  const { pathname, origin } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    // Single encoding of the callback URL
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    console.log(callbackUrl); // Check what the callbackUrl looks like

    const redirectUrl = new URL(`/signin`, origin);
    redirectUrl.searchParams.set('callbackUrl', callbackUrl);

    const redirectResponse = NextResponse.redirect(redirectUrl);
    redirectResponse.headers.set('Cache-Control', 'no-store'); // ✅ also on redirect
    return redirectResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*', '/studio/:path*', '/settings/:path*']
};
