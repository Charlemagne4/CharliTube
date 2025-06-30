import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/UserAvatar';
import { useSession } from 'next-auth/react';

import Link from 'next/link';

function StudioSidebarHeader() {
  const { data: session } = useSession();
  const { state } = useSidebar();

  const user = session?.user;

  if (state == 'collapsed') {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={'You Channel'} asChild>
          <Link prefetch href={'/users/current'}>
            <UserAvatar
              size={'sm'}
              imageUrl={user?.image as string}
              name={user?.name || 'User'}
              className="transition-opacity hover:opacity-80"
            />
            <span className="text-sm">Your Profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  if (!user)
    return (
      <SidebarHeader className="flex flex-col items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="mt-2 flex flex-col items-center gap-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </SidebarHeader>
    );

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link prefetch href={'/users/current'}>
        {user && (
          <UserAvatar
            imageUrl={user.image as string}
            name={user.name || 'User'}
            className="size-[112px] transition-opacity hover:opacity-80"
          ></UserAvatar>
        )}
      </Link>
      <div className="mt-2 flex flex-col items-center gap-y-1">
        <p className="text-sm font-medium">Your Profile </p>
        <p className="text-muted-foreground text-xs">{user.name}</p>
      </div>
    </SidebarHeader>
  );
}
export default StudioSidebarHeader;
