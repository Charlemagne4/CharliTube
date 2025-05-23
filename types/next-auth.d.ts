/* eslint-disable @typescript-eslint/no-unused-vars */
// @types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      role: string;
    };
  }

  interface User {
    role?: string;
    id?: string;
  }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string; // Allow role to be any string
  }
}
