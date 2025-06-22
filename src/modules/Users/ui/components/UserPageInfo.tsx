import UserAvatar from '@/components/UserAvatar';
import { UserGetOneOutput } from '../../types';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SubscriptionButton from '@/modules/Subscriptions/ui/components/SubscriptionButton';
import useSubscriptions from '@/modules/Subscriptions/hooks/useSubscriptions';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface UserPageInfoProps {
  user: UserGetOneOutput;
}

export function UserPageInfoSkeleton() {
  return (
    <div className="py-6">
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <Skeleton className="h-[60px] w-[60px] rounded-full" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1 h-4 w-48" />
          </div>
        </div>
        <Skeleton className="mt-3 h-10 w-full rounded-full" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden items-start gap-4 md:flex">
        <Skeleton className="h-[160px] w-[160px] rounded-full" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-4 h-5 w-48" />
          <Skeleton className="mt-3 h-10 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function UserPageInfo({ user }: UserPageInfoProps) {
  const { data: session } = useSession();
  const { isPending, onClick, status } = useSubscriptions({ userId: user.id });

  return (
    <div className="py-6">
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            className="h-[60px] w-[60px]"
            size={'lg'}
            imageUrl={user.image}
            name={user.name}
            // TODO: onClick is supposed to open a modal to manage account
            onClick={() => {}}
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <span>{user._count.Subscribers} subscribers</span>
              <span>&bull;</span>
              <span>{user._count.Videos} Videos</span>
            </div>
          </div>
        </div>
        {session?.user.id === user.id ? (
          <Button variant={'secondary'} asChild className="mt-3 w-full rounded-full">
            <Link href={'/studio'}>Go to studio</Link>
          </Button>
        ) : (
          <SubscriptionButton
            disabled={isPending || status === 'loading'}
            isSubscribed={user.currentIsSubscribed}
            onClick={onClick}
            className="mt-5 w-full"
          />
        )}
      </div>
      <div className="hidden items-start gap-4 md:flex">
        <UserAvatar
          className={cn(
            session?.user.id === user.id &&
              'cursor-pointer transition-opacity duration-300 hover:opacity-80',
          )}
          size={'xl'}
          imageUrl={user.image}
          name={user.name}
          // TODO: onClick is supposed to open a modal to manage account
          onClick={() => {}}
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <div className="text-muted-foreground mt-3 flex items-center gap-1 text-sm">
            <span>{user._count.Subscribers} subscribers</span>
            <span>&bull;</span>
            <span>{user._count.Videos} Videos</span>
          </div>
          {session?.user.id === user.id ? (
            <Button variant={'secondary'} asChild className="mt-3 rounded-full">
              <Link href={'/studio'}>Go to studio</Link>
            </Button>
          ) : (
            <SubscriptionButton
              disabled={isPending || status === 'loading'}
              isSubscribed={user.currentIsSubscribed}
              onClick={onClick}
              className="mt-5"
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default UserPageInfo;
