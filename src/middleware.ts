// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// const protectedRoutes = ['/private'];
// const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  console.log('middleware working');
  return NextResponse.next();
}

export const config = {
  matcher: []
};
