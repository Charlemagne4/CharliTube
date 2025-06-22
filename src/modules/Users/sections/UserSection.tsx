'use client';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import UserPageBanner, { UserPageBannerSkeleton } from '../ui/components/UserPageBanner';
import UserPageInfo, { UserPageInfoSkeleton } from '../ui/components/UserPageInfo';
import { Separator } from '@/components/ui/separator';

interface UserViewProps {
  userId: string;
}

function UserSection(props: UserViewProps) {
  return (
    <Suspense fallback={<UserSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error User Section</p>}>
        <UserSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default UserSection;

function UserSectionSkeleton() {
  return (
    <div className="flex flex-col">
      <UserPageBannerSkeleton />
      <UserPageInfoSkeleton />
      <Separator />
    </div>
  );
}

function UserSectionSuspense({ userId }: UserViewProps) {
  const [user] = trpc.users.getOne.useSuspenseQuery({ userId });
  return (
    <div>
      <UserPageBanner user={user} />
      <UserPageInfo user={user} />
      <Separator />
    </div>
  );
}
