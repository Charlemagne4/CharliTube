'use client';

import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';

function VideoSection() {
  const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const allItems = data.pages.flatMap((page) => page.items);

  return (
    <div>
      <div>
        <span>Total items: {allItems.length}</span>
      </div>
      <div>{JSON.stringify(data)}</div>;
    </div>
  );
}
export default VideoSection;
