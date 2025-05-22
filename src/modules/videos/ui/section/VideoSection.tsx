'use client';

import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import VideoPlayer from '../components/VideoPlayer';
import VideoBanner from '../components/VideoBanner';
import VideoTopRow from '../components/VideoTopRow';

interface VideoSectionProps {
  videoId: string;
}

function VideoSection({ videoId }: VideoSectionProps) {
  return (
    <Suspense fallback={<p>Loading VideoSection</p>}>
      <ErrorBoundary fallback={<p>error VideoSection</p>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default VideoSection;

function VideoSectionSuspense({ videoId }: VideoSectionProps) {
  const [video] = trpc.videos.getOne.useSuspenseQuery({ videoId });

  return (
    <>
      <div
        className={cn(
          'relative aspect-video overflow-hidden rounded-xl bg-black',
          video.muxStatus !== 'ready' && 'rounded-b-none',
        )}
      >
        <VideoPlayer
          // autoPlay
          onPlay={() => {}}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
        {JSON.stringify(video)}
      </div>
      <VideoBanner
        // status="Waiting"
        status={video.muxStatus}
      />
      <VideoTopRow video={video} />
    </>
  );
}
