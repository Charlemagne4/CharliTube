import VideoView from '@/modules/videos/views/VideoView';
import { HydrateClient, trpc } from '@/trpc/server';

interface pageProps {
  params: Promise<{ videoId: string }>;
}

async function page({ params }: pageProps) {
  const { videoId } = await params;

  void trpc.videos.getOne.prefetch({ videoId });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
export default page;
