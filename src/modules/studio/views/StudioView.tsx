import VideoSection from '../ui/section/VideoSection';

function StudioView() {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Channel Content</h1>
        <p className="text-muted-foreground text-xs">Manage you channel content and videos</p>
      </div>
      <VideoSection />
    </div>
  );
}
export default StudioView;
