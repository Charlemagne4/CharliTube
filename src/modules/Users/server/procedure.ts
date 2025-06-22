import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const usersRouter = createTRPCRouter({
  getOne: baseProcedure.input(z.object({ userId: z.string() })).query(async ({ input, ctx }) => {
    let currentUserId: string;

    const existingUser = await prisma.user.findUnique({
      where: { id: input.userId },
      include: {
        _count: { select: { Subscribers: true, Videos: true } },
        Subscribers: true,
        // VideoReaction: true,
      },
    });

    if (!existingUser) throw new TRPCError({ code: 'NOT_FOUND' });

    if (ctx.session) {
      currentUserId = ctx.session.user.id;
    }

    const currentIsSubscribed = existingUser.Subscribers.some(
      (subscriber) => subscriber.viewerId === currentUserId,
    );
    return { ...existingUser, currentIsSubscribed };
  }),
});
