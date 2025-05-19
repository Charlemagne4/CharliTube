import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { mux } from '@/lib/mux';
import { VideoUpdateSchema } from '../../../../prisma/zod-prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policies: ['public'],
        static_renditions: [{ resolution: 'highest' }, { resolution: 'audio-only' }],
        inputs: [
          {
            generated_subtitles: [
              {
                language_code: 'en',
                name: 'English'
              }
            ]
          }
        ]
      },
      cors_origin: '*' //TODO: in production set to url
    });

    const video = await prisma.video.create({
      data: {
        userId,
        title: 'TOYOTA',
        muxStatus: 'waiting',
        muxUploadId: upload.id
      }
    });
    return { video, url: upload.url };
  }),
  update: protectedProcedure.input(VideoUpdateSchema).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    const updatedVideo = await prisma.video.update({
      where: { id: input.id, userId },
      data: {
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        visibility: input.visibility || 'private'
      }
    });
    if (!updatedVideo) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    return updatedVideo;
  }),
  remove: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const removedVideo = await prisma.video.delete({ where: { id: input.videoId, userId } });

      if (!removedVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      return removedVideo;
    })
});
