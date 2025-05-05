// app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';

import { env } from '@/data/server';

import { prisma } from '../../../../../prisma/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET
    })
    // Add other providers as needed
  ],
  session: {
    strategy: 'jwt' as const // Use JWT for session management
  }
  // Additional NextAuth.js configuration options
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
