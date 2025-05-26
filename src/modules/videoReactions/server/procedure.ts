import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { prisma } from '../../../../prisma/prisma';

export const VideoReactionsRouter = createTRPCRouter({
  getOne: baseProcedure.input(z.object({ videoId: z.string() })).query(async ({ ctx, input }) => {
    const { session } = ctx;
    if (!session) {
      //   throw new TRPCError({ code: 'UNAUTHORIZED' });
      return null;
    }
    const { user } = session;
    const { videoId } = input;
    const videoReaction = await prisma.videoReaction.findUnique({
      where: { userId_videoId: { userId: user.id, videoId } },
    });
    if (!videoReaction) return null;
    const viewerReaction = videoReaction?.reactionType;
    return viewerReaction;
  }),
  like: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { videoId } = input;

      const existingVideoReactionLike = await prisma.videoReaction.findUnique({
        where: {
          reactionType: 'like',
          userId_videoId: {
            userId: user.id,
            videoId: videoId,
          },
        },
      });

      if (existingVideoReactionLike) {
        const deletedVideoReactionLike = await prisma.videoReaction.delete({
          where: {
            userId_videoId: {
              userId: user.id,
              videoId: videoId,
            },
          },
        });
        return deletedVideoReactionLike;
      }

      const videoReaction = await prisma.videoReaction.upsert({
        where: {
          userId_videoId: {
            userId: user.id,
            videoId: input.videoId,
          },
        },
        update: {
          // specify fields to update
          reactionType: 'like',
        },
        create: {
          userId: user.id,
          videoId: input.videoId,
          reactionType: 'like', // or 'dislike'
        },
      });
      return videoReaction;
    }),
  dislike: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { videoId } = input;

      const existingVideoReactionLike = await prisma.videoReaction.findUnique({
        where: {
          reactionType: 'dislike',
          userId_videoId: {
            userId: user.id,
            videoId: videoId,
          },
        },
      });

      if (existingVideoReactionLike) {
        const deletedVideoReactionLike = await prisma.videoReaction.delete({
          where: {
            userId_videoId: {
              userId: user.id,
              videoId: videoId,
            },
          },
        });
        return deletedVideoReactionLike;
      }

      const videoReaction = await prisma.videoReaction.upsert({
        where: {
          userId_videoId: {
            userId: user.id,
            videoId: input.videoId,
          },
        },
        update: {
          // specify fields to update
          reactionType: 'dislike',
        },
        create: {
          userId: user.id,
          videoId: input.videoId,
          reactionType: 'dislike', // or 'dislike'
        },
      });

      return videoReaction;
    }),
});
