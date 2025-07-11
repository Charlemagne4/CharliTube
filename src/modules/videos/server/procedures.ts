import { createTRPCRouter, protectedProcedure, baseProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { deleteMuxVideo, mux } from '@/lib/mux';
import { VideoUpdateSchema } from '../../../../prisma/zod-prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { deleteUTFile } from '@/lib/UTapi';
import { UTApi } from 'uploadthing/server';
import { workflowUpstashClient } from '@/lib/qstashWorkflow';
import { env } from '@/data/server';
import { logger } from '@/utils/pino';

export const videosRouter = createTRPCRouter({
  getManySubscribed: protectedProcedure
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
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;
      const ViewerSubscriptions = await prisma.subscription.findMany({
        where: { viewerId: userId },
      });

      const subscribedCreators = ViewerSubscriptions.map((subscription) => subscription.creatorId);
      logger.info('subscribedCreators: ', subscribedCreators);

      const data = await prisma.video.findMany({
        where: {
          userId: { in: subscribedCreators },
          visibility: 'public',
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
      logger.info('videos of subscriber: ', data);

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
  getManyTrending: baseProcedure
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
    .query(async ({ input }) => {
      const { limit, cursor } = input;

      const data = await prisma.video.findMany({
        where: {
          visibility: 'public',
        },
        orderBy: [{ VideoViews: { _count: 'desc' } }, { updatedAt: 'desc' }, { id: 'desc' }],
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
  getMany: baseProcedure
    .input(
      z.object({
        categoryId: z.string().nullish(),
        userId: z.string().nullish(),
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
      const { limit, cursor, categoryId, userId } = input;

      const data = await prisma.video.findMany({
        where: {
          ...(categoryId ? { categoryId } : {}),
          ...(userId ? { userId } : {}),
          visibility: 'public',
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
  getOne: baseProcedure.input(z.object({ videoId: z.string() })).query(async ({ input }) => {
    // const { session } = ctx;

    const existingVideo = await prisma.video.findFirst({
      where: { id: input.videoId },
      include: {
        user: { include: { _count: { select: { Subscribers: true } } } },
        //this finds a user subscription array but need to filter it so a separate procedure is advisable
        // {
        //   include: {
        //     ...(session?.user ? { Subscriptions: { where: { viewerId: session.user.id } } } : {}),
        //   },
        // },

        VideoReaction: true,
        _count: { select: { VideoViews: true } },
      },
    });

    if (!existingVideo) throw new TRPCError({ code: 'NOT_FOUND' });

    const likesCount = existingVideo.VideoReaction.filter((r) => r.reactionType === 'like').length;
    const dislikesCount = existingVideo.VideoReaction.filter(
      (r) => r.reactionType === 'dislike',
    ).length;

    return { ...existingVideo, dislikesCount, likesCount };
  }),
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
                name: 'English',
              },
            ],
          },
        ],
      },
      cors_origin: '*', //TODO: in production set to url
    });

    const video = await prisma.video.create({
      data: {
        userId,
        title: 'TOYOTA',
        muxStatus: 'waiting',
        muxUploadId: upload.id,
      },
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
        visibility: input.visibility || 'private',
      },
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
      if (!removedVideo.muxAssetId) {
        throw new TRPCError({ code: 'BAD_GATEWAY' });
      }

      const utApi = new UTApi();
      const cleanUpAfterDeletion = [];
      if (removedVideo.previewKey) cleanUpAfterDeletion.push(removedVideo.previewKey);
      if (removedVideo.thumbnailKey) cleanUpAfterDeletion.push(removedVideo.thumbnailKey);

      const deleteMux = deleteMuxVideo(removedVideo.muxAssetId);
      const deleteUploadThing = utApi.deleteFiles(cleanUpAfterDeletion);

      const [deletedUploadting, deletedMux] = await Promise.all([deleteUploadThing, deleteMux]);
      logger.debug(deletedUploadting);
      logger.debug(deletedMux);
      return removedVideo;
    }),
  revalidate: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const existingVideo = await prisma.video.findFirst({ where: { userId, id: videoId } });
      if (!existingVideo) throw new TRPCError({ code: 'NOT_FOUND' });
      if (!existingVideo.muxUploadId) throw new TRPCError({ code: 'BAD_REQUEST' });

      const upload = await mux.video.uploads.retrieve(existingVideo.muxUploadId);

      if (!upload || !upload.asset_id) throw new TRPCError({ code: 'BAD_REQUEST' });

      const asset = await mux.video.assets.retrieve(upload.asset_id);
      if (!asset) throw new TRPCError({ code: 'BAD_REQUEST' });

      const updatedVideo = await prisma.video.update({
        where: { userId, id: videoId },
        data: {
          muxStatus: asset.status,
          muxPlaybackId: asset.playback_ids?.[0].id,
          muxAssetId: asset.id,
          duration: asset.duration,
        },
      });
      return updatedVideo;
    }),
  restore: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const existingVideo = await prisma.video.findFirst({ where: { userId, id: videoId } });

      if (!existingVideo) throw new TRPCError({ code: 'NOT_FOUND' });
      if (!existingVideo.muxPlaybackId) throw new TRPCError({ code: 'BAD_REQUEST' });

      if (existingVideo.thumbnailKey) {
        void deleteUTFile(input.videoId, userId, existingVideo);
      }

      const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;

      const utApi = new UTApi();
      const [uploadedThumbnail] = await utApi.uploadFilesFromUrl([tempThumbnailUrl]);

      if (!uploadedThumbnail.data) {
        return new TRPCError({ code: 'SERVICE_UNAVAILABLE' });
      }
      const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadedThumbnail.data;

      const updatedVideo = await prisma.video.update({
        where: { userId, id: videoId },
        data: { thumbnailUrl, thumbnailKey },
      });
      return updatedVideo;
    }),
  generateTitle: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { videoId } = input;
      const { workflowRunId } = await workflowUpstashClient.trigger({
        url: `${env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
        body: { userId: user.id, videoId },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      logger.info('generateTitle hit');
      return workflowRunId;
    }),
  generateDescriptionFromTitle: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { videoId } = input;
      const { workflowRunId } = await workflowUpstashClient.trigger({
        url: `${env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
        body: { userId: user.id, videoId },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      logger.info('generateDescription hit');
      return workflowRunId;
    }),
  generateDescriptionFromTranscriptionTrack: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { videoId } = input;
      const { workflowRunId } = await workflowUpstashClient.trigger({
        url: `${env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/transcription`,
        body: { userId: user.id, videoId },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      logger.info('generateDescription hit');
      return workflowRunId;
    }),
});
