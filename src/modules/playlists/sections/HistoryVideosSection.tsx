'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { DEFAULT_LIMIT } from '@/constants';
import VideoGridCard, { VideoGridCardSkeleton } from '@/modules/videos/ui/components/VideoGridCard';
import VideoRowCard, { VideoRowCardSkeleton } from '@/modules/videos/ui/components/VideoRowCard';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function HistoryVideosSection() {
  return (
    <Suspense fallback={<HistoryVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error History Feed</p>}>
        <HistoryVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}
export default HistoryVideosSection;

function HistoryVideosSectionSkeleton() {
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

function HistoryVideosSectionSuspense() {
  const [data, query] = trpc.playlists.getHistory.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (page) => page.nextCursor },
  );
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 lg:hidden">
        {data.pages
          .flatMap((page) => page.items)
          .map((view) => (
            <VideoGridCard data={view.video} key={view.video.id} />
          ))}
      </div>
      <div className="hidden flex-col gap-4 lg:flex">
        {data.pages
          .flatMap((page) => page.items)
          .map((view) => (
            <VideoRowCard data={view.video} key={view.video.id} size={'default'} />
          ))}
      </div>
      <InfiniteScroll isManual={false} {...query} />
    </div>
  );
}
