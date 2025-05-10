'use client';
import FilterCarousel from '@/components/FilterCarousel';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface CategoriesSectionProps {
  categoryId?: string;
}

function CategoriesSection({ categoryId }: CategoriesSectionProps) {
  return (
    <div>
      <Suspense fallback={<FilterCarousel isLoading data={[]} onSelect={() => {}} />}>
        <ErrorBoundary fallback={<p>Category error...</p>}>
          <CategoriesSectionSuspense categoryId={categoryId} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
export default CategoriesSection;

function CategoriesSectionSuspense({ categoryId }: CategoriesSectionProps) {
  const router = useRouter();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const data = categories.map((c) => ({ label: c.name, value: c.id }));

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set('categoryId', value);
    } else {
      url.searchParams.delete('categoryId');
    }
    router.push(url.toString());
  };

  return <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />;
}
