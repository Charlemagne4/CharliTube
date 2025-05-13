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
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

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
                  <TableCell>{video.title}</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>{video.createdAt.toISOString()}</TableCell>
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
