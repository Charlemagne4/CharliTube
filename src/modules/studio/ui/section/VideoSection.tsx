'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import VideoThumbnail from '@/modules/videos/ui/components/VideoThumbnail';
import { snakeCaseToTitle } from '@/lib/utils';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { format } from 'date-fns';
import { Globe2Icon, LockIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

function VideoSection() {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Video Section Error</p>}>
        <VideoSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}
export default VideoSection;

function VideoSectionSkeleton() {
  return (
    <>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[510px] pl-6">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="pr-6 text-right">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-36" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-12" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-12" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-12 pr-6" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function VideoSectionSuspense() {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[510px] pl-6">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="pr-6 text-right">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <TableRow key={video.id} className="hover:bg-gray-50">
                  <TableCell className="pl-6">
                    <Link href={`/studio/videos/${video.id}`} className="flex items-center gap-4">
                      <div className="relative aspect-video w-36 shrink-0">
                        <VideoThumbnail
                          previewUrl={video.previewUrl}
                          imageUrl={video.thumbnailUrl}
                          title={video.title}
                          duration={video.duration}
                        />
                      </div>
                      <div className="flex flex-col gap-y-1 overflow-hidden">
                        <span className="line-clamp-1 text-sm">{video.title}</span>
                        <span className="text-muted-foreground line-clamp-1 text-xs">
                          {video.description || 'no description'}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {video.visibility == 'private' ? (
                        <LockIcon className="mr-2 size-4" />
                      ) : (
                        <Globe2Icon className="mr-2 size-4" />
                      )}
                      {snakeCaseToTitle(video.visibility || 'Visibility error')}
                    </div>
                  </TableCell>
                  <TableCell className="truncate text-sm">
                    <div className="flex items-center">{snakeCaseToTitle(video.muxStatus)}</div>
                  </TableCell>
                  <TableCell>{format(new Date(video.createdAt), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="text-right text-sm">Views</TableCell>
                  <TableCell className="text-right text-sm">Comments</TableCell>
                  <TableCell className="pr-6 text-right text-sm">Likes</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
}
