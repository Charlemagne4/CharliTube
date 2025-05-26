import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { $Enums } from '../../../../../generated/prisma';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface VideoReactionsProps {
  dislikes: number;
  likes: number;
  videoId: string;
  viewerReaction: $Enums.reactionType | null;
}

function VideoReactions({ dislikes, likes, videoId, viewerReaction }: VideoReactionsProps) {
  return (
    <div>
      <Suspense
        fallback={
          <p>
            <p>loading VideoReactions</p>
          </p>
        }
      >
        <ErrorBoundary fallback={<p>error VideoReactions</p>}>
          <VideoReactionsSuspense
            dislikes={dislikes}
            likes={likes}
            videoId={videoId}
            viewerReaction={viewerReaction}
          />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
export default VideoReactions;

function VideoReactionsSuspense({ dislikes, likes, videoId, viewerReaction }: VideoReactionsProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const like = trpc.reactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
      utils.reactions.getOne.invalidate({ videoId });
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push('/signin');
        toast.error('Login to react');
      }
    },
  });
  const dislike = trpc.reactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
      utils.reactions.getOne.invalidate({ videoId });
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push('/signin');
        toast.error('Something went wrong');
      }
    },
  });

  return (
    <div className="flex flex-none items-center">
      <Button
        onClick={() => {
          like.mutate({ videoId });
        }}
        disabled={like.isPending || dislike.isPending}
        className="gap-2 rounded-l-full rounded-r-none pr-4"
        variant={'secondary'}
      >
        <ThumbsUpIcon className={cn('size-5', viewerReaction === 'like' && 'fill-black')} />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        onClick={() => {
          dislike.mutate({ videoId });
        }}
        disabled={like.isPending || dislike.isPending}
        className="rounded-l-none rounded-r-full pl-3"
        variant={'secondary'}
      >
        <ThumbsDownIcon className={cn('size-5', viewerReaction === 'dislike' && 'fill-black')} />
        {dislikes}
      </Button>
    </div>
  );
}
