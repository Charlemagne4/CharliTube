export const dynamic = 'force-dynamic';

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
