'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import MyForm from './MyForm';
import { signInFormSchema as formSchema } from './Schema';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function SignIn() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string>();
  const router = useRouter();

  const searchParams = useSearchParams();
  const authError = searchParams.get('error');

  useEffect(() => {
    if (authError) {
      if (authError === 'OAuthAccountNotLinked') {
        setError('That email is already linked to another provider.');
      } else {
        setError(`Sign in error: ${authError}`);
      }
      console.log(authError);
    }
  }, [authError]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios.post('/api/login', values, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.status === 200) {
        router.push('/'); // ✅ redirect after login
      } else {
        setError(res.data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message || 'Login failed');
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="w-2/3 rounded p-20">
          <h1>Sign In</h1>
          <Form {...form}>
            <div className="mb-4 flex gap-20">
              <Button onClick={() => signIn('github', { callbackUrl: '/' })}>
                Sign in with GitHub
              </Button>
              <Button onClick={() => signIn('discord', { callbackUrl: '/' })}>
                Sign in with Discord
              </Button>
            </div>

            <MyForm form={form} onSubmit={onSubmit} />
          </Form>
          {error && <h6 className="bg-red-600 p-2 text-white">{error}</h6>}
        </div>

        <span>let&apos;s say this is the rest of the page</span>
      </div>
    );
  }
  // console.log(session?.user?.role);
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p>Welcome, {session?.user?.name}</p>
      {session?.user?.image && (
        <Image src={session.user.image} alt="" height={400} width={400}></Image>
      )}
      <Button variant={'destructive'} onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}

export default SignIn;
