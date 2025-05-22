import VideoSection from '../ui/section/VideoSection';

interface VideoViewProps {
  videoId: string;
}
function VideoView({ videoId }: VideoViewProps) {
  return (
    <div className="mx-auto mb-10 flex max-w-[1700px] flex-col px-4 pt-2.5">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1"></div>
      </div>
      <VideoSection videoId={videoId} />
    </div>
  );
}
export default VideoView;
