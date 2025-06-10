'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { DEFAULT_LIMIT } from '@/constants';
import VideoGridCard, { VideoGridCardSkeleton } from '@/modules/videos/ui/components/VideoGridCard';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function TrendingVideosSection() {
  return (
    <Suspense fallback={<TrendingVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error Trending Feed</p>}>
        <TrendingVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}
export default TrendingVideosSection;

function TrendingVideosSectionSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
        {Array.from({ length: 18 }).map((_, idx) => (
          <VideoGridCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}

function TrendingVideosSectionSuspense() {
  const [videos, query] = trpc.videos.getManyTrending.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (page) => page.nextCursor },
  );
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard data={video} key={video.id} />
          ))}
      </div>
      <InfiniteScroll isManual={false} {...query} />
    </div>
  );
}
