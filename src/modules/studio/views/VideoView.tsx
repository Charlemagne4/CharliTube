import FormSection from '../ui/section/FormSection';

interface VideoViewProps {
  videoId: string;
}

function VideoView({ videoId }: VideoViewProps) {
  return (
    <div className="max-w-screen-lg px-4 pt-2.5">
      <FormSection videoId={videoId} />
    </div>
  );
}
export default VideoView;
