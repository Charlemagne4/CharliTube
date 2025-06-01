import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { VideoCommentCreateSchema } from '../../../../prisma/zod-prisma';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const videoCommentsRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;
      await prisma.videoComment.delete({ where: { id: commentId, userId } });
      return { success: true };
    }),
  create: protectedProcedure.input(VideoCommentCreateSchema).mutation(async ({ input, ctx }) => {
    const { videoId, content } = input;
    const { id: userId } = ctx.user;
    const safeUserId = userId;
    const deletedComment = await prisma.videoComment.create({
      data: {
        userId: safeUserId,
        videoId,
        content,
      },
    });
    if (!deletedComment) throw new TRPCError({ code: 'NOT_FOUND' });
    return deletedComment;
  }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string(),
        cursor: z.object({ id: z.string(), updatedAt: z.date() }).nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      const { videoId, limit, cursor } = input;
      const dataPromise = prisma.videoComment.findMany({
        where: { videoId },
        include: { user: true },
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
        ...(cursor
          ? {
              cursor: { updatedAt: cursor.updatedAt, id: cursor.id },
              skip: 1,
            }
          : {}),
      });
      const videoCommentCountPromise = prisma.videoComment.count({ where: { videoId } });

      const [data, commentCount] = await Promise.all([dataPromise, videoCommentCountPromise]);
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
        commentCount,
        items,
        nextCursor,
      };
    }),
});
