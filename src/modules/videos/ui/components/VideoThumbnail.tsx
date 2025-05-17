import { formatDuration } from '@/lib/utils';
import Image from 'next/image';

interface VideoThumbnailProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  title: string;
  duration: number | null;
}
function VideoThumbnail({ imageUrl, previewUrl, title, duration }: VideoThumbnailProps) {
  return (
    <div className="group relative">
      {/* Thumbnail wrapper */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={imageUrl ?? '/placeholder.svg'}
          alt={title}
          fill
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          src={previewUrl ?? '/placeholder.svg'}
          alt={title}
          fill
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>
      {/* Duration box */}
      <div className="absolute right-2 bottom-2 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
        {formatDuration(duration || 0)}
      </div>
      {/* TODO: add video duration box */}
      <div></div>
    </div>
  );
}
export default VideoThumbnail;
