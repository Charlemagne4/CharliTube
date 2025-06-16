import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const playlistsRouter = createTRPCRouter({
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
        where: { userId },
        include: { playListVideos: true, user: true, _count: { select: { playListVideos: true } } },
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
