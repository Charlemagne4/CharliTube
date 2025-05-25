import { ErrorBoundary } from 'react-error-boundary';
import { VideoGetOneOutput } from '../../types';
import VideoOwner from './VideoOwner';
import { Suspense, useMemo } from 'react';
import VideoReactions from './VideoReactions';
import VideoMenu from './VideoMenu';
import VideoDescription from './VideoDescription';
import { formatDistanceToNow, format } from 'date-fns';

interface VideoTopRowProps {
  video: VideoGetOneOutput;
}

function VideoTopRow({ video }: VideoTopRowProps) {
  return (
    <Suspense fallback={<p>Loading TopRow</p>}>
      <ErrorBoundary fallback={<p>Error TopRow</p>}>
        <VideoTopRowSuspense video={video} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default VideoTopRow;

function VideoTopRowSuspense({ video }: VideoTopRowProps) {
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
          <VideoReactions />
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
