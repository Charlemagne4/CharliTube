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

import { Suspense } from 'react';
import { logger } from '@/utils/pino';

export function AuthButton() {
  return (
    <Suspense fallback={<Button disabled>Loading...</Button>}>
      <SessionContent />
    </Suspense>
  );
}

function SessionContent() {
  const { data, status } = useSession();

  if (status === 'loading') return <div>loading...</div>;
  //TODO: make the signin button redirect to initial Page
  if (status === 'unauthenticated') {
    return (
      <Link prefetch href={'/signin'}>
        <Button
          variant={'outline'}
          className="rounded-full border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 shadow-none hover:text-blue-500 [&_svg]:size-5"
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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="text-md flex gap-3 overflow-hidden rounded-full border-none px-4 py-2 font-medium text-blue-800 shadow-none hover:text-blue-500 focus:outline-none"
          // aria-haspopup="true"
        >
          <div className="flex items-center justify-center gap-3">
            <p>{data.user?.name || 'User'}</p>
            <Image
              className="rounded-full object-contain"
              src={data.user?.image || ''} // TODO:Use a default image if not available
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
