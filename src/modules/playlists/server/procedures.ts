import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const playlistsRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(z.object({ playlistId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { playlistId } = input;
      const { id: userId } = ctx.user;

      const deletedPlaylist = await prisma.playlist.delete({ where: { id: playlistId, userId } });

      if (!deletedPlaylist) throw new TRPCError({ code: 'NOT_FOUND' });

      return deletedPlaylist;
    }),
  getOne: baseProcedure.input(z.object({ playlistId: z.string() })).query(async ({ input }) => {
    const { playlistId } = input;

    const existingPlaylist = await prisma.playlist.findUnique({ where: { id: playlistId } });

    if (!existingPlaylist) throw new TRPCError({ code: 'NOT_FOUND' });

    return existingPlaylist;
  }),
  getVideos: baseProcedure
    .input(
      z.object({
        playlistId: z.string(),
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
      const { limit, cursor, playlistId } = input;

      const data = await prisma.video.findMany({
        where: {
          PlaylistVideo: { some: { playlistId } },
        },
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        include: {
          user: true,
          category: true,
          _count: {
            select: {
              VideoViews: true,
              VideoReaction: { where: { reactionType: 'like' } },
            },
          },
        },
        take: limit + 1,
        ...(cursor
          ? {
              cursor: { updatedAt: cursor.updatedAt, id: cursor.id },
              skip: 1,
            }
          : {}),
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
  removeVideo: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
        videoId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { playlistId, videoId } = input;
      const { id: userId } = ctx.user;

      const existingPlaylistPromise = prisma.playlist.findFirst({
        where: { id: playlistId, userId },
      });

      const existingVideoPromise = prisma.video.findFirst({
        where: { id: videoId },
      });
      const existingPlaylistVideoPromise = prisma.playlistVideo.findUnique({
        where: { playlistId_videoId: { playlistId, videoId } },
      });

      const [existingPlaylist, existingVideo, existingPlaylistVideo] = await Promise.all([
        existingPlaylistPromise,
        existingVideoPromise,
        existingPlaylistVideoPromise,
      ]);
      if (!existingPlaylist || !existingVideo) throw new TRPCError({ code: 'NOT_FOUND' });
      if (!existingPlaylistVideo) throw new TRPCError({ code: 'NOT_FOUND' });

      const deletedPlaylistvideo = await prisma.playlistVideo.delete({
        where: { playlistId_videoId: { playlistId, videoId } },
        include: { playlist: { select: { name: true, id: true } } },
      });

      return deletedPlaylistvideo;
    }),
  addVideo: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
        videoId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { playlistId, videoId } = input;
      const { id: userId } = ctx.user;

      const existingPlaylistPromise = prisma.playlist.findFirst({
        where: { id: playlistId, userId },
      });

      const existingVideoPromise = prisma.video.findFirst({
        where: { id: videoId },
      });
      const existingPlaylistVideoPromise = prisma.playlistVideo.findUnique({
        where: { playlistId_videoId: { playlistId, videoId } },
      });

      const [existingPlaylist, existingVideo, existingPlaylistVideo] = await Promise.all([
        existingPlaylistPromise,
        existingVideoPromise,
        existingPlaylistVideoPromise,
      ]);
      if (!existingPlaylist || !existingVideo) throw new TRPCError({ code: 'NOT_FOUND' });
      if (existingPlaylistVideo) throw new TRPCError({ code: 'CONFLICT' });

      const createdPlaylistvideo = await prisma.playlistVideo.create({
        data: { playlistId, videoId },
        include: { playlist: { select: { name: true } } },
      });

      return createdPlaylistvideo;
    }),
  getManyForVideo: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
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
      const { limit, cursor, videoId } = input;
      const { id: userId } = ctx.user;

      const data = await prisma.playlist.findMany({
        where: { userId },
        include: {
          playListVideos: {
            select: { videoId: true },
          },
          user: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: limit + 1,
        ...(cursor
          ? {
              cursor: { updatedAt: cursor.updatedAt, id: cursor.id },
              skip: 1,
            }
          : {}),
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

      const itemsWithContains = items.map((item) => {
        return item.playListVideos.some((video) => video.videoId === videoId)
          ? { ...item, containsVideo: true }
          : { ...item, containsVideo: false };
      });

      return {
        items: itemsWithContains,
        nextCursor,
      };
    }),
  getMany: protectedProcedure
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

      const data = await prisma.playlist.findMany({
        where: {
          userId,
          playListVideos: {
            some: {},
          },
        },
        include: {
          playListVideos: { include: { video: { select: { thumbnailUrl: true } } } },
          user: true,
          _count: { select: { playListVideos: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit + 1,
        ...(cursor
          ? {
              cursor: { updatedAt: cursor.updatedAt, id: cursor.id },
              skip: 1,
            }
          : {}),
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
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      const { id: userId } = ctx.user;

      const createdPlaylist = await prisma.playlist.create({ data: { name, userId } });

      if (!createdPlaylist) throw new TRPCError({ code: 'BAD_REQUEST' });

      return createdPlaylist;
    }),
  getLiked: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            interactedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;

      const data = await prisma.videoReaction.findMany({
        where: {
          userId,
          reactionType: 'like',
        },
        orderBy: [{ interactedAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
        ...(cursor
          ? {
              //hard prisma limitation here i needed to filter video by the viewedAt from the views
              cursor: { interactedAt: cursor.interactedAt, id: cursor.id },
              skip: 1,
            }
          : {}),
        //include might not be needed
        select: {
          videoId: true,
          interactedAt: true,
          video: {
            include: {
              user: true,
              category: true,
              VideoViews: { where: { userId } },
              _count: {
                select: {
                  VideoViews: true,
                  VideoReaction: { where: { reactionType: 'like' } },
                },
              },
            },
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
            id: lastItem.videoId,
            interactedAt: lastItem.interactedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  getHistory: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            viewedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;

      // const viewerVideoViews = await prisma.videoView.findMany({
      //   where: { userId },
      //   select: { videoId: true, viewedAt: true },
      // });

      // const data = await prisma.video.findMany({
      //   where: {
      //     visibility: 'public',
      //   },
      //   orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      //   take: limit + 1,
      //   ...(cursor
      //     ? {
      //         //hard prisma limitation here i needed to filter video by the viewedAt from the views
      //         cursor: { updatedAt: cursor.viewedAt, id: cursor.id },
      //         skip: 1,
      //       }
      //     : {}),
      //   //include might not be needed
      //   include: {
      //     user: true,
      //     category: true,
      //     VideoViews: { where: { userId } },
      //     _count: {
      //       select: { VideoViews: true, VideoReaction: { where: { reactionType: 'like' } } },
      //     },
      //   },
      // });

      const data = await prisma.videoView.findMany({
        where: { userId },
        select: {
          videoId: true,
          viewedAt: true,
          video: {
            include: {
              user: true,
              category: true,
              VideoViews: { where: { userId } },
              _count: {
                select: {
                  VideoViews: true,
                  VideoReaction: { where: { reactionType: 'like' } },
                },
              },
            },
          },
        },
        orderBy: { viewedAt: 'desc' },
        take: limit + 1,
        ...(cursor
          ? {
              cursor: { viewedAt: cursor.viewedAt, id: cursor.id },
              skip: 1,
            }
          : {}),
      });

      const hasMore = data.length > limit;
      //remove last item if there is more data
      const items = hasMore ? data.slice(0, -1) : data;
      // set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.videoId,
            viewedAt: lastItem.viewedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
