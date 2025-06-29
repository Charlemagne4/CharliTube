import { DEFAULT_LIMIT } from '@/constants';
import SubscribtionsView from '@/modules/Subscriptions/ui/views/SubscribtionsView';
import { HydrateClient, trpc } from '@/trpc/server';

async function Subscribtions() {
  void trpc.subscriptions.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });
  return (
    <HydrateClient>
      <SubscribtionsView />
    </HydrateClient>
  );
}
export default Subscribtions;
