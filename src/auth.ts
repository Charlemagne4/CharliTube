import NextAuth from 'next-auth';

import Discord from 'next-auth/providers/discord';
import Github from 'next-auth/providers/github';
import { env } from './data/server';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET
    }),
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    })
  ]
});
