import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const suggestionsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string(),
        cursor: z
          .object({
            id: z.string(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      const { limit, cursor, videoId } = input;

      const existingVideo = await prisma.video.findFirst({ where: { id: videoId } });

      if (!existingVideo) throw new TRPCError({ code: 'NOT_FOUND' });

      const data = await prisma.video.findMany({
        where: {
          ...(existingVideo.categoryId ? { categoryId: existingVideo.categoryId } : {}),
          visibility: 'public',
          id: {
            not: videoId,
          },
        },
        include: {
          user: true,
          _count: {
            select: { VideoViews: true, VideoReaction: { where: { reactionType: 'like' } } },
          },
        },

        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
        ...(cursor
          ? {
              cursor: { updatedAt: cursor.updatedAt, id: cursor.id },
              skip: 1,
            }
          : {}),
      });
      const hasMore = data.length > limit;
      //remove last item if there is more data
      const items = hasMore ? data.slice(0, -1) : data;
      // set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
