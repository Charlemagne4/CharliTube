import Link from 'next/link';
import { VideoGetOneOutput } from '../../types';
import UserAvatar from '@/components/UserAvatar';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import SubscriptionButton from '@/modules/Subscriptions/ui/components/SubscriptionButton';
import UserInfo from '@/modules/Users/ui/components/UserInfo';
import useSubscriptions from '@/modules/Subscriptions/hooks/useSubscriptions';

interface VideoOwnerProps {
  user: VideoGetOneOutput['user'];
  videoId: VideoGetOneOutput['id'];
}

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
  const { isPending, onClick, status, isSubscribed, session } = useSubscriptions({
    userId: user.id,
    fromVideoId: videoId,
  });

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 sm:items-start sm:justify-start">
      {/* TODO: make the link Dynamic example /Fireship/id */}
      <Link prefetch href={`/users/${user.id}`}>
        <div className="flex min-w-0 items-center justify-end gap-3">
          <UserAvatar size={'lg'} name={user.name} imageUrl={user.image} />
          <div className="flex min-w-0 flex-col">
            <UserInfo name={user.name} size={'lg'} />
            {/* TODO: properly implement Subscribers data */}
            <span className="text-muted-foreground line-clamp-1 text-sm">
              {user._count.Subscribers} Subscribers
            </span>
          </div>
        </div>
      </Link>
      {status === 'loading' ? null : session?.user.id === user.id ? (
        <Button className="rounded-full" asChild variant="secondary">
          <Link prefetch href={`/studio/videos/${videoId}`}>
            Edit Video
          </Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={onClick}
          disabled={isPending}
          isSubscribed={isSubscribed || false}
          className="flex-none"
        />
      )}
    </div>
  );
}
