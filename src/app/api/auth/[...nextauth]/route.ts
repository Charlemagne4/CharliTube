// app/api/auth/[...nextauth]/route.js

import NextAuth, { Session, User } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';

import { prisma } from '../../../../../prisma/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { env } from '@/data/server';
import { JWT } from 'next-auth/jwt';

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
  ],
  session: {
    strategy: 'jwt' as const // Use JWT for session management
  },
  callbacks: {
    async jwt({ token, user }: {token: JWT, user: User}) {
      if (user) {
        token.role = user.role;
        token.id = user.id; // Add custom attribute
        // Add custom attribute
      }
      return token;
    },
    async session({ session, token }: {token: JWT, session: Session}) {
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
