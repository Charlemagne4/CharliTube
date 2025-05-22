import Link from 'next/link';
import { VideoGetOneOutput } from '../../types';
import UserAvatar from '@/components/UserAvatar';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import SubscriptionButton from '@/modules/Subscriptions/ui/components/SubscriptionButton';
import UserInfo from '@/modules/Users/ui/components/UserInfo';

interface VideoOwnerProps {
  user: VideoGetOneOutput['user'];
  videoId: VideoGetOneOutput['id'];
}

const nameFallback = 'Jean Michelle Bruitage';

function VideoOwner({ user, videoId }: VideoOwnerProps) {
  return (
    <Suspense fallback={<p>Loading Owner</p>}>
      <ErrorBoundary fallback={<p>Error Owner</p>}>
        <VideoOwnerSuspense user={user} videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default VideoOwner;
function VideoOwnerSuspense({ user, videoId }: VideoOwnerProps) {
  const { data: session, status } = useSession();
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 sm:items-start sm:justify-start">
      {/* TODO: make the link Dynamic example /Fireship/id */}
      <Link href={`/users/${user.id}`}>
        <div className="flex min-w-0 items-center justify-end gap-3">
          <UserAvatar
            size={'lg'}
            name={user.name || nameFallback}
            imageUrl={user.image || 'https://i.redd.it/jcilrifkq35a1.png'}
          />
          <div className="flex min-w-0 flex-col">
            <UserInfo name={user.name || nameFallback} size={'lg'} />
            {/* TODO: properly implement Subscribers data */}
            <span className="text-muted-foreground line-clamp-1 text-sm">0 subscribers</span>
          </div>
        </div>
      </Link>
      {status === 'loading' ? null : session?.user.id === user.id ? (
        <Button className="rounded-full" asChild variant="secondary">
          <Link href={`/studio/videos/${videoId}`}>Edit Video</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={() => console.log('Subscribe clicked')}
          disabled={false}
          isSubscribed={false}
          className="flex-none"
        />
      )}
    </div>
  );
}
