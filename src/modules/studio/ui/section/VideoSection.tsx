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
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { format } from 'date-fns';
import { Globe2Icon, LockIcon } from 'lucide-react';

function VideoSection() {
  return (
    <Suspense fallback={<p>loading Video Section</p>}>
      <ErrorBoundary fallback={<p>Video Section Error</p>}>
        <VideoSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}
export default VideoSection;

function VideoSectionSuspense() {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  const router = useRouter();
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
                <TableRow
                  key={video.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/studio/videos/${video.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-4">
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
                          {video.description || 'no description'}{' '}
                        </span>
                      </div>
                    </div>
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
                  <TableCell className="text-right">Views</TableCell>
                  <TableCell className="text-right">Comments</TableCell>
                  <TableCell className="pr-6 text-right">Likes</TableCell>
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
