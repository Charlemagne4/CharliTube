'use client';

import CommentForm from '@/modules/comments/ui/components/CommentForm';
import CommentItem from '@/modules/comments/ui/components/CommentItem';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
interface CommentsSectionProps {
  videoId: string;
}

function CommentsSection({ videoId }: CommentsSectionProps) {
  return (
    <Suspense fallback={<p>loading comments...</p>}>
      <ErrorBoundary fallback={<p>errorloading comments...</p>}>
        <CommentsSectionSusepense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default CommentsSection;

function CommentsSectionSusepense({ videoId }: CommentsSectionProps) {
  const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId });
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1>0 comments</h1>
        <CommentForm videoId={videoId} />
        <div className="mt-2 flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}
