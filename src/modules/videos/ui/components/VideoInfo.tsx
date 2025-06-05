import { useMemo } from 'react';
import { VideoGetManyOutput } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar';
import UserInfo from '@/modules/Users/ui/components/UserInfo';
import VideoMenu from './VideoMenu';

interface VideoInfoProps {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
}
function VideoInfo({ data, onRemove }: VideoInfoProps) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en', { notation: 'compact' }).format(data._count.VideoViews);
  }, [data._count.VideoViews]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt, { addSuffix: true });
  }, [data.createdAt]);

  return (
    <div className="flex gap-3">
      <Link href={`/users/${data.userId}`}>
        <UserAvatar imageUrl={data.user.image} name={data.user.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/videos/${data.id}`}>
          <h3 className="line-clamp-1 text-base font-medium break-words lg:line-clamp-2">
            {data.title}
          </h3>
        </Link>
        <Link href={`/users/${data.userId}`}>
          <UserInfo name={data.user.name} />
        </Link>

        <Link href={`/videos/${data.id}`}>
          <p className="line-clamp-1 text-sm text-gray-600">
            {compactViews} views &#8226; {compactDate}
          </p>
        </Link>
      </div>
      <div className="shrink-0">
        <VideoMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  );
}
export default VideoInfo;
