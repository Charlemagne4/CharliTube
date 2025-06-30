import { DEFAULT_LIMIT } from '@/constants';
import HomeView from '@/modules/home/ui/views/HomeView';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic'; // add this whenever we prefetch

interface Pageprops {
  searchParams: Promise<{ categoryId?: string }>;
}

async function Page({ searchParams }: Pageprops) {
  const { categoryId } = await searchParams;

  void trpc.categories.getMany.prefetch();
  void trpc.videos.getMany.prefetchInfinite({ categoryId, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}
export default Page;
