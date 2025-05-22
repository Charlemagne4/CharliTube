import { ErrorBoundary } from 'react-error-boundary';
import { VideoGetOneOutput } from '../../types';
import VideoOwner from './VideoOwner';
import { Suspense } from 'react';
import VideoReactions from './VideoReactions';
import VideoMenu from './VideoMenu';
import VideoDescription from './VideoDescription';

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
        compactViews={'1m'}
        expandedViews={'1 002 353'}
        compactDate={'13/03/2009'}
        expandedDate={'13th March 2009'}
      />
    </div>
  );
}
