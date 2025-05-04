'use client';

import { Button } from '@/components/ui/button';
import { UserCircleIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function AuthButton() {
  //TODO: add different auth states
  const { data, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>loading...</div>;

  if (status === 'unauthenticated') {
    return (
      <Button
        onClick={() => router.push('/signin')}
        variant={'outline'}
        className="py2 rounded-full border-blue-500/20 px-4 text-sm font-medium text-blue-600 shadow-none hover:text-blue-500 [&_svg]:size-5"
      >
        <UserCircleIcon />
        Sign In
      </Button>
    );
  }

  if (status === 'authenticated') {
    return (
      <Button
        variant={'outline'}
        onClick={() => signOut()}
        className="text-md flex gap-3 rounded-full border-none px-4 py-2 font-medium text-blue-800 shadow-none hover:text-blue-500"
      >
        <p>{data.user?.name}</p>
        <Image
          className="rounded-full object-contain"
          src={data.user?.image || ''}
          alt="User image"
          width={40}
          height={40}
        />
      </Button>
    );
  }
}
export default AuthButton;
