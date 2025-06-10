import TrendingVideosSection from '../sections/TrendingVideosSection';

function TrendingView() {
  return (
    <div className="mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">Trending</h1>
        <p className="text-muted-foreground text-xs">Most popular videos at the moment</p>
      </div>
      <TrendingVideosSection />
    </div>
  );
}
export default TrendingView;
