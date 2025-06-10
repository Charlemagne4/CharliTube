'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { DEFAULT_LIMIT } from '@/constants';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoGridCard from '@/modules/videos/ui/components/VideoGridCard';
import VideoRowCard from '@/modules/videos/ui/components/VideoRowCard';
import { trpc } from '@/trpc/client';

interface ResultSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

function ResultSection({ categoryId, query }: ResultSectionProps) {
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
export default ResultSection;
