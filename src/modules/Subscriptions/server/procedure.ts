import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { prisma } from '../../../../prisma/prisma';
import { TRPCError } from '@trpc/server';

export const subscriptionsRouter = createTRPCRouter({
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

      // console.log(`viewerId: ${viewerId}`, `creatorId: ${creatorId} `);

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
      // console.log(`viewerId: ${viewerId}`, `creatorId: ${creatorId} `);
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
