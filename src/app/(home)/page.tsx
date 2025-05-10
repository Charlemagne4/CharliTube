import HomeView from '@/modules/home/ui/views/HomeView';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic';

interface Pageprops {
  searchParams: Promise<{ categoryId?: string }>;
}

async function Page({ searchParams }: Pageprops) {
  const { categoryId } = await searchParams;

  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}
export default Page;
