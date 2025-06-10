'use client';

import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Suspense, useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import VideoPlayer, { VideoPlayerSkeleton } from '../components/VideoPlayer';
import VideoBanner from '../components/VideoBanner';
import VideoTopRow, { VideoTopRowSkeleton } from '../components/VideoTopRow';
import { useSession } from 'next-auth/react';

interface VideoSectionProps {
  videoId: string;
  anonId: string;
}

function VideoSection({ videoId, anonId }: VideoSectionProps) {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error VideoSection</p>}>
        <VideoSectionSuspense videoId={videoId} anonId={anonId} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default VideoSection;

function VideoSectionSuspense({ videoId, anonId }: VideoSectionProps) {
  const utils = trpc.useUtils();
  const [video] = trpc.videos.getOne.useSuspenseQuery({ videoId });
  const [viewerReaction] = trpc.reactions.getOne.useSuspenseQuery({ videoId });
  //TODO: check if this create race conditions when video plays but session is not ready
  const addView = trpc.views.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
      // toast.success('Nice choice');
    },
  });
  const { data: session } = useSession();
  let userId: string | null = null;
  if (session?.user) {
    userId = session.user.id;
  }
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!hasFiredRef.current && videoId && anonId) {
      addView.mutate({ videoId, anonId, userId: userId ?? 'ANON' });
      hasFiredRef.current = true;
    }
  }, [videoId, anonId, userId, addView]);

  return (
    <>
      <div
        className={cn(
          'relative aspect-video overflow-hidden rounded-xl bg-black',
          video.muxStatus !== 'ready' && 'rounded-b-none',
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={() => {}}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner
        // status="Waiting"
        status={video.muxStatus}
      />
      <VideoTopRow video={video} viewerReaction={viewerReaction} />
    </>
  );
}

function VideoSectionSkeleton() {
  return (
    <>
      <VideoPlayerSkeleton />
      <VideoTopRowSkeleton />
    </>
  );
}
