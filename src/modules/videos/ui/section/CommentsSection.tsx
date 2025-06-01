'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { DEFAULT_LIMIT } from '@/constants';
import CommentForm from '@/modules/comments/ui/components/CommentForm';
import CommentItem from '@/modules/comments/ui/components/CommentItem';
import { trpc } from '@/trpc/client';
import { Loader2Icon } from 'lucide-react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
interface CommentsSectionProps {
  videoId: string;
}

function CommentsSection({ videoId }: CommentsSectionProps) {
  return (
    <Suspense fallback={<CommentsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>errorloading comments...</p>}>
        <CommentsSectionSusepense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default CommentsSection;

function CommentsSectionSusepense({ videoId }: CommentsSectionProps) {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    { videoId, limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  const commentCount = comments.pages[0]?.commentCount ?? 0;
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">{commentCount} Comments</h1>
        <CommentForm videoId={videoId} />
        <div className="mt-2 flex flex-col gap-4">
          {comments.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          <InfiniteScroll
            isManual
            fetchNextPage={query.fetchNextPage}
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
          />
        </div>
      </div>
    </div>
  );
}

function CommentsSectionSkeleton() {
  return (
    <div className="mt-6 flex items-center justify-center">
      <Loader2Icon className="text-muted-foreground size-7 animate-spin" />
    </div>
  );
}
