import { THUMBNAIL_FALLBACK } from '@/constants';
import { playlistGetManyOutput } from '@/modules/playlists/types';
import Link from 'next/link';
import PlaylistThumbnail, { PlaylistThumbnailSkeleton } from './PlaylistThumbnail';
import PlaylistInfo, { PlaylistInfoSkeleton } from './PlaylistInfo';

interface PlaylistGridCardProps {
  data: playlistGetManyOutput['items'][number];
}

export function PlaylistGridCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <PlaylistThumbnailSkeleton />
      <PlaylistInfoSkeleton />
    </div>
  );
}

function PlaylistGridCard({ data }: PlaylistGridCardProps) {
  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="group flex w-full flex-col gap-2">
        <PlaylistThumbnail
          imageUrl={data.playListVideos?.[0]?.video?.thumbnailUrl || THUMBNAIL_FALLBACK}
          title={data.name}
          videoCount={data._count.playListVideos}
        />
        <PlaylistInfo data={data} />
      </div>
    </Link>
  );
}
export default PlaylistGridCard;
