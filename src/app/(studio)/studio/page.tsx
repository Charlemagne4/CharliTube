export const dynamic = 'force-dynamic'; // add this whenever we prefetch

import { DEFAULT_LIMIT } from '@/constants';
import StudioView from '@/modules/studio/views/StudioView';
import { HydrateClient, trpc } from '@/trpc/server';

async function page() {
  void trpc.studio.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
}
export default page;
