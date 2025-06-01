import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { prisma } from '../../../../prisma/prisma';

export const CommentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { commentId } = input;

      const existingCommentReactionLike = await prisma.commentReaction.findUnique({
        where: {
          userId_commentId: {
            userId: user.id,
            commentId,
          },
          reactionType: 'like',
        },
      });

      if (existingCommentReactionLike) {
        const deletedCommentReactionLike = await prisma.commentReaction.delete({
          where: {
            userId_commentId: {
              userId: user.id,
              commentId,
            },
          },
        });
        return deletedCommentReactionLike;
      }

      const commentReaction = await prisma.commentReaction.upsert({
        where: {
          userId_commentId: {
            userId: user.id,
            commentId,
          },
        },
        update: {
          // specify fields to update
          reactionType: 'like',
        },
        create: {
          userId: user.id,
          commentId,
          reactionType: 'like', // or 'dislike'
        },
      });
      return commentReaction;
    }),
  dislike: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { commentId } = input;

      const existingCommentReactionDislike = await prisma.commentReaction.findUnique({
        where: {
          userId_commentId: {
            userId: user.id,
            commentId,
          },
          reactionType: 'dislike',
        },
      });

      if (existingCommentReactionDislike) {
        const deletedCommentReactionDislike = await prisma.commentReaction.delete({
          where: {
            userId_commentId: {
              userId: user.id,
              commentId,
            },
          },
        });
        return deletedCommentReactionDislike;
      }

      const commentReaction = await prisma.commentReaction.upsert({
        where: {
          userId_commentId: {
            userId: user.id,
            commentId,
          },
        },
        update: {
          // specify fields to update
          reactionType: 'dislike',
        },
        create: {
          userId: user.id,
          commentId,
          reactionType: 'dislike', // or 'dislike'
        },
      });
      return commentReaction;
    }),
});
