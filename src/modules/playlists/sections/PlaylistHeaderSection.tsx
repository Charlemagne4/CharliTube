'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/trpc/client';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

interface PlaylistHeaderSectionProps {
  playlistId: string;
}

function PlaylistHeaderSection({ playlistId }: PlaylistHeaderSectionProps) {
  return (
    <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<p>ERROR HEADER</p>}>
        <PlaylistHeaderSectionSuspence playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default PlaylistHeaderSection;

function PlaylistHeaderSectionSkeleton() {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

function PlaylistHeaderSectionSuspence({ playlistId }: PlaylistHeaderSectionProps) {
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ playlistId });

  const utils = trpc.useUtils();
  const router = useRouter();

  const remove = trpc.playlists.remove.useMutation({
    onSuccess: ({ name }) => {
      toast.success(`removed ${name}`);
      utils.playlists.getMany.invalidate();
      router.push('/playlists');
    },
    onError: (error) => {
      toast.error(`${error.data?.code}`);
    },
  });
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-muted-foreground text-xs">Videos from the playlist</p>
      </div>
      <Button
        onClick={() => remove.mutate({ playlistId })}
        variant={'outline'}
        size={'icon'}
        className="rounded-full"
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}
