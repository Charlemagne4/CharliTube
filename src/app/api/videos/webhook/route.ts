import { env } from '@/data/server';
import { mux } from '@/lib/mux';
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent
} from '@mux/mux-node/resources/webhooks';
import { headers } from 'next/headers';
import { prisma } from '../../../../../prisma/prisma';
const SIGNING_SECRET = env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetTrackReadyWebhookEvent;

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
  const body = JSON.stringify(payLoad);

  mux.webhooks.verifySignature(
    body,
    {
      'mux-signature': muxSignature
    },
    SIGNING_SECRET
  );

  switch (payLoad.type as WebhookEvent['type']) {
    case 'video.asset.created': {
      const data = payLoad.data as VideoAssetCreatedWebhookEvent['data'];

      if (!data.upload_id) {
        return new Response('(create) Upload ID not found', { status: 400 });
      }

      try {
        const updatedVideo = await prisma.video.update({
          where: { muxUploadId: data.upload_id },
          data: {
            muxStatus: data.status,
            muxAssetId: data.id
          }
        });

        console.log('Video updated:', updatedVideo);
      } catch (error) {
        console.error('Failed to update video:', error);
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
        const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
        const previewUrl = `https://image.mux.com/${playbackId}/animated.gif`;

        const duration = data.duration ? Math.round(data.duration * 1000) : 0;

        const updatedVideo = await prisma.video.update({
          where: { muxUploadId: data.upload_id },
          data: {
            muxStatus: data.status,
            muxPlaybackId: playbackId,
            muxAssetId: data.id,
            thumbnailUrl,
            previewUrl,
            duration
          }
        });

        console.log('Video updated:', updatedVideo);
      } catch (error) {
        console.error('Failed to update video:', error);
        return new Response('Video not found or database error', { status: 404 });
      }
      break;
    }

    default:
      return new Response('Event type not handled', { status: 200 });
  }

  return new Response('Webhook recieved', { status: 200 });
}
