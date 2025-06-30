import Link from 'next/link';
import { VideoGetManyOutput } from '../../types';
import VideoThumbnail, { VideoThumbnailSkeleton } from './VideoThumbnail';
import VideoInfo, { VideoInfoSkeleton } from './VideoInfo';

interface videoGridCardProps {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
}

export function VideoGridCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <VideoThumbnailSkeleton />
      <VideoInfoSkeleton />
    </div>
  );
}

function VideoGridCard({ data, onRemove }: videoGridCardProps) {
  return (
    <div className="group flex w-full flex-col gap-2">
      <Link prefetch href={`/videos/${data.id}`}>
        <VideoThumbnail imageUrl={data.thumbnailUrl} {...data} />
      </Link>
      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
}
export default VideoGridCard;
