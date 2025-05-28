import { ErrorBoundary } from 'react-error-boundary';
import { VideoGetOneOutput } from '../../types';
import VideoOwner from './VideoOwner';
import { Suspense, useMemo } from 'react';
import VideoReactions from './VideoReactions';
import VideoMenu from './VideoMenu';
import VideoDescription from './VideoDescription';
import { formatDistanceToNow, format } from 'date-fns';
import { $Enums } from '../../../../../generated/prisma';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoTopRowProps {
  video: VideoGetOneOutput;
  viewerReaction: $Enums.reactionType | null;
}

function VideoTopRow({ video, viewerReaction }: VideoTopRowProps) {
  return (
    <Suspense fallback={<VideoTopRowSkeleton />}>
      <ErrorBoundary fallback={<p>Error TopRow</p>}>
        <VideoTopRowSuspense video={video} viewerReaction={viewerReaction} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default VideoTopRow;

export function VideoTopRowSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-4/5 md:w-2/5" />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex w-[70%] items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-5 w-4/5 md:w-2/6" />
            <Skeleton className="h-5 w-3/5 md:h-1/5" />
          </div>
        </div>
        <Skeleton className="h-9 w-2/6 rounded-full md:w-1/6" />
      </div>
      <div className="h-[120px] w-full" />
    </div>
  );
}

function VideoTopRowSuspense({ video, viewerReaction }: VideoTopRowProps) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en', { notation: 'compact' }).format(video._count.VideoViews);
  }, [video._count.VideoViews]);
  const expandedViews = useMemo(() => {
    return Intl.NumberFormat('en', { notation: 'standard' }).format(video._count.VideoViews);
  }, [video._count.VideoViews]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createdAt, { addSuffix: true });
  }, [video.createdAt]);

  const expandedDate = useMemo(() => {
    return format(video.createdAt, 'd MM yyyy');
  }, [video.createdAt]);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{video.title}</h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <VideoOwner user={video.user} videoId={video.id} />
        <div className="-mb-2 flex gap-2 overflow-x-auto pb-2 sm:mb-0 sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible sm:pb-0">
          <VideoReactions
            videoId={video.id}
            likes={video.likesCount}
            dislikes={video.dislikesCount}
            viewerReaction={viewerReaction}
          />
          <VideoMenu videoId={video.id} variant={'secondary'} />
        </div>
      </div>
      <VideoDescription
        description={video.description}
        compactViews={compactViews}
        expandedViews={expandedViews}
        compactDate={compactDate}
        expandedDate={expandedDate}
      />
    </div>
  );
}
