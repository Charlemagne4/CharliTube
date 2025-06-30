import VideoView from '@/modules/studio/views/VideoView';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic'; // add this whenever we prefetch

interface pageProps {
  params: Promise<{ videoId: string }>;
}

async function page({ params }: pageProps) {
  const { videoId } = await params;

  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
export default page;
