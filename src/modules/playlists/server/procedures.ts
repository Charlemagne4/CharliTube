import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { z } from 'zod';

export const playlistsRouter = createTRPCRouter({
  getHistory: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            viewedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;

      // const viewerVideoViews = await prisma.videoView.findMany({
      //   where: { userId },
      //   select: { videoId: true, viewedAt: true },
      // });

      // const data = await prisma.video.findMany({
      //   where: {
      //     visibility: 'public',
      //   },
      //   orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      //   take: limit + 1,
      //   ...(cursor
      //     ? {
      //         //hard prisma limitation here i needed to filter video by the viewedAt from the views
      //         cursor: { updatedAt: cursor.viewedAt, id: cursor.id },
      //         skip: 1,
      //       }
      //     : {}),
      //   //include might not be needed
      //   include: {
      //     user: true,
      //     category: true,
      //     VideoViews: { where: { userId } },
      //     _count: {
      //       select: { VideoViews: true, VideoReaction: { where: { reactionType: 'like' } } },
      //     },
      //   },
      // });

      const data = await prisma.videoView.findMany({
        where: { userId },
        select: {
          videoId: true,
          viewedAt: true,
          video: {
            include: {
              user: true,
              category: true,
              VideoViews: { where: { userId } },
              _count: {
                select: {
                  VideoViews: true,
                  VideoReaction: { where: { reactionType: 'like' } },
                },
              },
            },
          },
        },
        orderBy: { viewedAt: 'desc' },
        take: limit + 1,
        ...(cursor
          ? {
              cursor: { viewedAt: cursor.viewedAt, id: cursor.id },
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
            id: lastItem.videoId,
            viewedAt: lastItem.viewedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
