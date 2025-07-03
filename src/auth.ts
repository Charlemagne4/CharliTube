// app/api/auth/[...nextauth]/route.js
import { Account, Profile, Session, User } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { env } from '@/data/server';
import { JWT } from 'next-auth/jwt';
import { prisma } from '../prisma/prisma';
import Credentials from 'next-auth/providers/credentials';
import { comparePasswords } from './utils/passwordHasher';
import { logger } from './utils/pino';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Chaklamo' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log(credentials);
        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findUnique({ where: { email: credentials?.email } });

        console.log('AAAAA');
        if (!user) return null;

        console.log('AAAAA');
        console.log(!user.password);
        console.log(!user.salt);
        console.log(!credentials?.password);
        if (!user.password || !user.salt || !credentials?.password) {
          logger.warn('Missing credentials or user data during login attempt');
          return null;
        }
        console.log('AAAAA');
        if (
          await comparePasswords({
            hashedPassword: user.password,
            password: credentials.password,
            salt: user.salt,
          })
        ) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          console.log('AAAAA');
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
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
    async signIn({ user, account, profile }: { user: User; account: Account; profile: Profile }) {
      // Sync provider image if changed
      if (account?.provider && profile?.image && user.id) {
        const userDb = await prisma.user.findUnique({ where: { id: user.id } });
        if (userDb && userDb.image !== profile.image) {
          await prisma.user.update({
            where: { id: user.id },
            data: { image: profile.image },
          });
        }
      }
      return true;
    },
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
