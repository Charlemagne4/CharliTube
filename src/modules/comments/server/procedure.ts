import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { VideoCommentCreateSchema } from '../../../../prisma/zod-prisma';
import { z } from 'zod';

export const videoCommentsRouter = createTRPCRouter({
  create: protectedProcedure.input(VideoCommentCreateSchema).mutation(async ({ input, ctx }) => {
    const { videoId, content } = input;
    const { id: userId } = ctx.user;
    const safeUserId = userId as string;
    await prisma.videoComment.create({
      data: {
        userId: safeUserId,
        videoId,
        content,
      },
    });
    return { success: true };
  }),
  getMany: baseProcedure.input(z.object({ videoId: z.string() })).query(async ({ input }) => {
    const { videoId } = input;
    const comments = await prisma.videoComment.findMany({
      where: { videoId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return comments;
  }),
});
