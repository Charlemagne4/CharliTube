import { cn } from '@/lib/utils';
import { UserGetOneOutput } from '../../types';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Edit2Icon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserPageBannerProps {
  user: UserGetOneOutput;
}

export function UserPageBannerSkeleton() {
  return <Skeleton className="h-[15vh] max-h-[200px] w-full md:h-[25vh]" />;
}

function UserPageBanner({ user }: UserPageBannerProps) {
  const { data: session } = useSession();

  return (
    <div className="group relative">
      {/* TODO: add upload banner modal */}
      <div
        className={cn(
          'h-[15vh] max-h-[200px] w-full rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 md:h-[25vh]',
          user.bannerUrl ? 'bg-cover bg-center' : 'bg-gray-100',
        )}
        style={{ backgroundImage: user.bannerUrl ? `url(${user.bannerUrl}` : undefined }}
      >
        {user.id === session?.user.id && (
          <Button
            type="button"
            size={'icon'}
            className="absolute top-4 right-4 rounded-full bg-black/50 opacity-100 transition-opacity duration-300 group-hover:opacity-100 hover:bg-black/50 md:opacity-0"
          >
            <Edit2Icon className="text-secondary size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
export default UserPageBanner;
