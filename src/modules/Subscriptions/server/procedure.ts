import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { prisma } from '../../../../prisma/prisma';
import { TRPCError } from '@trpc/server';

export const subscriptionsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;

      const data = await prisma.subscription.findMany({
        where: {
          viewerId: userId,
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
        ...(cursor
          ? {
              cursor: { createdAt: cursor.createdAt, id: cursor.id },
              skip: 1,
            }
          : {}),
        //include might not be needed
        include: {
          creator: { include: { _count: { select: { Subscribers: true } } } },
          viewer: true,
        },
      });

      const hasMore = data.length > limit;
      //remove last item if there is more data
      const items = hasMore ? data.slice(0, -1) : data;
      // set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            createdAt: lastItem.createdAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  getOne: baseProcedure
    .input(z.object({ userId: z.string().nullable() }))
    .query(async ({ ctx, input }) => {
      const { session } = ctx;
      if (!session) {
        //   throw new TRPCError({ code: 'UNAUTHORIZED' });
        return null;
      }

      const { id: viewerId } = session.user;
      const { userId: creatorId } = input;

      // logger.info(`viewerId: ${viewerId}`, `creatorId: ${creatorId} `);

      if (!viewerId || !creatorId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Must be logged in' });
      }

      const subscription = await prisma.subscription.findUnique({
        where: { viewerId_creatorId: { viewerId, creatorId } },
      });

      return subscription ? true : false;
    }),
  create: protectedProcedure
    .input(z.object({ userId: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const { id: viewerId } = ctx.user;
      const { userId: creatorId } = input;

      if (viewerId === creatorId) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
      if (!viewerId || !creatorId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Must be logged in' });
      }
      // logger.info(`viewerId: ${viewerId}`, `creatorId: ${creatorId} `);
      const subscription = await prisma.subscription.create({
        data: { viewerId, creatorId },
      });

      return subscription;
    }),
  remove: protectedProcedure
    .input(z.object({ userId: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const { id: viewerId } = ctx.user;
      const { userId: creatorId } = input;

      if (viewerId === creatorId) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
      if (!viewerId || !creatorId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Must be logged in' });
      }
      const deletedSubscription = await prisma.subscription.delete({
        where: { viewerId_creatorId: { viewerId, creatorId } },
      });
      return deletedSubscription;
    }),
});
