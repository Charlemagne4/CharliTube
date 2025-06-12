import { DEFAULT_LIMIT } from '@/constants';
import LikedView from '@/modules/playlists/views/LikedView';
import { HydrateClient, trpc } from '@/trpc/server';

async function page() {
  void trpc.playlists.getLiked.prefetch({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <LikedView />
    </HydrateClient>
  );
}
export default page;
