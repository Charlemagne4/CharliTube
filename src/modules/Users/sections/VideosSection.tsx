'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { DEFAULT_LIMIT } from '@/constants';
import VideoGridCard, { VideoGridCardSkeleton } from '@/modules/videos/ui/components/VideoGridCard';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface UserPageVideosSectionProps {
  userId: string;
}

function UserPageVideosSection({ userId }: UserPageVideosSectionProps) {
  return (
    <Suspense key={userId} fallback={<UserPageVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error UserPage Feed</p>}>
        <UserPageVideosSectionSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default UserPageVideosSection;

function UserPageVideosSectionSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-4 [@media(min-width:2200px)]:grid-cols-4">
        {Array.from({ length: 18 }).map((_, idx) => (
          <VideoGridCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}

function UserPageVideosSectionSuspense({ userId }: UserPageVideosSectionProps) {
  const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT, userId },
    { getNextPageParam: (page) => page.nextCursor },
  );
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-4 [@media(min-width:2200px)]:grid-cols-4">
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
