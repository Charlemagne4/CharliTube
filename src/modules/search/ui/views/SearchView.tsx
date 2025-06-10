import CategoriesSection from '../sections/CategoriesSection';
import ResultSection from './ResultSection';

interface PageProps {
  query: string | undefined;
  categoryId: string | undefined;
}

function SearchView({ categoryId, query }: PageProps) {
  return (
    <div className="mx-auto mb-10 flex max-w-[1300px] flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSection categoryId={categoryId} />
      <ResultSection query={query} categoryId={categoryId} />
    </div>
  );
}
export default SearchView;
