import { DEFAULT_LIMIT } from '@/constants';
import VideosView from '@/modules/playlists/views/VideosView';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic'; // add this whenever we prefetch

interface pageProps {
  params: Promise<{ playlistId: string }>;
}

async function page({ params }: pageProps) {
  const { playlistId } = await params;

  void trpc.playlists.getOne.prefetch({ playlistId });
  void trpc.playlists.getVideos.prefetchInfinite({ limit: DEFAULT_LIMIT, playlistId });

  return (
    <HydrateClient>
      <VideosView playlistId={playlistId} />
    </HydrateClient>
  );
}
export default page;
