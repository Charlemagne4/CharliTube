import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    console.log('procedure create video');

    const video = await prisma.video.create({
      data: {
        userId,
        title: 'TOYOTA'
      }
    });
    return { video };
  })
});
