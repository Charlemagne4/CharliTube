import { env } from '@/data/server';
import { mux } from '@/lib/mux';
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
  VideoAssetDeletedWebhookEvent,
} from '@mux/mux-node/resources/webhooks';
import { headers } from 'next/headers';
import { prisma } from '../../../../../prisma/prisma';
import { UTApi } from 'uploadthing/server';
import { logger } from '@/utils/pino';
const SIGNING_SECRET = env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent;

export async function POST(request: Request) {
  if (!SIGNING_SECRET) {
    throw new Error('MUX_WEBHOOK_SECRET is not set');
  }

  const headersPayload = await headers();

  const muxSignature = headersPayload.get('mux-signature');

  if (!muxSignature) {
    return new Response('no signature found', { status: 401 });
  }

  const payLoad = await request.json();
  logger.info('WEBHOOK HIT BY: ', payLoad.type as WebhookEvent['type']);
  const body = JSON.stringify(payLoad);

  mux.webhooks.verifySignature(
    body,
    {
      'mux-signature': muxSignature,
    },
    SIGNING_SECRET,
  );

  switch (payLoad.type as WebhookEvent['type']) {
    case 'video.asset.created': {
      const data = payLoad.data as VideoAssetCreatedWebhookEvent['data'];
      logger.info('creating Video');

      if (!data.upload_id) {
        return new Response('(create) Upload ID not found', { status: 400 });
      }

      try {
        const updatedVideo = await prisma.video.update({
          where: { muxUploadId: data.upload_id },
          data: {
            muxStatus: data.status,
            muxAssetId: data.id,
          },
        });

        logger.info('Video updated:', updatedVideo.id);
        return new Response('Video Created', { status: 200 });
      } catch (error) {
        logger.error('Failed to update video:', error);
        return new Response('Video not found or database error', { status: 404 });
      }

      break;
    }
    case 'video.asset.ready': {
      const data = payLoad.data as VideoAssetReadyWebhookEvent['data'];

      const playbackId = data.playback_ids?.[0].id;
      if (!data.upload_id) {
        return new Response('(ready) Upload ID not found', { status: 400 });
      }
      if (!playbackId) {
        return new Response('Playback Id not found', { status: 400 });
      }
      try {
        const existingVideo = await prisma.video.findUnique({
          where: { muxUploadId: data.upload_id },
          select: {
            muxPlaybackId: true,
            muxAssetId: true,
            thumbnailKey: true,
            previewKey: true,
            thumbnailUrl: true,
            previewUrl: true,
          },
        });
        console.warn('THIS MUST BE UNDEFINED or NULL', existingVideo?.muxPlaybackId);
        //this is some next level BS from AI careful next time
        if (existingVideo?.muxPlaybackId) {
          return new Response('Video already processed', { status: 200 });
        }

        // Check if thumbnail and preview already exist
        let thumbnailKey = existingVideo?.thumbnailKey;
        let thumbnailUrl = existingVideo?.thumbnailUrl;
        let previewKey = existingVideo?.previewKey;
        let previewUrl = existingVideo?.previewUrl;
        // If any of them is missing, generate and upload

        const utApi = new UTApi();
        if (!thumbnailUrl) {
          const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
          const uploadedThumbnail = await utApi.uploadFilesFromUrl(tempThumbnailUrl);
          thumbnailKey = uploadedThumbnail?.data?.key;
          thumbnailUrl = uploadedThumbnail?.data?.ufsUrl;

          console.log('readying Video', tempThumbnailUrl);
        }
        if (!previewUrl) {
          const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
          const uploadedPreview = await utApi.uploadFilesFromUrl(tempPreviewUrl);
          previewKey = uploadedPreview?.data?.key;
          previewUrl = uploadedPreview?.data?.ufsUrl;

          console.log('readying Video', previewUrl);
        }

        const duration = data.duration ? Math.round(data.duration * 1000) : 0;

        if (!thumbnailKey || !previewKey) {
          throw new Error('Failed to upload thumbnail');
        }

        const updatedVideo = await prisma.video.update({
          where: { muxUploadId: data.upload_id },
          data: {
            muxStatus: data.status,
            muxPlaybackId: playbackId,
            muxAssetId: data.id,
            duration,
            ...(thumbnailKey && { thumbnailKey, thumbnailUrl }),
            ...(previewKey && { previewKey, previewUrl }),
            // ...(thumbnailUrl && { thumbnailUrl }),
            // ...(previewUrl && { previewUrl }),
          },
        });

        logger.info('Video updated:', updatedVideo.id);
        return new Response('Video updated', { status: 200 });
      } catch (error) {
        logger.error('Failed to update video:', error);
        return new Response('Video not found or database error', { status: 404 });
      }
      break;
    }
    case 'video.asset.errored': {
      const data = payLoad.data as VideoAssetErroredWebhookEvent['data'];

      if (!data.upload_id) {
        return new Response('(ready) Upload ID not found', { status: 400 });
      }
      try {
        const updatedVideo = await prisma.video.update({
          data: { muxStatus: data.status },
          where: { muxUploadId: data.upload_id },
        });

        logger.info('Video Error:', updatedVideo.id);
        return new Response('error handled', { status: 200 });
      } catch (error) {
        logger.error('Failed to update error in video:', error);
        return new Response('database error', { status: 404 });
      }
      break;
    }
    case 'video.asset.deleted': {
      const data = payLoad.data as VideoAssetDeletedWebhookEvent['data'];
      logger.info('deleting Video');
      if (!data.upload_id) {
        return new Response('(ready) Upload ID not found', { status: 400 });
      }
      try {
        const deletedVideo = await prisma.video.delete({
          where: { muxUploadId: data.upload_id },
        });

        const utApi = new UTApi();
        const cleanUpAfterDeletion = [];
        if (deletedVideo.previewKey) cleanUpAfterDeletion.push(deletedVideo.previewKey);
        if (deletedVideo.thumbnailKey) cleanUpAfterDeletion.push(deletedVideo.thumbnailKey);
        void utApi.deleteFiles(cleanUpAfterDeletion);

        logger.info('deleted Video:', deletedVideo.id);
        return new Response('Asset deleted', { status: 200 });
      } catch (error) {
        logger.error('Failed to delete video:', error);
        return new Response('Video not found or database error', { status: 404 });
      }
      break;
    }
    case 'video.asset.track.ready': {
      const data = payLoad.data as VideoAssetTrackReadyWebhookEvent['data'] & { asset_id: string };
      try {
        const assetId = data.asset_id;
        const trackId = data.id;
        const status = data.status;

        if (!assetId) {
          return new Response('(track ready) Asset ID not found', { status: 400 });
        }

        const updatedResult = await prisma.video.updateMany({
          data: { muxTrackStatus: status, muxTrackId: trackId },
          where: { muxAssetId: assetId },
        });

        if (updatedResult.count === 0) {
          throw new Error(`No video found with muxAssetId: ${assetId}`);
        }

        if (updatedResult.count > 1) {
          throw new Error('Mux Duplicated assetId detected');
        }
        logger.info('Video track Ready');
        return new Response('track status handled', { status: 200 });
      } catch (error) {
        logger.error('Failed to update video:', error);
        return new Response('Video not found or database error', { status: 404 });
      }
      break;
    }
    default:
      return new Response('Event type not handled', { status: 200 });
  }

  return new Response('Webhook recieved', { status: 200 });
}
