'use client';

import { Button } from '@/components/ui/button';
import { ClapperboardIcon, LogOutIcon, UserCircleIcon, UserIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

import { logger } from '@/utils/pino';
import { USER_IMAGE_FALLBACK } from '@/constants';
import { Skeleton } from '@/components/ui/skeleton';

function AuthButtonSkeleton() {
  return (
    <div className="flex items-center justify-center gap-3">
      <Skeleton className="hidden h-8 w-20 rounded-full md:block" />
      <Skeleton className="size-10 rounded-full" />
    </div>
  );
}

function AuthButton() {
  const { data, status } = useSession();

  if (status === 'loading') return <AuthButtonSkeleton />;
  //TODO: make the signin button redirect to initial Page
  if (status === 'unauthenticated') {
    return (
      <Link prefetch href={'/signin'}>
        <Button
          variant={'outline'}
          className="flex items-center justify-center gap-3 rounded-full border-blue-500/20 text-sm font-medium text-blue-600 shadow-none hover:text-blue-500 [&_svg]:size-5"
        >
          <UserCircleIcon />
          Sign In
        </Button>
      </Link>
    );
  }

  if (status === 'authenticated') {
    logger.debug('user Role', data.user?.role);
    logger.debug('user ID', data?.user.id);

    logger.debug('user email', data?.user.email);
    return (
      //add menu items for studio and User Profile
      <DropdownMenu>
        <DropdownMenuTrigger
          className="text-md flex overflow-hidden rounded-full border-none font-medium text-blue-800 shadow-none hover:text-blue-500 focus:outline-none"
          // aria-haspopup="true"
        >
          <div className="flex items-center justify-center gap-3">
            <p className="hidden md:block">{data.user?.name || 'User'}</p>
            <Image
              className="rounded-full object-contain"
              src={data.user?.image || USER_IMAGE_FALLBACK} // TODO:Use a default image if not available
              alt="User image"
              width={40}
              height={40}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="">
          <DropdownMenuItem variant="default">
            <Link
              prefetch
              href={`/users/${data.user.id}`}
              className="flex items-center gap-3 text-lg"
            >
              <UserIcon size={20} />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem variant="default">
            <Link prefetch href={'/studio'} className="flex items-center gap-3 text-lg">
              <ClapperboardIcon size={20} />
              Studio
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="flex items-center gap-3 text-lg"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOutIcon size={20} />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
export default AuthButton;
