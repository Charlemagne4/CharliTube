import CommentsSection from '../ui/section/CommentsSection';
import SuggestionsSection from '../ui/section/SuggestionsSection';
import VideoSection from '../ui/section/VideoSection';

interface VideoViewProps {
  videoId: string;
  anonId: string;
}
function VideoView({ videoId, anonId }: VideoViewProps) {
  return (
    <div className="mx-auto mb-10 flex max-w-[1700px] flex-col px-4 pt-2.5">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1">
          <VideoSection videoId={videoId} anonId={anonId} />
          <div className="mt-4 block xl:hidden">
            <SuggestionsSection videoId={videoId} isManual />
          </div>
          <CommentsSection videoId={videoId} />
        </div>
        <div className="hidden w-full shrink xl:block xl:w-[380px] 2xl:w-[460px]">
          <SuggestionsSection videoId={videoId} />
        </div>
      </div>
    </div>
  );
}
export default VideoView;
