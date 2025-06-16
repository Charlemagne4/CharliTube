import { Skeleton } from '@/components/ui/skeleton';
import { THUMBNAIL_FALLBACK } from '@/constants';
import { cn } from '@/lib/utils';
import { ListVideoIcon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

interface PlaylistThumbnailProps {
  title: string;
  videoCount: number;
  className?: string;
  imageUrl?: string | null;
}

export function PlaylistThumbnailSkeleton() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl transition-all group-hover:rounded-none">
      <Skeleton className="size-full" />
    </div>
  );
}

function PlaylistThumbnail({ title, videoCount, className, imageUrl }: PlaylistThumbnailProps) {
  const compactCount = useMemo(() => {
    return Intl.NumberFormat('en', { notation: 'compact' }).format(videoCount);
  }, [videoCount]);

  return (
    <div className={cn('relative pt-3', className)}>
      {/* stack layer effect */}

      <div className="relative">
        {/* background layers */}
        <div className="absolute -top-3 left-1/2 aspect-video w-[97%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/20" />
        <div className="absolute -top-1.5 left-1/2 aspect-video w-[98%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/25" />
        {/* Main Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image alt={title} src={imageUrl || THUMBNAIL_FALLBACK} className="h-full w-full" fill />
          {/* hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity ease-in-out group-hover:opacity-100">
            <div className="flex items-center gap-x-2">
              <PlayIcon className="size-4 fill-white text-white" />
              <span className="font-medium text-white">Play all</span>
            </div>
          </div>
        </div>
      </div>
      {/* video Count Indcator */}
      <div className="absolute right-2 bottom-2 flex items-center gap-x-1 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
        <ListVideoIcon className="size-4" />
        {compactCount} videos
      </div>
    </div>
  );
}
export default PlaylistThumbnail;
