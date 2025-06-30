import { DEFAULT_LIMIT } from '@/constants';
import SubscriptionsView from '@/modules/home/ui/views/SubsciptionsView';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic'; // add this whenever we prefetch

async function Page() {
  void trpc.videos.getManySubscribed.prefetchInfinite({ limit: DEFAULT_LIMIT });
  return (
    <HydrateClient>
      <SubscriptionsView />
    </HydrateClient>
  );
}
export default Page;
