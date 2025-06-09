import { cva, VariantProps } from 'class-variance-authority';
import { VideoGetManyOutput } from '../../types';
import Link from 'next/link';
import VideoThumbnail, { VideoThumbnailSkeleton } from './VideoThumbnail';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/UserAvatar';
import UserInfo from '@/modules/Users/ui/components/UserInfo';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import VideoMenu from './VideoMenu';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const videoRowCardVariants = cva('group flex min-w-0', {
  variants: {
    size: {
      default: 'gap-4',
      compact: 'gap-2',
    },
  },
  defaultVariants: { size: 'default' },
});

const thumbnailVariants = cva('relative flex-non', {
  variants: {
    size: {
      default: 'w-[38%]',
      compact: 'w-[168px]',
    },
  },
  defaultVariants: { size: 'default' },
});

interface videoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
}

export function VideoRowCardSkeleton({ size }: VariantProps<typeof videoRowCardVariants>) {
  return (
    <div className={videoRowCardVariants({ size })}>
      {/* thumbnail skeleton */}
      <div className={thumbnailVariants({ size })}>
        <VideoThumbnailSkeleton />
      </div>

      {/* info Skeleton */}
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-x-2">
          <div className="min-w-0 flex-1">
            <Skeleton className={cn('h-5 w-[40%]', size === 'compact' && 'h-4 w-[40%]')} />
            {size === 'default' && (
              <>
                <Skeleton className="mt-1 h-4 w-[20%]" />
                <div className="my-3 flex items-center gap-2">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </>
            )}
            {size === 'compact' && (
              <>
                <Skeleton className="mt-1 h-4 w-[50%]" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoRowCard({ data, onRemove, size }: videoRowCardProps) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en', { notation: 'compact' }).format(data._count.VideoViews);
  }, [data._count.VideoViews]);

  const compactReactions = useMemo(() => {
    return Intl.NumberFormat('en', { notation: 'compact' }).format(data._count.VideoReaction);
  }, [data._count.VideoReaction]);

  return (
    <div className={videoRowCardVariants({ size })}>
      <Link href={`/videos/${data.id}`} className={thumbnailVariants({ size })}>
        <VideoThumbnail imageUrl={data.thumbnailUrl} {...data} />
      </Link>
      {/* info */}
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-x-2">
          <div className="min-w-0 flex-1">
            <Link href={`/videos/${data.id}`}>
              <h3
                className={cn(
                  'line-clamp-2 font-medium',
                  size === 'compact' ? 'text-sm' : 'text-base',
                )}
              >
                {data.title}
              </h3>
              {size === 'default' && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {/* data._count.VideoReaction is the likes count */}
                  {compactViews} Views &#8226; {compactReactions} Likes
                </p>
              )}
            </Link>
            {size === 'default' && (
              <Link href={`/users/${data.user.id}`}>
                <div className="my-3 flex items-center gap-2">
                  <UserAvatar size={'sm'} imageUrl={data.user.image} name={data.user.name} />
                  <UserInfo name={data.user.name} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-muted-foreground line-clamp-2 w-fit text-xs">
                      {data.description ?? 'No description'}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" className="bg-black/70">
                    <p>From the video description</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            )}
            {size === 'compact' && (
              <Link href={`/users/${data.user.id}`}>
                <UserInfo size={'sm'} name={data.user.name} />
                <p className="text-muted-foreground mt-1 text-xs">
                  {/* data._count.VideoReaction is the likes count */}
                  {compactViews} Views &#8226; {compactReactions} Likes
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="flex-none">
        <VideoMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  );
}
export default VideoRowCard;
