import { Skeleton } from '@/components/ui/skeleton';
import { THUMBNAIL_FALLBACK } from '@/constants';
import MuxPlayer from '@mux/mux-player-react';

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}
function VideoPlayer({ onPlay, thumbnailUrl, autoPlay, playbackId }: VideoPlayerProps) {
  // if (!playbackId) return null;
  return (
    <MuxPlayer
      playbackId={playbackId || ''}
      autoPlay={autoPlay}
      poster={thumbnailUrl || THUMBNAIL_FALLBACK}
      playerInitTime={0}
      thumbnailTime={0}
      className="size-full object-contain"
      accentColor="#ff2056"
      onPlay={onPlay}
    />
  );
}
export default VideoPlayer;

export function VideoPlayerSkeleton() {
  return <Skeleton className="aspect-video rounded-xl bg-black" />;
}
