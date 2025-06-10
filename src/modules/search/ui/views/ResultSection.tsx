'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { DEFAULT_LIMIT } from '@/constants';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoGridCard, { VideoGridCardSkeleton } from '@/modules/videos/ui/components/VideoGridCard';
import VideoRowCard, { VideoRowCardSkeleton } from '@/modules/videos/ui/components/VideoRowCard';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ResultSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

function ResultSection({ categoryId, query }: ResultSectionProps) {
  return (
    <Suspense key={`${query}-${categoryId}`} fallback={<ResultSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error Search</p>}>
        <ResultSectionSuspense query={query} categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default ResultSection;

function ResultSectionSkeleton() {
  //   const isMobile = useIsMobile();
  //   return (
  //     <>
  //       {isMobile ? (
  //         <div className="flex flex-col gap-4 gap-y-10">
  //           {Array.from({ length: DEFAULT_LIMIT }).map((_, idx) => (
  //             <VideoGridCardSkeleton key={idx} />
  //           ))}
  //         </div>
  //       ) : (
  //         <div className="flex flex-col gap-4">
  //           {Array.from({ length: DEFAULT_LIMIT }).map((_, idx) => (
  //             <VideoRowCardSkeleton key={idx} />
  //           ))}
  //         </div>
  //       )}
  //     </>
  //   );

  return (
    <div>
      <div className="hidden flex-col gap-4 md:flex">
        {Array.from({ length: DEFAULT_LIMIT }).map((_, idx) => (
          <VideoRowCardSkeleton key={idx} />
        ))}
      </div>
      <div className="flex flex-col gap-4 gap-y-10 p-4 pt-6 md:hidden">
        {Array.from({ length: DEFAULT_LIMIT }).map((_, idx) => (
          <VideoGridCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}

function ResultSectionSuspense({ categoryId, query }: ResultSectionProps) {
  const [searchResult, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    { categoryId, query, limit: DEFAULT_LIMIT },
    { getNextPageParam: (page) => page.nextCursor },
  );

  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {searchResult.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {searchResult.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} />
            ))}
        </div>
      )}
      <InfiniteScroll
        hasNextPage={resultQuery.hasNextPage}
        isFetchingNextPage={resultQuery.isFetchingNextPage}
        fetchNextPage={resultQuery.fetchNextPage}
      />
    </>
  );
}
