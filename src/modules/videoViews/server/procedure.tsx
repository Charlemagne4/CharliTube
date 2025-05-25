import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { z } from 'zod';
import { prisma } from '../../../../prisma/prisma';
import { TRPCError } from '@trpc/server';

export const videoViewsRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        userId: z.string().nullable(),
        videoId: z.string(),
        anonId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { anonId, userId, videoId } = input;

      if (!userId && !anonId) {
        // Still throw if both/neither are present, because it’s invalid input
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You must provide either/both userId or anonId',
        });
      }
      const safeUserId = userId as string;
      //TODO: due to mongo limitations with prisma i can't have 2 unicity constraints
      //  so now every time a server restart i get new cookie so a new view
      await prisma.videoView.upsert({
        where: { userId_anonId_videoId: { anonId, userId: safeUserId, videoId } },
        update: { viewedAt: new Date() },
        create: { anonId, userId, videoId },
      });
      return { success: true };
    }),
});
