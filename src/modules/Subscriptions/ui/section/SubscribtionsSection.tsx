'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { DEFAULT_LIMIT, THUMBNAIL_FALLBACK } from '@/constants';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
import SubscribtionItem, { SubscribtionItemSkeleton } from '../components/SubscribtionItem';

function SubscriptionsSection() {
  return (
    <Suspense fallback={<SubscriptionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error History Feed</p>}>
        <SubscriptionsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}
export default SubscriptionsSection;

function SubscriptionsSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, idx) => (
        <SubscribtionItemSkeleton key={idx} />
      ))}
    </div>
  );
}

function SubscriptionsSectionSuspense() {
  const utils = trpc.useUtils();

  const [subscriptions, query] = trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (page) => page.nextCursor },
  );
  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: (data) => {
      utils.subscriptions.getOne.invalidate({ userId: data.creatorId });
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ userId: data.creatorId });

      toast.success('Subscribed');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: (data) => {
      utils.subscriptions.getOne.invalidate({ userId: data.creatorId });
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ userId: data.creatorId });

      toast.success('Unsubscribed');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <div>
      <div className="flex flex-col gap-4">
        {subscriptions.pages
          .flatMap((page) => page.items)
          .map((subscribtion) => (
            <Link href={`/users/${subscribtion.creatorId}`} key={subscribtion.id}>
              <SubscribtionItem
                name={subscribtion.creator.name || 'NULL'}
                imageUrl={subscribtion.creator.image || THUMBNAIL_FALLBACK}
                subscriberCount={subscribtion.creator._count.Subscribers}
                onUnsubscribe={() => unsubscribe.mutate({ userId: subscribtion.creator.id })}
                onSubscribe={() => subscribe.mutate({ userId: subscribtion.creator.id })}
                disabled={unsubscribe.isPending || subscribe.isPending}
              />
            </Link>
          ))}
      </div>

      <InfiniteScroll isManual={false} {...query} />
    </div>
  );
}
