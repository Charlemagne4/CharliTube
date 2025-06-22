import { DEFAULT_LIMIT } from '@/constants';
import UserView from '@/modules/Users/views/UserView';
import { HydrateClient, trpc } from '@/trpc/server';

interface Userspage {
  params: Promise<{
    userId: string;
  }>;
}

async function Userspage({ params }: Userspage) {
  const { userId } = await params;

  void trpc.users.getOne.prefetch({ userId });
  void trpc.videos.getMany.prefetchInfinite({ userId, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
}
export default Userspage;
