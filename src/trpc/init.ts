import { initTRPC, TRPCError } from '@trpc/server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

import superjson from 'superjson';

import { prisma } from '../../prisma/prisma';
import { ratelimit } from '@/lib/ratelimit';

export async function createTRPCContext() {
  const session = await getServerSession(authOptions); // Using getServerSession here
  // console.log('>>>>-session:', session);
  return {
    session
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson
});

export const createTRPCRouter = t.router;

export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Must be logged In' });
  }

  const user = await prisma.user.findFirst({ where: { id: ctx.session?.user.id } });
  // console.log('current User from trpc middleware:', currentUser);
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Must be logged In' });
  }

  const { success } = await ratelimit.limit(user.id);

  if (!success) {
    throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Calm down, Too many requests' });
  }
  //have access to ctx in all base routes but user only in protected routes
  return next({
    ctx: {
      ...ctx,
      user
    }
  });
});
