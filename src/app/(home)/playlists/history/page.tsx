import { DEFAULT_LIMIT } from '@/constants';
import HistoryView from '@/modules/playlists/views/HistoryView';
import { HydrateClient, trpc } from '@/trpc/server';

async function page() {
  void trpc.playlists.getHistory.prefetch({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
}
export default page;
