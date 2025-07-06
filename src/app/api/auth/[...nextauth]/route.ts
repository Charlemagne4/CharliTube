// app/api/auth/[...nextauth]/route.js

import { authOptions } from '@/auth';
import NextAuth from 'next-auth';

// @ts-expect-error NextAuth expects Node.js req/res, but Next.js 13+ uses NextRequest/NextResponse
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
