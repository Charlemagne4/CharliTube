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
    const { videoId, content, parentId } = input;
    const { id: userId } = ctx.user;
    const safeUserId = userId;

    const existingComment = await prisma.videoComment.findFirst({ where: { id: parentId } });

    if (!existingComment && parentId) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    if (existingComment?.parentId && parentId) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    const createdComment = await prisma.videoComment.create({
      data: {
        userId: safeUserId,
        videoId,
        parentId,
        content,
      },
    });
    if (!createdComment) throw new TRPCError({ code: 'NOT_FOUND' });
    return createdComment;
  }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string(),
        parentId: z.string().nullish(),
        cursor: z.object({ id: z.string(), updatedAt: z.date() }).nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { videoId, limit, cursor, parentId } = input;
      const userId = ctx.session?.user?.id;
      const dataPromise = prisma.videoComment.findMany({
        where: { videoId, ...(parentId ? { parentId } : { parent: null }) },
        include: { user: true, replies: true },
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

      //TODO:optimize following db hits
      // 1. Get all comment IDs
      const commentIds = items.map((comment) => comment.id);

      // 2. Get like/dislike counts for each comment
      const reactions = await prisma.commentReaction.groupBy({
        by: ['commentId', 'reactionType'],
        where: { commentId: { in: commentIds } },
        _count: true,
      });

      const replies = await prisma.videoComment.findMany({
        where: {
          videoId,
          parentId: {
            not: null,
          },
        },
      });

      const replyMap: Record<string, { replyCount: number }> = {};
      replies.forEach(({ parentId }) => {
        if (!parentId) return;
        if (!replyMap[parentId]) {
          replyMap[parentId] = { replyCount: 0 };
        }
        replyMap[parentId].replyCount++;
      });

      console.log(replyMap);
      // 3. Map counts to each comment
      const reactionMap: Record<string, { like: number; dislike: number }> = {};
      reactions.forEach(({ commentId, reactionType, _count }) => {
        if (!reactionMap[commentId]) reactionMap[commentId] = { like: 0, dislike: 0 };
        reactionMap[commentId][reactionType] = _count;
      });

      //repliesCount

      // 4. Get current user's reactions for these comments (if logged in)
      const userReactions: Record<string, 'like' | 'dislike'> = {};
      if (userId) {
        const userReactionRows = await prisma.commentReaction.findMany({
          where: {
            commentId: { in: commentIds },
            userId,
          },
          select: {
            commentId: true,
            reactionType: true,
          },
        });
        userReactionRows.forEach(({ commentId, reactionType }) => {
          userReactions[commentId] = reactionType;
        });
      }

      const itemsWithCounts = items.map((comment) => {
        const likeCount = reactionMap[comment.id]?.like || 0;
        const dislikeCount = reactionMap[comment.id]?.dislike || 0;
        const replyCount = replyMap[comment.id]?.replyCount || 0;
        const hasLiked = userReactions[comment.id] === 'like';
        const hasDisliked = userReactions[comment.id] === 'dislike';
        return {
          ...comment,
          replyCount,
          likeCount,
          dislikeCount,
          hasLiked,
          hasDisliked,
        };
      });

      return {
        commentCount,
        items: itemsWithCounts,
        nextCursor,
      };
    }),
});
