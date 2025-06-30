import { initTRPC, TRPCError } from '@trpc/server';

import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';

import superjson from 'superjson';

import { prisma } from '../../prisma/prisma';
import { ratelimit } from '@/lib/ratelimit';
import { logger } from '@/utils/pino';

export async function createTRPCContext() {
  const session = await getServerSession(authOptions); // Using getServerSession here
  // logger.info('>>>>-session:', session);
  return {
    session,
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  logger.info(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

export const createTRPCRouter = t.router;

export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure.use(timingMiddleware);

export const protectedProcedure = baseProcedure.use(timingMiddleware).use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Must be logged In' });
  }

  const user = await prisma.user.findFirst({ where: { id: ctx.session?.user.id } });
  // logger.info('current User from trpc middleware:', currentUser);
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
      user,
    },
  });
});
