import { DEFAULT_LIMIT } from '@/constants';
import PlaylistsView from '@/modules/playlists/views/PlaylistsView';
import { HydrateClient, trpc } from '@/trpc/server';

function page() {

    void trpc.playlists.getMany.prefetchInfinite({limit: DEFAULT_LIMIT})
  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  );
}
export default page;
