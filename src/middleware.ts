import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

const protectedRoutes = ['/protected', '/dashboard', '/settings'];

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

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*']
};
