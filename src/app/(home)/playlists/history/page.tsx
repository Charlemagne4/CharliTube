import { DEFAULT_LIMIT } from '@/constants';
import HistoryView from '@/modules/playlists/views/HistoryView';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic'; // add this whenever we prefetch

async function page() {
  void trpc.playlists.getHistory.prefetch({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
}
export default page;
