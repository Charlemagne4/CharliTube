import LikedVideosSection from '../sections/LikedVideosSection';

function LikedView() {
  return (
    <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">Liked</h1>
        <p className="text-muted-foreground text-xs">You favorite videos</p>
      </div>
      <LikedVideosSection />
    </div>
  );
}
export default LikedView;
