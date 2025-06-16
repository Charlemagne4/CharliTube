import InfiniteScroll from '@/components/InfiniteScroll';
import ResponsiveModal from '@/components/ResponsiveModal';
import { Button } from '@/components/ui/button';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import { Loader2Icon, SquareCheckIcon, SquareIcon } from 'lucide-react';
import { toast } from 'sonner';

interface PlaylistAddModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function PlaylistAddModal({ onOpenChange, open, videoId }: PlaylistAddModalProps) {
  const utils = trpc.useUtils();
  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      utils.playlists.getManyForVideo.invalidate({ videoId });
    }
    onOpenChange(newOpen);
  }
  const {
    data: playlists,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery(
    { limit: DEFAULT_LIMIT, videoId },
    {
      getNextPageParam: (page) => page.nextCursor,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: !!videoId && open,
    },
  );
  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: ({ playlist }) => {
      toast.success(`video added to ${playlist.name}`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
      //TODO: invalidate playlists.getOne
    },
    onError: () => {
      toast.error(`something went wrong`);
    },
  });
  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: ({ playlist }) => {
      toast.success(`video removed from ${playlist.name}`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
    },
    onError: () => {
      toast.error(`something went wrong`);
    },
  });
  return (
    <ResponsiveModal open={open} title={'Add a playlist'} onOpenChange={handleOpenChange}>
      {isLoading && (
        <div className="flex justify-center p-4">
          <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
        </div>
      )}
      {!isLoading &&
        playlists?.pages
          .flatMap((page) => page.items)
          .map((playlist) => (
            <Button
              onClick={() => {
                if (playlist.containsVideo) {
                  return removeVideo.mutate({ playlistId: playlist.id, videoId });
                }
                if (!playlist.containsVideo) {
                  return addVideo.mutate({ playlistId: playlist.id, videoId });
                }
              }}
              disabled={removeVideo.isPending || addVideo.isPending}
              size={'lg'}
              className="w-full justify-start px-2 [&_svg]:size-5"
              variant={'ghost'}
              key={playlist.id}
            >
              {playlist.containsVideo ? (
                <SquareCheckIcon className="mr-4" />
              ) : (
                <SquareIcon className="mr-4" />
              )}
              {playlist.name}
            </Button>
          ))}
      {!isLoading && (
        <InfiniteScroll
          isManual
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </ResponsiveModal>
  );
}
export default PlaylistAddModal;
