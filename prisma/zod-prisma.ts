import { z } from 'zod';
import { Visibility } from '../generated/prisma';

export const VideoUpdateSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId'),

  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable().optional(),

  categoryId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId')
    .nullable()
    .optional(),

  visibility: z.nativeEnum(Visibility).nullable().optional(), // ← changed here

  thumbnailUrl: z.string().url().nullable().optional(),
  previewUrl: z.string().url().nullable().optional(),

  duration: z.number().int().nonnegative().nullable().optional(), // ← just in case
});

export const VideoCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),

  categoryId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId')
    .optional(),

  muxStatus: z.string().min(1, 'Mux status is required'),
  muxAssetId: z.string().optional(),
  muxUploadId: z.string().min(1, 'Mux upload ID is required'),
  muxPlaybackId: z.string().optional(),
  muxTrackId: z.string().optional(),
  muxTrackStatus: z.string().optional(),

  visibility: z.enum(['private', 'public', 'unlisted']).optional(),
  thumbnailUrl: z.string().url().optional(),
  previewUrl: z.string().url().optional(),

  duration: z.number().int().nonnegative().optional(),

  userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user ID'),
});

export const VideoSelectSchema = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  category: z.boolean().optional(), // or use a nested schema if needed

  muxStatus: z.boolean().optional(),
  muxAssetId: z.boolean().optional(),
  muxUploadId: z.boolean().optional(),
  muxPlaybackId: z.boolean().optional(),
  muxTrackId: z.boolean().optional(),
  muxTrackStatus: z.boolean().optional(),

  visibility: z.boolean().optional(),
  thumbnailUrl: z.boolean().optional(),
  previewUrl: z.boolean().optional(),
  duration: z.boolean().optional(),

  userId: z.boolean().optional(),
  user: z.boolean().optional(), // or use a nested schema if needed

  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
});

export const videoViewCreateSchema = z.object({
  videoId: z.string().length(24, 'Invalid ObjectId'),
  userId: z.string().length(24, 'Invalid ObjectId').optional().nullable(),
  anonId: z.string().optional().nullable(),
});

export const videoViewUpdateSchema = z.object({
  videoId: z.string().length(24, 'Invalid ObjectId').optional(),
  userId: z.string().length(24, 'Invalid ObjectId').optional().nullable(),
  anonId: z.string().optional().nullable(),
  viewedAt: z.date().optional(),
});

export const videViewSelectSchema = z.object({
  id: z.string(),
  videoId: z.string(),
  userId: z.string().nullable(),
  anonId: z.string().nullable(),
  viewedAt: z.date(),
});

const ReactionTypeSchema = z.enum(['like', 'dislike']);

export const VideoReactionSelectSchema = z.object({
  userId: z.string().optional(),
  videoId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format')
    .optional(),
  reactionType: ReactionTypeSchema.optional(),
});

export const CreateVideoReactionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  videoId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format'),
  reactionType: ReactionTypeSchema,
});

export const UpdateVideoReactionSchema = z.object({
  reactionType: ReactionTypeSchema,
});
