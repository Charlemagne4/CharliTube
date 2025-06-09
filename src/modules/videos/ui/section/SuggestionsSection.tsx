'use client';

import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import VideoRowCard, { VideoRowCardSkeleton } from '../components/VideoRowCard';
import VideoGridCard, { VideoGridCardSkeleton } from '../components/VideoGridCard';
import InfiniteScroll from '@/components/InfiniteScroll';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface SuggestionsSectionProps {
  videoId: string;
  isManual?: boolean;
}

function SuggestionsSection({ videoId, isManual }: SuggestionsSectionProps) {
  return (
    <Suspense fallback={<SuggestionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Suggestions Error</p>}>
        <SuggestionsSectionSuspence videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default SuggestionsSection;

function SuggestionsSectionSkeleton() {
  return (
    <>
      <div className="hidden space-y-3 md:block">
        {Array.from({ length: DEFAULT_LIMIT }).map((_, idx) => (
          <VideoRowCardSkeleton key={idx} size={'compact'} />
        ))}
      </div>
      <div className="block space-y-10 md:hidden">
        {Array.from({ length: DEFAULT_LIMIT }).map((_, idx) => (
          <VideoGridCardSkeleton key={idx} />
        ))}
      </div>
    </>
  );
}

function SuggestionsSectionSuspence({ videoId, isManual }: SuggestionsSectionProps) {
  const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      videoId,
    },
    { getNextPageParam: (page) => page.nextCursor },
  );

  return (
    <>
      <div className="hidden space-y-3 md:block">
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard data={video} key={video.id} size={'compact'} />
          ))}
      </div>
      <div className="block space-y-10 md:hidden">
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard data={video} key={video.id} />
          ))}
      </div>
      <InfiniteScroll
        isManual={isManual}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
}
