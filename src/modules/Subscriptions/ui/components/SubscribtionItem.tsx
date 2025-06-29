import UserAvatar from '@/components/UserAvatar';
import SubscriptionButton from './SubscriptionButton';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export interface SubscriptionItemProps {
  name: string;
  imageUrl: string;
  subscriberCount: number;
  onUnsubscribe: () => void;
  onSubscribe: () => void;
  disabled: boolean;
}

export function SubscribtionItemSkeleton() {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

function SubscribtionItem({
  name,
  imageUrl,
  subscriberCount,
  onUnsubscribe,
  onSubscribe,
  disabled,
}: SubscriptionItemProps) {
  const [isSubscribed, setIsSubscribed] = useState(true);

  return (
    <div className="flex items-start gap-4">
      <UserAvatar imageUrl={imageUrl} size={'lg'} name={name} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm">{name}</h3>
            <p className="text-muted-foreground text-xs">
              {subscriberCount.toLocaleString()} Subscribers
            </p>
          </div>
          <SubscriptionButton
            disabled={disabled}
            isSubscribed={isSubscribed}
            size={'sm'}
            onClick={(e) => {
              e.preventDefault();
              if (isSubscribed) {
                onUnsubscribe();
                setIsSubscribed(!isSubscribed);
              }
              if (!isSubscribed) {
                onSubscribe();
                setIsSubscribed(!isSubscribed);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
export default SubscribtionItem;
