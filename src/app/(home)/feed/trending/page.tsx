import { DEFAULT_LIMIT } from '@/constants';
import TrendingView from '@/modules/home/ui/views/TrendingView';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic'; // add this whenever we prefetch

async function Page() {
  void trpc.videos.getManyTrending.prefetchInfinite({ limit: DEFAULT_LIMIT });
  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
}
export default Page;
