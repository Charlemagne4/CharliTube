import { DEFAULT_LIMIT } from '@/constants';
import SearchView from '@/modules/search/ui/views/SearchView';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic'; // add this whenever we prefetch

interface PageProps {
  searchParams: Promise<{ query: string | undefined; categoryId: string | undefined }>;
}

async function page({ searchParams }: PageProps) {
  const { categoryId, query } = await searchParams;
  void trpc.categories.getMany.prefetch();
  void trpc.search.getMany.prefetchInfinite({ query, categoryId, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <SearchView query={query} categoryId={categoryId} />
    </HydrateClient>
  );
}
export default page;
