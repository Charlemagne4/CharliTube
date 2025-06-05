import Link from 'next/link';
import { VideoGetManyOutput } from '../../types';
import VideoThumbnail from './VideoThumbnail';
import VideoInfo from './VideoInfo';

interface videoGridCardProps {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
}

function VideoGridCard({ data, onRemove }: videoGridCardProps) {
  return (
    <div className="group flex w-full flex-col gap-2">
      <Link href={`/videos/${data.id}`}>
        <VideoThumbnail imageUrl={data.thumbnailUrl} {...data} />
      </Link>
      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
}
export default VideoGridCard;
