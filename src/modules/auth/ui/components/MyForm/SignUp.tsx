'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import MyForm from './MyForm';
import { signUpFormSchema as formSchema } from './Schema';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';

export function SignUp() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (session) {
    redirect('/');
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '', // Ensure 'n
      email: '',
      password: ''
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios('/api/register', {
        method: 'POST',
        data: values,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(values);

      if (res.status === 200) {
        router.push('/'); // ✅ redirect after login
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }

    // const error: string = await signUp(values);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }
  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1>Sign Up</h1>
      <div className="rounded">
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
      </div>
    </div>
  );
}

export default SignUp;
