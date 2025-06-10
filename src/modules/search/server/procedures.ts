import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { z } from 'zod';

export const searchRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        query: z.string().nullish(),
        categoryId: z.string().nullish(),
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
      const { limit, cursor, query, categoryId } = input;

      const data = await prisma.video.findMany({
        where: {
          AND: [
            {
              OR: [
                { title: { contains: query || '', mode: 'insensitive' } },
                { description: { contains: query || '', mode: 'insensitive' } },
              ],
            },
            categoryId ? { categoryId } : {},
            { visibility: 'public' },
          ],
        },
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
        ...(cursor
          ? {
              cursor: { updatedAt: cursor.updatedAt, id: cursor.id },
              skip: 1,
            }
          : {}),
        //include might not be needed
        include: {
          user: true,
          category: true,
          _count: {
            select: { VideoViews: true, VideoReaction: { where: { reactionType: 'like' } } },
          },
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
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
