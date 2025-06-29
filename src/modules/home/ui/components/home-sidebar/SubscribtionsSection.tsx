'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/UserAvatar';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import { ListIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SubscribtionSectionSkeleton() {
  return (
    <>
      {Array.from({ length: DEFAULT_LIMIT }).map((_, idx) => (
        <div key={idx}>
          <SidebarMenuButton disabled>
            <Skeleton className="size-6 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </SidebarMenuButton>
        </div>
      ))}
    </>
  );
}

function SubscribtionsSection() {
  const pathname = usePathname();

  const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (page) => page.nextCursor },
  );

  const subscriptions = data?.pages.flatMap((page) => page.items);
  if (isLoading) return <SubscribtionSectionSkeleton />;

  if (subscriptions && subscriptions.length > 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {subscriptions?.map((subscription) => (
              <SidebarMenuItem key={`${subscription.creatorId}-${subscription.viewerId}`}>
                <SidebarMenuButton
                  tooltip={subscription.creator.name || 'NULL'}
                  asChild
                  isActive={`/users/${subscription.creator.id}` === pathname}
                >
                  <Link
                    href={`/users/${subscription.creator.id}`}
                    className="flex items-center gap-4"
                  >
                    <UserAvatar
                      size={'sm'}
                      imageUrl={subscription.creator.image}
                      name={subscription.creator.name}
                    />
                    <span className="text-sm">{subscription.creator.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {!isLoading && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={'/subscribtions' === pathname}>
                  <Link href={'/subscribtions'} className="flex items-center gap-4">
                    <ListIcon className="size-4" />
                    <span>All Subscribtions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }
}
export default SubscribtionsSection;
