// app/api/auth/[...nextauth]/route.js
import { Session, User, Account, Profile } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { env } from '@/data/server';
import { JWT } from 'next-auth/jwt';
import { prisma } from '../prisma/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt' as const, // Use JWT for session management
  },
  callbacks: {
    //TODO: update user Image from provider when he login
    // async signIn({ user }: { user: User; account: Account | null; profile?: Profile }) {
    //   // Optional: Only update if image has changed
    //   const existingUser = await prisma.user.findUnique({
    //     where: { email: user.email || undefined },
    //   });
    //   console.log(existingUser);

    //   if (existingUser && existingUser.image !== user.image) {
    //     await prisma.user.update({
    //       where: { email: user.email || undefined },
    //       data: { image: user.image },
    //     });
    //   }

    //   return true;
    // },
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.role = user.role;
        token.id = user.id; // Add custom attribute
        // Add custom attribute
      }
      return token;
    },
    async session({ session, token }: { token: JWT; session: Session }) {
      session.user.role = token.role as string;
      session.user.id = token.id as string;
      return session;
    },
  },
};
