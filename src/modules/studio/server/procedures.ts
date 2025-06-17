import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const studioRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;
    const { id } = input;

    const video = await prisma.video.findFirst({ where: { id, userId } });

    if (!video) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: "Video not found or you don't have access to it.",
      });
    }
    return video;
  }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;

      const data = await prisma.video.findMany({
        where: { userId },
        include: {
          _count: {
            select: {
              VideoComment: true,
              VideoViews: true,
              VideoReaction: { where: { reactionType: 'like' } },
            },
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
        //skip: 1 this made the data to come with one item missing might cause problems later... or not
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
