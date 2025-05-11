import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { z } from 'zod';

export const studioRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            updatedAt: z.date()
          })
          .nullish(),
        limit: z.number().min(1).max(100)
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;

      const data = await prisma.video.findMany({
        where: { userId },
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor.id, updatedAt: cursor.updatedAt } }),
        skip: 1
      });
      const hasMore = data.length > limit;
      //remove last item if there is more data
      const items = hasMore ? data.slice(0, -1) : data;
      // set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt
          }
        : null;

      return {
        items,
        nextCursor
      };
    })
});
