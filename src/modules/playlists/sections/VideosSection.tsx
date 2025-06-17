'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { DEFAULT_LIMIT } from '@/constants';
import VideoGridCard, { VideoGridCardSkeleton } from '@/modules/videos/ui/components/VideoGridCard';
import VideoRowCard, { VideoRowCardSkeleton } from '@/modules/videos/ui/components/VideoRowCard';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

interface VideosSectionProps {
  playlistId: string;
}
function VideosSection({ playlistId }: VideosSectionProps) {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error Feed</p>}>
        <VideosSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default VideosSection;

function VideosSectionSkeleton() {
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 lg:hidden">
        {Array.from({ length: 18 }).map((_, idx) => (
          <VideoGridCardSkeleton key={idx} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 lg:flex">
        {Array.from({ length: 18 }).map((_, idx) => (
          <VideoRowCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}

function VideosSectionSuspense({ playlistId }: VideosSectionProps) {
  const [data, query] = trpc.playlists.getVideos.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT, playlistId },
    { getNextPageParam: (page) => page.nextCursor },
  );

  const utils = trpc.useUtils();

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: ({ playlist, playlistId, videoId }) => {
      toast.success(`video removed from ${playlist.name}`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
      utils.playlists.getOne.invalidate({ playlistId });
      utils.playlists.getVideos.invalidate({ playlistId });
    },
    onError: () => {
      toast.error(`something went wrong`);
    },
  });
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 lg:hidden">
        {data.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard
              data={video}
              key={video.id}
              onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })}
            />
          ))}
      </div>
      <div className="hidden flex-col gap-4 lg:flex">
        {data.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard
              data={video}
              key={video.id}
              size={'default'}
              onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })}
            />
          ))}
      </div>
      <InfiniteScroll isManual={false} {...query} />
    </div>
  );
}
