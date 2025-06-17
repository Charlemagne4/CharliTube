import PlaylistHeaderSection from '../sections/PlaylistHeaderSection';
import VideosSection from '../sections/VideosSection';

interface VideosViewProps {
  playlistId: string;
}

function VideosView({ playlistId }: VideosViewProps) {
  return (
    <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
      <PlaylistHeaderSection playlistId={playlistId} />
      <VideosSection playlistId={playlistId} />
    </div>
  );
}
export default VideosView;
