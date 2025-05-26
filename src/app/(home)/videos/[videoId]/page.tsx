import VideoView from '@/modules/videos/views/VideoView';
import { HydrateClient, trpc } from '@/trpc/server';
import { cookies } from 'next/headers';

interface pageProps {
  params: Promise<{ videoId: string }>;
}

async function page({ params }: pageProps) {
  const cookieStore = await cookies();
  const anonId = cookieStore.get('anonId')?.value ?? null;
  if (!anonId) {
    console.error('ANON IDENTIFCATION IS NULL');
  }
  const { videoId } = await params;

  void trpc.videos.getOne.prefetch({ videoId });
  void trpc.reactions.getOne.prefetch({ videoId });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} anonId={anonId as string} />
    </HydrateClient>
  );
}
export default page;
