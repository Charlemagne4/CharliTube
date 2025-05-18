import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { mux } from '@/lib/mux';

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
  })
});
